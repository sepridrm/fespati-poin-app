import { createRef, useEffect, useState } from 'react';
import '../../index.css';
import logo from '../../assets/logo.png';
import { firestore } from '../../firebase';

import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../../utils/config';
import { ListPanitia } from './ListPanitia';
import { validateEmail } from '../../utils/helpers';
import Select from 'react-select';

import { UseAuth } from '../../routes/useAuth';
import { useNavigate } from "react-router-dom";

initializeApp(firebaseConfig());
const db = getFirestore();

const DataPanitia = () => {
    const [panitia, setPanitia] = useState([]);
    const [events, setEvents] = useState([]);
    const [mode, setMode] = useState('Lihat');
    const [selected_panitia, setSelectedPanitia] = useState({});
    const [tambah_panitia, setTambahPanitia] = useState({});
    const [search, setSearch] = useState('');
    const [search_data, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const useAuth = UseAuth();
    const closeModal = createRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        resetTambahPanitia();
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


    const getPanitia = (event) => {
        const q = query(collection(db, `panitia`), where("id_admin", "==", useAuth.user.collection), where("id_event", "==", event));
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
            setPanitia(data);
        })
    }

    const onChangePanitia = (title, event) => {
        const temp = { ...selected_panitia };
        temp[title] = event.target ? event.target.value : event;
        setSelectedPanitia(temp);
    }

    const onChangeTambahPanitia = (title, event) => {
        const temp = { ...tambah_panitia };
        temp[title] = event.target ? event.target.value : event;
        setTambahPanitia(temp);
    }

    const resetTambahPanitia = () => {
        setTambahPanitia({
            id_event: '',
            email: '',
            nama: '',
        })
    }

    function searchFilter(text) {
        setSearch(text);

        const newData = panitia.filter(item => {
            const itemData = `${item.nama.toUpperCase()} || ${item.email.toUpperCase()}}`
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setSearchData(newData);
    }

    const tambahPanitia = () => {
        if (tambah_panitia.nama === '' || tambah_panitia.email === '' || tambah_panitia.id_event === '') {
            setErrMessage('Silahkan lengkapi data');
            return;
        } else if (!validateEmail(tambah_panitia.email)) {
            setErrMessage('Email tidak valid');
            return;
        }

        setLoading(true);
        const data = { ...tambah_panitia };
        data.id_admin = useAuth.user.collection;

        firestore.savePanitia(data).then(res => {
            setLoading(false);
            console.log(res);
        })
        closeModal.current.click();
    }

    const updatePanitia = () => {
        if (selected_panitia.nama === '' || selected_panitia.email === '' || selected_panitia.id_event === '') {
            setErrMessage('Silahkan lengkapi data');
            return;
        } else if (!validateEmail(selected_panitia.email)) {
            setErrMessage('Email tidak valid');
            return;
        }

        setLoading(true);
        const data = { ...selected_panitia };
        delete data.event;
        delete data.collection;
        firestore.updatePanitia(selected_panitia.collection, data).then(res => {
            setLoading(false);
            console.log(res);
        })
        closeModal.current.click();
    }

    const deletePanitia = () => {
        setLoading(true);
        deleteDoc(doc(db, "panitia", selected_panitia.collection)).then(() => {
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
                <img className="logo-1 mt-2" src={logo} />
                <h6 className='mt-2'>Data Panitia</h6>
            </div>

            <div className="card shadow rounded border-0 m-3 mt-3">
                <div className="card-body">
                    <div className="input-group mt-2">
                        <span className="input-group-text">Event</span>
                        <Select isSearchable placeholder="Pilih Event" options={events} onChange={(element) => getPanitia(JSON.parse(element.value).collection)} />
                    </div>

                    <div className='d-flex align-items-center w-100 mb-4'>
                        <div className="input-group me-auto" style={{ maxWidth: 300 }}>
                            <span className="input-group-text">Cari Panitia</span>
                            <input placeholder='Nama/email panitia' type="text" className="form-control" value={search} onChange={(event) => searchFilter(event.target.value)} />
                        </div>
                        <div className='justify-content-end'>
                            <button onClick={() => setMode('Tambah')} className="btn btn-sm btn-info mx-2 my-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#panitiaModal">Tambah</button>
                        </div>
                    </div>
                    <ListPanitia data={search ? search_data : panitia} setMode={setMode} setSelectedPanitia={setSelectedPanitia} />
                </div>
            </div>

            <div className="modal fade" id="panitiaModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{mode}</h5>
                            <button onClick={() => (setErrMessage(''), resetTambahPanitia())} ref={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {mode === 'Tambah' ?
                            <div className="modal-body">
                                <div className="input-group mt-2">
                                    <span className="input-group-text">Event</span>
                                    <Select isSearchable placeholder="Pilih Event" options={events} onChange={(element) => onChangeTambahPanitia('id_event', JSON.parse(element.value).collection)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Email</span>
                                    <input required type="email" className="form-control" value={tambah_panitia.email} onChange={(event) => onChangeTambahPanitia('email', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Nama</span>
                                    <input required type="text" className="form-control" value={tambah_panitia.nama} onChange={(event) => onChangeTambahPanitia('nama', event)} />
                                </div>

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
                                        <Select isSearchable placeholder="Pilih Event" value={events.find(({ value }) => JSON.parse(value).collection === selected_panitia.id_event)} options={events} onChange={(element) => onChangePanitia('id_event', JSON.parse(element.value).collection)} />
                                    </div>
                                    <div className="input-group mt-3">
                                        <span className="input-group-text">Email</span>
                                        <input type="text" className="form-control" value={selected_panitia.email} onChange={(event) => onChangePanitia('email', event)} />
                                    </div>
                                    <div className="input-group mt-3">
                                        <span className="input-group-text">Nama</span>
                                        <input type="text" className="form-control" value={selected_panitia.nama} onChange={(event) => onChangePanitia('nama', event)} />
                                    </div>

                                    {errMessage ?
                                        <div className="alert alert-danger mt-4" role="alert">
                                            {errMessage}
                                        </div>
                                        : null}
                                </div>
                                : mode === 'Hapus' ?
                                    <div className="modal-body">
                                        <div style={{ fontWeight: 'bold' }}>Hapus Panitia {selected_panitia.nama} ?</div>
                                    </div>
                                    : null
                        }
                        <div className="modal-footer">
                            <button onClick={() => (setErrMessage(''), resetTambahPanitia())} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            {mode === 'Tambah' ?
                                <button onClick={() => tambahPanitia()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                : mode === 'Ubah' ?
                                    <button onClick={() => updatePanitia()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                    : mode === 'Hapus' ?
                                        <button onClick={() => deletePanitia()} type="button" className="btn btn-danger ">Hapus</button>
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

export default DataPanitia