import { createRef, useEffect, useState } from 'react';
import '../../index.css';
import logo from '../../assets/logo.png';
import { firestore } from '../../firebase';

import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../../utils/config';
import { ListAdmin } from './ListAdmin';
import { validateEmail } from '../../utils/helpers';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
initializeApp(firebaseConfig());
const db = getFirestore();

const DataAdmin = () => {
    const [admin, setAdmin] = useState([]);
    const [roles, setRoles] = useState([
        { label: 'Superadmin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        // { label: 'Panitia', value: 'panitia' }
    ]);
    const [mode, setMode] = useState('Lihat');
    const [selected_admin, setSelectedAdmin] = useState({});
    const [tambah_admin, setTambahAdmin] = useState({});
    const [search, setSearch] = useState('');
    const [search_data, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const closeModal = createRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        resetTambahAdmin();
        if (admin.length === 0)
            getAdmin();
    }, [])


    const getAdmin = () => {
        const q = query(collection(db, `admin`));
        onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const temp = {
                    ...doc.data(),
                    collection: doc.id
                }
                data.push(temp);
            });
            setAdmin(data);
        })
    }

    const onChangeAdmin = (title, event) => {
        const temp = { ...selected_admin };
        temp[title] = event.target ? event.target.value : event;
        setSelectedAdmin(temp);
    }

    const onChangeTambahAdmin = (title, event) => {
        const temp = { ...tambah_admin };
        temp[title] = event.target ? event.target.value : event;
        setTambahAdmin(temp);
    }

    const resetTambahAdmin = () => {
        setTambahAdmin({
            email: '',
            nama: '',
            role: ''
        })
    }

    function searchFilter(text) {
        setSearch(text);

        const newData = admin.filter(item => {
            const itemData = `${item.nama.toUpperCase()} || ${item.email.toUpperCase()}`
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setSearchData(newData);
    }

    const tambahAdmin = () => {
        if (tambah_admin.nama === '' || tambah_admin.email === '' || tambah_admin.role === '') {
            setErrMessage('Silahkan lengkapi data');
            return;
        } else if (!validateEmail(tambah_admin.email)) {
            setErrMessage('Email tidak valid');
            return;
        }

        setLoading(true);
        const data = { ...tambah_admin };
        firestore.saveAdmin(data).then(res => {
            setLoading(false);
            console.log(res);
        })
        closeModal.current.click();
    }

    const updateAdmin = () => {
        if (selected_admin.nama === '' || selected_admin.email === '' || selected_admin.role === '') {
            setErrMessage('Silahkan lengkapi data');
            return;
        } else if (!validateEmail(selected_admin.email)) {
            setErrMessage('Email tidak valid');
            return;
        }

        setLoading(true);
        const data = { ...selected_admin };
        delete data.collection;
        firestore.updateAdmin(selected_admin.collection, data).then(res => {
            setLoading(false);
            console.log(res);
        })
        closeModal.current.click();
    }

    const deleteAdmin = () => {
        setLoading(true);
        deleteDoc(doc(db, "admin", selected_admin.collection)).then(() => {
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
                <h6 className='mt-2'>Data Admin</h6>
            </div>

            <div className="card shadow rounded border-0 m-3 mt-4">
                <div className="card-body">
                    <div className='d-flex align-items-center w-100 mb-4'>
                        <div className="input-group me-auto" style={{ maxWidth: 300 }}>
                            <span className="input-group-text">Cari Admin</span>
                            <input type="text" className="form-control" value={search} onChange={(event) => searchFilter(event.target.value)} />
                        </div>
                        <div className='justify-content-end'>
                            <button onClick={() => setMode('Tambah')} className="btn btn-sm btn-info mx-2 my-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#adminModal">Tambah</button>
                        </div>
                    </div>
                    <ListAdmin data={search ? search_data : admin} setMode={setMode} setSelectedAdmin={setSelectedAdmin} />
                </div>
            </div>

            <div className="modal fade" id="adminModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{mode}</h5>
                            <button onClick={() => (setErrMessage(''), resetTambahAdmin())} ref={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {mode === 'Tambah' ?
                            <div className="modal-body">
                                <div className="input-group mt-2">
                                    <span className="input-group-text">Email</span>
                                    <input required type="email" className="form-control" value={tambah_admin.email} onChange={(event) => onChangeTambahAdmin('email', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Nama</span>
                                    <input required type="text" className="form-control" value={tambah_admin.nama} onChange={(event) => onChangeTambahAdmin('nama', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Role</span>
                                    <Select isSearchable placeholder="Pilih Role" options={roles} onChange={(element) => onChangeTambahAdmin('role', element.value)} />
                                </div>
                            </div>
                            : mode === 'Ubah' ?
                                <div className="modal-body">
                                    <div className="input-group mt-2">
                                        <span className="input-group-text">Email</span>
                                        <input type="text" className="form-control" value={selected_admin.email} onChange={(event) => onChangeAdmin('email', event)} />
                                    </div>
                                    <div className="input-group mt-3">
                                        <span className="input-group-text">Nama</span>
                                        <input type="text" className="form-control" value={selected_admin.nama} onChange={(event) => onChangeAdmin('nama', event)} />
                                    </div>
                                    <div className="input-group mt-3">
                                        <span className="input-group-text">Role</span>
                                        <Select isSearchable placeholder="Pilih Role" value={roles.find(({ value }) => value === selected_admin.role)} options={roles} onChange={(element) => onChangeAdmin('role', element.value)} />
                                    </div>
                                </div>
                                : mode === 'Hapus' ?
                                    <div className="modal-body">
                                        <div style={{ fontWeight: 'bold' }}>Hapus admin {selected_admin.nama} ?</div>
                                    </div>
                                    : null
                        }
                        <div className="modal-footer">
                            <button onClick={() => (setErrMessage(''), resetTambahAdmin())} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            {mode === 'Tambah' ?
                                <button onClick={() => tambahAdmin()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                : mode === 'Ubah' ?
                                    <button onClick={() => updateAdmin()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                    : mode === 'Hapus' ?
                                        <button onClick={() => deleteAdmin()} type="button" className="btn btn-danger ">Hapus</button>
                                        : null
                            }
                        </div>
                    </div>
                </div>
            </div>

            {errMessage ?
                <div className="alert alert-danger" role="alert" style={{ position: 'absolute', bottom: 50, left: '20%', right: '20%' }}>
                    {errMessage}
                </div>
                : null
            }
        </>
    )
}

export default DataAdmin