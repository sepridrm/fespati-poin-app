import { createRef, useEffect, useState } from 'react';
import '../../index.css';
import logo from '../../assets/logo.png';
import { firestore } from '../../firebase';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, orderBy, query, deleteDoc, doc, where } from 'firebase/firestore';
import { firebaseConfig } from '../../utils/config';
import { ListPeserta } from './ListPeserta';
import readXlsxFile from 'read-excel-file'
import { ListImportPeserta } from './ListImportPeserta';
import Select from 'react-select';
import TemplateExcel from '../../assets/Template_Import_Peserta.xlsx';
import { downloadExcel } from 'react-export-table-to-excel';
import { UseAuth } from '../../routes/useAuth';
import { useNavigate } from "react-router-dom";

initializeApp(firebaseConfig());
const db = getFirestore();

const DataPeserta = () => {
    const [peserta, setPeserta] = useState([]);
    const [events, setEvents] = useState([]);
    const [selected_event, setSelectedEvent] = useState({});
    const [kategoris, setKategoris] = useState([]);
    const [import_peserta, setImportPeserta] = useState([]);
    const [mode, setMode] = useState('Lihat');
    const [selected_peserta, setSelectedPeserta] = useState({});
    const [tambah_peserta, setTambahPeserta] = useState({});
    const [kode_peserta, setKodePeserta] = useState('');
    const [id_event, setIdEvent] = useState('');
    const [search, setSearch] = useState('');
    const [search_data, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const closeModal = createRef(null);
    const importModal = createRef(null);
    const fileInput = createRef(null);

    const useAuth = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        resetTambahPeserta();

        if (useAuth.user.role === 'panitia')
            firestore.getEventId(useAuth.user.id_event).then(res => {
                const temp = [];
                temp.push(
                    { label: res.nama_event, value: JSON.stringify(res) },
                )
                setEvents(temp);
            })
        else
            firestore.getEvent(useAuth.user.collection).then(res => {
                const temp = [];
                res.forEach(element => {
                    temp.push(
                        { label: element.nama_event, value: JSON.stringify(element) },
                    )
                });
                setEvents(temp);
            })

    }, [])

    const getPeserta = (event) => {
        let q;
        if (useAuth.user.role === 'panitia')
            q = query(collection(db, "peserta"), where('id_event', '==', useAuth.user.id_event), orderBy("kategori", "asc"), orderBy("tim", "asc"));
        else
            q = query(collection(db, "peserta"), where('id_admin', '==', useAuth.user.collection), where('id_event', '==', event), orderBy("kategori", "asc"), orderBy("tim", "asc"));

        onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const event = events.find(({ value }) => JSON.parse(value).collection === doc.data().id_event)
                const temp = {
                    ...doc.data(),
                    collection: doc.id,
                    event
                }
                data.push(temp);
            });
            setPeserta(data);
        })
    }

    const listKategori = (event) => {
        const temp = []
        event.kategori.forEach(element => {
            temp.push(
                { label: element.nama_kategori, value: element.nama_kategori }
            )
        })

        setKategoris(temp)
    }

    const onChangePeserta = (title, event) => {
        const temp = { ...selected_peserta };
        temp[title] = event.target ? event.target.value : event;
        setSelectedPeserta(temp);
    }

    const onChangeTambahPeserta = (title, event) => {
        const temp = { ...tambah_peserta };
        temp[title] = event.target ? event.target.value : event;
        setTambahPeserta(temp);
    }

    const resetTambahPeserta = () => {
        setTambahPeserta({
            id_event: '',
            kode_peserta: '',
            nama: '',
            tim: '',
            kategori: '',
            bantalan: '',
            target: '',
            sesi: ''
        })
    }

    function searchFilter(text) {
        setSearch(text);

        const newData = peserta.filter(item => {
            const itemData = `${item.kategori.toUpperCase()} || ${item.tim.toUpperCase()} || ${item.kode_peserta.toUpperCase()} || ${item.nama.toUpperCase()} || ${item.bantalan ? item.bantalan.toUpperCase() : ''} || ${item.target ? item.target.toUpperCase() : ''} || ${item.sesi ? item.sesi.toUpperCase() : ''}}`
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setSearchData(newData);
    }

    const tambahPeserta = () => {
        if (tambah_peserta.kategori === '' || tambah_peserta.tim === '' || tambah_peserta.kode_peserta === '' ||
            tambah_peserta.nama === '' || tambah_peserta.id_event === '' || selected_peserta.bantalan === '' ||
            selected_peserta.target === '' || selected_peserta.sesi === '') {
            setErrMessage('Silahkan lengkapi data');
            return;
        }

        const existKode = peserta.find(element => element.kode_peserta === tambah_peserta.kode_peserta);
        if (existKode && existKode.id_event === tambah_peserta.id_event) {
            // console.log(existKode);
            setErrMessage('Kode peserta sudah digunakan oleh peserta lain');
            return;
        }

        setLoading(true);
        const data = { ...tambah_peserta };
        data.id_admin = useAuth.user.role === 'panitia' ? useAuth.user.id_admin : useAuth.user.collection;
        if (useAuth.user.role === 'panitia')
            data.id_panitia = useAuth.user.collection;
        data.rambahan = 1;
        data.total_skor = 0;
        firestore.savePeserta(data).then(res => {
            setLoading(false);
            console.log(res);
        })
        closeModal.current.click();
    }

    const importPeserta = () => {
        if (id_event === '') {
            setErrMessage('Silahkan pilih event');
            return;
        }

        import_peserta.forEach((element, index) => {
            if (index > 0) {
                const data = {
                    id_admin: useAuth.user.role === 'panitia' ? useAuth.user.id_admin : useAuth.user.collection,
                    id_event: id_event,
                    kode_peserta: element[1].trim(),
                    nama: element[2].trim(),
                    tim: element[3].trim(),
                    kategori: element[4].trim(),
                    bantalan: element[5],
                    target: element[6],
                    sesi: element[7],
                    total_skor: 0,
                    rambahan: 1
                }
                if (useAuth.user.role === 'panitia')
                    data.id_panitia = useAuth.user.collection;

                firestore.savePeserta(data).then(res => {
                    console.log(res);
                })
            }
        });

        closeModal.current.click();
    }

    const updatePeserta = () => {
        if (selected_peserta.kategori === '' || selected_peserta.tim === '' || selected_peserta.kode_peserta === '' ||
            selected_peserta.nama === '' || selected_peserta.id_event === '' || selected_peserta.bantalan === '' ||
            selected_peserta.target === '' || selected_peserta.sesi === '') {
            setErrMessage('Silahkan lengkapi data');
            return;
        }

        if (kode_peserta !== selected_peserta.kode_peserta || id_event !== selected_peserta.id_event) {
            const existKode = peserta.filter(element => element.kode_peserta === selected_peserta.kode_peserta && element.id_event === selected_peserta.id_event);
            if (existKode.length > 0) {
                setErrMessage('Kode peserta sudah digunakan oleh peserta lain');
                return;
            }
        }

        setLoading(true);
        const data = { ...selected_peserta };
        if (useAuth.user.role === 'panitia')
            data.id_panitia = useAuth.user.collection;
        delete data.event;
        delete data.collection;
        firestore.updatePeserta(selected_peserta.collection, data).then(res => {
            setLoading(false);
            firestore.getSkorPeserta(selected_peserta.collection).then(res => {
                res.forEach(element => {
                    const data = { ...selected_peserta };
                    delete data.total_skor;
                    delete data.event;
                    delete data.rambahan;
                    delete data.collection;
                    firestore.updateSkor(element.collection, data).then(res => {
                        console.log(res);
                    })
                });
            })
            console.log(res);
        })
        closeModal.current.click();
    }

    const deletePeserta = () => {
        setLoading(true);
        deleteDoc(doc(db, "peserta", selected_peserta.collection)).then(() => {
            firestore.getSkorPeserta(kode_peserta).then(res => {
                res.forEach(element => {
                    deleteDoc(doc(db, "skor", element.collection)).then(() => {
                        console.log(true);
                    })
                })
            })
            console.log(true);
            setLoading(false);
        });
        closeModal.current.click();
    }

    const importExcel = (event) => {
        setIdEvent('');
        readXlsxFile(event.target.files[0]).then((rows) => {
            setImportPeserta(rows);
            setMode('Import');
            fileInput.current.value = "";
            importModal.current.click();
        })
    }

    const exportExcel = () => {
        const header = ["Kode Pegiat", "Nama Pegiat", "Nama Klub/Provinsi", "Kategori", "Bantalan", "Target", "Sesi"];
        let body;
        let title;
        if (search) {
            title = search_data[0].event.label
            body = search_data.map(elt => [elt.kode_peserta, elt.nama, elt.tim, elt.kategori, elt.bantalan, elt.target, elt.sesi]);
        } else {
            title = peserta[0].event.label
            body = peserta.map(elt => [elt.kode_peserta, elt.nama, elt.tim, elt.kategori, elt.bantalan, elt.target, elt.sesi]);
        }

        downloadExcel({
            fileName: "Data Peserta " + title,
            sheet: "Data Peserta " + title,
            tablePayload: {
                header,
                body: body,
            },
        })
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm">
                <div className="container-fluid">
                    <i onClick={() => navigate(-1)} className="fa-sharp fa-solid fa-circle-arrow-left fa-2xl ms-2"></i>
                    <a className="navbar-brand">
                        <img src={logo} width="35" height="35" />
                    </a>
                </div>
            </nav>

            <div className="container mt-5 pt-4">
                <img className="logo-1 mt-2" src={logo} />
                <h6 className='mt-2'>Data Peserta</h6>
            </div>

            <div className="card shadow rounded border-0 m-3 mt-3">
                <div className="card-body">
                    <div className='d-flex align-items-center w-100 mb-4'>
                        <div className="input-group me-auto">
                            <div className="input-group">
                                <span className="input-group-text">Event</span>
                                <Select isSearchable placeholder="Pilih Event" options={events} onChange={(element) => (getPeserta(JSON.parse(element.value).collection), setSelectedEvent(JSON.parse(element.value)), listKategori(JSON.parse(element.value)))} />
                            </div>
                            <span className="input-group-text">Cari peserta</span>
                            <input type="text" className="form-control" value={search} onChange={(event) => searchFilter(event.target.value)} style={{ maxWidth: 350 }} />
                        </div>
                        <div className='justify-content-end p-0'>
                            <button onClick={() => setMode('Tambah')} className="btn btn-sm btn-info mx-1 my-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#pesertaModal">Tambah</button>
                            <label htmlFor="import-peserta" className="btn btn-sm btn-info mx-1 my-1 px-3 text-white">Import</label>
                            <button onClick={() => exportExcel()} className="btn btn-sm btn-info mx-1 my-1 px-3 text-white"><i className="fa fa-download"></i></button>
                            <input hidden ref={fileInput} type="file" id='import-peserta' className="form-control" style={{ maxWidth: 300 }} onChange={(event) => importExcel(event)} />
                            <button hidden ref={importModal} className="btn btn-sm btn-info mx-1 my-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#pesertaModal">Import</button>
                            <a href={TemplateExcel} download="Template Import Peserta" target='_blank'>
                                <button className="btn btn-sm btn-info mx-1 my-1 px-3 text-white">Template</button>
                            </a>
                        </div>
                    </div>

                    <ListPeserta data={search ? search_data : peserta} setMode={setMode} setSelectedPeserta={setSelectedPeserta} setKodePeserta={setKodePeserta} setIdEvent={setIdEvent} />
                </div>
            </div>

            <div className="modal fade" id="pesertaModal" tabIndex="-1" aria-hidden="true">
                <div className={mode === 'Import' ? "modal-dialog modal-dialog-centered modal-xl" : "modal-dialog modal-dialog-centered"}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{mode}</h5>
                            <button onClick={() => (setErrMessage(''), resetTambahPeserta())} ref={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {mode === 'Tambah' ?
                            <div className="modal-body">
                                <div className="input-group mt-2">
                                    <span className="input-group-text">Event</span>
                                    <Select isSearchable placeholder="Pilih Event" options={events} onChange={(element) => (onChangeTambahPeserta('id_event', JSON.parse(element.value).collection), listKategori(JSON.parse(element.value)))} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Kode Pegiat</span>
                                    <input required type="text" className="form-control" value={tambah_peserta.kode_peserta} onChange={(event) => onChangeTambahPeserta('kode_peserta', event)} />
                                </div>
                                <div className="input-group mt-3 mb-2">
                                    <span className="input-group-text">Nama Pegiat</span>
                                    <input required type="text" className="form-control" value={tambah_peserta.nama} onChange={(event) => onChangeTambahPeserta('nama', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Nama Klub/Provinsi</span>
                                    <input required type="text" className="form-control" value={tambah_peserta.tim} onChange={(event) => onChangeTambahPeserta('tim', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Kategori</span>
                                    <Select isSearchable placeholder="Pilih Event" options={kategoris} onChange={(element) => onChangeTambahPeserta('kategori', element.value)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Bantalan</span>
                                    <input required type="text" className="form-control" value={tambah_peserta.bantalan} onChange={(event) => onChangeTambahPeserta('bantalan', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Target</span>
                                    <input required type="text" className="form-control" value={tambah_peserta.target} onChange={(event) => onChangeTambahPeserta('target', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Sesi</span>
                                    <input required type="text" className="form-control" value={tambah_peserta.sesi} onChange={(event) => onChangeTambahPeserta('sesi', event)} />
                                </div>

                                {errMessage ?
                                    <div className="alert alert-danger mt-4" role="alert">
                                        {errMessage}
                                    </div>
                                    : null}
                            </div>
                            : mode === 'Import' ?
                                <div className="modal-body">
                                    <ListImportPeserta data={import_peserta} />

                                    {errMessage ?
                                        <div className="alert alert-danger mt-4" role="alert">
                                            {errMessage}
                                        </div>
                                        : null}
                                </div>
                                : mode === 'Ubah' ?
                                    <div className="modal-body">
                                        <div className="input-group mt-2">
                                            <span className="input-group-text">Event</span>
                                            <Select isSearchable placeholder="Pilih Event" value={events.find(({ value }) => JSON.parse(value).collection === selected_peserta.id_event)} options={events} onChange={(element) => onChangePeserta('id_event', element.value)} />
                                        </div>
                                        <div className="input-group mt-3">
                                            <span className="input-group-text">Kode Pegiat</span>
                                            <input required type="text" className="form-control" value={selected_peserta.kode_peserta} onChange={(event) => onChangePeserta('kode_peserta', event)} />
                                        </div>
                                        <div className="input-group mt-3 mb-2">
                                            <span className="input-group-text">Nama Pegiat</span>
                                            <input required type="text" className="form-control" value={selected_peserta.nama} onChange={(event) => onChangePeserta('nama', event)} />
                                        </div>
                                        <div className="input-group mt-3">
                                            <span className="input-group-text">Nama Klub/Provinsi</span>
                                            <input required type="text" className="form-control" value={selected_peserta.tim} onChange={(event) => onChangePeserta('tim', event)} />
                                        </div>
                                        <div className="input-group mt-3">
                                            <span className="input-group-text">Kategori</span>
                                            <Select isSearchable placeholder="Pilih Event" value={kategoris.find(({ value }) => value === selected_peserta.kategori)} options={kategoris} onChange={(element) => onChangePeserta('kategori', element.value)} />
                                        </div>
                                        <div className="input-group mt-3">
                                            <span className="input-group-text">Bantalan</span>
                                            <input required type="text" className="form-control" value={selected_peserta.bantalan} onChange={(event) => onChangePeserta('bantalan', event)} />
                                        </div>
                                        <div className="input-group mt-3">
                                            <span className="input-group-text">Target</span>
                                            <input type="text" className="form-control" value={selected_peserta.target ? selected_peserta.target : ''} onChange={(event) => onChangePeserta('target', event)} />
                                        </div>
                                        <div className="input-group mt-3">
                                            <span className="input-group-text">Sesi</span>
                                            <input required type="text" className="form-control" value={selected_peserta.sesi} onChange={(event) => onChangePeserta('sesi', event)} />
                                        </div>

                                        {errMessage ?
                                            <div className="alert alert-danger mt-4" role="alert">
                                                {errMessage}
                                            </div>
                                            : null}
                                    </div>
                                    : mode === 'Hapus' ?
                                        <div className="modal-body">
                                            <div style={{ fontWeight: 'bold' }}>Hapus peserta {selected_peserta.nama} ?</div>
                                        </div>
                                        : null
                        }
                        <div className="modal-footer">
                            <button onClick={() => (setErrMessage(''), resetTambahPeserta())} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            {mode === 'Tambah' ?
                                <button onClick={() => tambahPeserta()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                : mode === 'Import' ?
                                    <>
                                        <Select isSearchable placeholder="Pilih Event" options={events} onChange={(element) => setIdEvent(element.value)} />
                                        <button onClick={() => importPeserta()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                    </>
                                    : mode === 'Ubah' ?
                                        <button onClick={() => updatePeserta()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                        : mode === 'Hapus' ?
                                            <button onClick={() => deletePeserta()} type="button" className="btn btn-danger ">Hapus</button>
                                            : null
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* {errMessage ?
                <div className="alert alert-danger" role="alert" style={{ position: 'absolute', bottom: 50, left: '20%', right: '20%' }}>
                    {errMessage}
                </div>
                : null
            } */}
        </>
    )
}

export default DataPeserta