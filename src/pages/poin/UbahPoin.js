import { createRef, useEffect, useState } from 'react';
import '../../index.css';
import logo from '../../assets/logo.png';
import Select from 'react-select';

import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, orderBy, query, where, deleteDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../../utils/config';
import { ListPoin } from './ListPoin';
import { firestore } from '../../firebase';

import { UseAuth } from '../../routes/useAuth';
import { getKategori } from '../../utils/helpers';
import { useNavigate } from "react-router-dom";

initializeApp(firebaseConfig());
const db = getFirestore();

const UbahPoin = () => {
    const [event, setEvent] = useState([]);
    const [selected_event, setSelectedEvent] = useState({});
    const [peserta, setPeserta] = useState([]);
    const [skor_peserta, setSkorPeserta] = useState([]);
    const [selected_peserta, setSelectedPeserta] = useState({});
    const [selected_skor_peserta, setSelectedSkorPeserta] = useState({});
    const [kategori, setKategori] = useState({});
    const [mode, setMode] = useState('Lihat');
    const [loading, setLoading] = useState(false);

    const closeModal = createRef(null);
    const useAuth = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getEvent();
    }, [])

    const getEvent = () => {
        if (useAuth.user.role === 'panitia')
            firestore.getEventId(useAuth.user.id_event).then(res => {
                const temp = [];
                temp.push(
                    { label: res.nama_event, value: JSON.stringify(res) },
                )
                setEvent(temp);
                setSelectedEvent(res);
                getPeserta(res);
            })
        else
            firestore.getEvent(useAuth.user.collection).then(res => {
                const temp = [];
                res.forEach(element => {
                    temp.push(
                        { label: element.nama_event, value: JSON.stringify(element) },
                    )
                });
                setEvent(temp);
            })

        // const q = query(collection(db, `event`), where('id_admin', '==', useAuth.user.collection));
        // onSnapshot(q, (querySnapshot) => {
        //     const data = [];
        //     querySnapshot.forEach((doc) => {
        //         const temp = {
        //             ...doc.data(),
        //             collection: doc.id
        //         }
        //         data.push(
        //             { label: doc.data().nama_event, value: JSON.stringify(temp) },
        //         );
        //     });
        //     setEvent(data);
        // })
    }

    const getPeserta = (event) => {
        const q = query(collection(db, `peserta`), where("id_event", "==", event.collection), orderBy("kode_peserta", "asc"));
        onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const temp = {
                    ...doc.data(),
                    collection: doc.id
                }
                data.push({ label: doc.data().kode_peserta, value: JSON.stringify(temp) });

            });
            setPeserta(data);
        })
    }

    const getSkor = (selected_peserta) => {
        const q = query(collection(db, "skor"), where("id_peserta", "==", selected_peserta.collection), orderBy("rambahan", "asc"));
        onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const temp = {
                    ...doc.data(),
                    collection: doc.id
                }
                data.push(temp);

            });
            setSkorPeserta(data);
        })
    }

    // const onChangePeserta = (title, event) => {
    //     const temp = { ...selected_peserta };
    //     temp[title] = event.target.value;
    //     setSelectedPeserta(temp);
    // }

    const onChangeSkorPeserta = (title, event) => {
        const temp = { ...selected_skor_peserta };
        if (temp[title] !== undefined)
            temp[title] = event.target.value ? parseInt(event.target.value) : '';
        else
            temp.data[title].skor = event.target.value ? parseInt(event.target.value) : '';

        let total_skor_rambahan = 0;
        let skor_max3 = 0;
        let skor_max2 = 0;
        let skor_max1 = 0;

        temp.data.forEach(element => {
            total_skor_rambahan = total_skor_rambahan + (element.skor ? parseInt(element.skor) : 0);
            if (element.skor === kategori.max_poin - 2 || element.skor === (kategori.max_poin - 2).toString())
                skor_max3 = skor_max3 + 1;
            if (element.skor === kategori.max_poin - 1 || element.skor === (kategori.max_poin - 1).toString())
                skor_max2 = skor_max2 + 1;
            if (element.skor === parseInt(kategori.max_poin) || element.skor === (kategori.max_poin).toString())
                skor_max1 = skor_max1 + 1;
        });

        temp.total_skor_rambahan = total_skor_rambahan;
        temp.skor_max3 = skor_max3;
        temp.skor_max2 = skor_max2;
        temp.skor_max1 = skor_max1;

        setSelectedSkorPeserta(temp);
    }

    const updatePeserta = (skor_peserta, selected_peserta, selected_skor_peserta) => {
        let total_skor = 0;
        skor_peserta.forEach(element => {
            if (selected_skor_peserta && element.collection === selected_skor_peserta.collection)
                total_skor = total_skor + selected_skor_peserta.total_skor_rambahan;
            else
                total_skor = total_skor + element.total_skor_rambahan;
        });
        const data = { ...selected_peserta };
        data.rambahan = skor_peserta.length + 1;
        data.total_skor = total_skor;
        delete data.collection;
        firestore.updatePeserta(selected_peserta.collection, data).then(res => {
            setSelectedPeserta({
                collection: selected_peserta.collection,
                ...data
            })
            console.log(res);
        })
    }

    const updateSkor = () => {
        // setLoading(true);
        const data = { ...selected_skor_peserta };
        data.id_admin = useAuth.user.role === 'panitia' ? useAuth.user.id_admin : useAuth.user.collection;
        if (useAuth.user.role === 'panitia')
            data.id_panitia = useAuth.user.collection;
        delete data.collection;
        firestore.updateSkor(selected_skor_peserta.collection, data).then(res => {
            updatePeserta(skor_peserta, selected_peserta, selected_skor_peserta);
            setLoading(false);
            console.log(res);
        })
        closeModal.current.click();
    }

    const arrowEdit = () => {
        const listArrow = []
        for (let index = 0; index < parseInt(kategori.max_arrow); index++) {
            listArrow.push(
                <div key={"arrow-" + index} className="input-group mt-2">
                    <span className="input-group-text">A{index + 1}</span>
                    <input type="number" className="form-control" value={selected_skor_peserta.data[index] ? selected_skor_peserta.data[index].skor : ''} onChange={(event) => event.target.value <= parseInt(kategori.max_poin) ? onChangeSkorPeserta(index, event) : null} />
                </div>
            )
        }

        return listArrow;
    }

    const hapusSkor = () => {
        setLoading(true);
        deleteDoc(doc(db, "skor", selected_skor_peserta.collection)).then(() => {
            skor_peserta.splice(skor_peserta.findIndex(value => value.collection === selected_skor_peserta.collection), 1);
            updatePeserta(skor_peserta, selected_peserta)
            console.log(true);
            setLoading(false);
        });
        closeModal.current.click();
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
                {selected_event.logo ?
                    <img className="logo-1 mt-2" src={process.env.REACT_APP_imageURL.replace('.php', '/') + selected_event.logo} />
                    : <img className="logo-1 mt-2" src={logo} />}

                <label className="form-label mt-3">Event</label>
                <Select value={[event.find(({ value }) => value === JSON.stringify(selected_event))]} isSearchable placeholder="Pilih Event" options={event} onChange={(element) =>
                (
                    setSelectedEvent(JSON.parse(element.value)),
                    getPeserta(JSON.parse(element.value)),
                    setSelectedPeserta({}),
                    setSelectedSkorPeserta({}),
                    setKategori({})
                )} />

                <label className="form-label mt-2">Kode Pegiat</label>
                <Select value={[peserta.find(({ value }) => value === JSON.stringify(selected_peserta))]} isSearchable placeholder="Pilih Kode Pegiat" options={peserta} onChange={(element) => (
                    setSelectedPeserta(JSON.parse(element.value),
                        setKategori(getKategori(JSON.parse(element.value).kategori, selected_event.kategori ? selected_event.kategori : [])),
                        getSkor(JSON.parse(element.value)),
                    )
                )} />

            </div>

            {kategori ?
                selected_peserta.kode_peserta ?
                    <div className="card shadow rounded border-0 m-3">
                        <div className="card-body">
                            <div className='mb-4'>
                                <div className='text-center' style={{ fontSize: 13 }}>Nama Pegiat :</div>
                                <div className='title text-center'>{selected_peserta.nama}</div>

                                <div className='text-center mt-2' style={{ fontSize: 13 }}>Nama Klub/Provinsi :</div>
                                <div className='title text-center'>{selected_peserta.tim}</div>

                                <div className='text-center mt-2' style={{ fontSize: 13 }}>Kategori :</div>
                                <div className='title text-center'>{selected_peserta.kategori}</div>

                                {selected_peserta.rambahan === parseInt(kategori.max_rambahan + 1) ?
                                    <div className='mt-2 d-flex flex-row align-items-center justify-content-center'>
                                        <div>Seri selesai</div>
                                        {selected_peserta.rambahan !== skor_peserta.length + 1 ?
                                            <button onClick={() => updatePeserta(skor_peserta, selected_peserta)} className={loading ? 'btn btn-secondary btn-sm disabled px-2 mx-2' : 'btn btn-success btn-sm px-2 mx-2'}>Sinkronkan</button>
                                            : null
                                        }
                                    </div>
                                    :
                                    <div className='mt-2 d-flex flex-row align-items-center justify-content-center'>
                                        <div>Seri</div>
                                        <div className='mx-2'>:</div>
                                        <div>{selected_peserta.rambahan}</div>
                                        {selected_peserta.rambahan !== skor_peserta.length + 1 ?
                                            <button onClick={() => updatePeserta(skor_peserta, selected_peserta)} className={loading ? 'btn btn-secondary btn-sm disabled px-2 mx-2' : 'btn btn-success btn-sm px-2 mx-2'}>Sinkronkan</button>
                                            : null
                                        }
                                        {/* <input style={{ maxWidth: 50 }} disabled={selected_peserta.rambahan === 8 ? true : false} type="number" className="form-control text-center"
                                        value={selected_peserta.rambahan}
                                        onChange={(event) => event.target.value < 8 ? onChangePeserta('rambahan', event) : null}
                                        onKeyDown={(event) => event.keyCode === 13 ? updatePeserta(skor_peserta, selected_peserta) : null} />
                                    <div className='mx-2 fs-6 fw-light'>*tekan enter untuk simpan</div> */}
                                    </div>
                                }
                            </div>

                            <ListPoin data={skor_peserta} setMode={setMode} setSelectedSkorPeserta={setSelectedSkorPeserta} kategori={kategori} />
                        </div>
                    </div>
                    : null
                : <div className='title text-center text-danger mt-5'>Kategori tidak ditemukan</div>
            }

            <div className="modal fade" id="pesertaModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{mode}</h5>
                            <button onClick={() => getSkor(selected_peserta)} ref={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {mode === 'Ubah' ?
                            <div className="modal-body">
                                <div className="input-group">
                                    <span className="input-group-text">Seri</span>
                                    <input type="number" className="form-control" value={selected_skor_peserta.rambahan} onChange={(event) => event.target.value < 8 ? onChangeSkorPeserta('rambahan', event) : null} />
                                </div>
                                {arrowEdit()}
                                <div className="input-group mt-2">
                                    <span className="input-group-text">Skor Seri</span>
                                    <input type="number" disabled className="form-control" value={selected_skor_peserta.total_skor_rambahan} onChange={(event) => onChangeSkorPeserta('total_skor_rambahan', event)} />
                                </div>
                                <div className="input-group mt-2">
                                    <span className="input-group-text">Skor {kategori.max_poin}</span>
                                    <input type="number" disabled className="form-control" value={selected_skor_peserta.skor_max1} onChange={(event) => onChangeSkorPeserta('skor_max1', event)} />
                                </div>
                                <div className="input-group mt-2">
                                    <span className="input-group-text">Skor {kategori.max_poin - 1}</span>
                                    <input type="number" disabled className="form-control" value={selected_skor_peserta.skor_max2} onChange={(event) => onChangeSkorPeserta('skor_max2', event)} />
                                </div>
                                <div className="input-group mt-2">
                                    <span className="input-group-text">Skor {kategori.max_poin - 2}</span>
                                    <input type="number" disabled className="form-control" value={selected_skor_peserta.skor_max3} onChange={(event) => onChangeSkorPeserta('skor_max3', event)} />
                                </div>
                            </div>
                            : mode === 'Hapus' ?
                                <div className="modal-body">
                                    <div style={{ fontWeight: 'bold' }}>Hapus skor seri {selected_skor_peserta.rambahan} ?</div>
                                </div>
                                : null
                        }
                        <div className="modal-footer">
                            <button onClick={() => getSkor(selected_peserta)} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            {mode === 'Ubah' ?
                                <button onClick={() => updateSkor()} className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                : mode === 'Hapus' ?
                                    <button onClick={() => hapusSkor()} type="button" className="btn btn-danger">Hapus</button>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UbahPoin