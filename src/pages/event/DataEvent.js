import { createRef, useEffect, useState } from 'react';
import '../../index.css';
import logo from '../../assets/logo.png';
import { firestore } from '../../firebase';
import Select from 'react-select';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, query, where, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '../../utils/config';
import { ListEvent } from './ListEvent';
import axios from 'axios';
import { UseAuth } from '../../routes/useAuth'
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import { aduan } from '../aduan/JumlahAduan';

initializeApp(firebaseConfig());
const db = getFirestore();

const DataEvent = () => {
    const [event, setEvent] = useState([]);
    const [mode, setMode] = useState('Lihat');
    const [selected_event, setSelectedEvent] = useState({});
    const [list_kategori, setListKategori] = useState([]);
    const [list_aduan, setListAduan] = useState(
        [
            { label: '4', value: 4 },
            { label: '8', value: 8 },
            { label: '16', value: 16 },
        ]
    )
    const [selected_kategori, setSelectedKategori] = useState({});
    const [selected_index_kategori, setSelectedIndexKategori] = useState({});
    const [tambah_event, setTambahEvent] = useState({});
    const [tambah_kategori, setTambahKategori] = useState({});
    const [search, setSearch] = useState('');
    const [search_data, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const useAuth = UseAuth();
    const closeModal = createRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        resetTambahEvent();
        resetTambahKategori();
        if (event.length === 0)
            getEvent();
    }, [])


    const getEvent = () => {
        let q;
        if (useAuth.user.role === 'admin')
            q = query(collection(db, `event`), where('id_admin', '==', useAuth.user.collection));
        else
            q = query(collection(db, `event`));

        onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const temp = {
                    ...doc.data(),
                    collection: doc.id
                }
                data.push(temp);
            });
            setEvent(data);
        })
    }

    const onChangeEvent = (title, event) => {
        const temp = { ...selected_event };
        temp[title] = event.target ? event.target.files ? event.target.files : event.target.value : event;
        setSelectedEvent(temp);
    }

    const onChangeTambahEvent = (title, event) => {
        const temp = { ...tambah_event };
        temp[title] = event.target ? event.target.files ? event.target.files : event.target.value : event;
        setTambahEvent(temp);
    }

    const onChangeTambahKategori = (title, event) => {
        const temp = { ...tambah_kategori };
        temp[title] = event;
        setTambahKategori(temp);
    }

    const onChangeUbahKategori = (title, event) => {
        const temp = { ...selected_kategori };
        temp[title] = event;
        setSelectedKategori(temp);
    }

    const resetTambahEvent = () => {
        setTambahEvent({
            nama_event: '',
            logo: '',
            poster: '',
            tanggal_mulai: '',
            tanggal_selesai: ''
        })
    }

    const resetTambahKategori = () => {
        setTambahKategori({
            nama_kategori: '',
            max_rambahan: '',
            max_arrow: '',
            max_poin: '',
            aduan: ''
        })
    }

    function searchFilter(text) {
        setSearch(text);

        const newData = event.filter(item => {
            const itemData = `${item.nama_event.toUpperCase()}`
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setSearchData(newData);
    }

    const tambahEvent = async () => {
        if (tambah_event.nama_event === '' || tambah_event.tanggal_mulai === '' ||
            tambah_event.tanggal_selesai === '' || tambah_event.logo === '' || tambah_event.poster === '') {
            setErrMessage('Silahkan lengkapi data');
            return;
        }
        setLoading(true);

        const logo = await uploadImage(tambah_event.logo[0]);
        const poster = await uploadImage(tambah_event.poster[0]);

        if (logo.status !== 200) {
            setErrMessage('Gagal menyimpan logo event');
            return;
        }
        if (poster.status !== 200) {
            setErrMessage('Gagal menyimpan poster event');
            return;
        }

        const data = { ...tambah_event };
        data.id_admin = useAuth.user.collection;
        data.tanggal_mulai = Timestamp.fromDate(moment(data.tanggal_mulai).toDate());
        data.tanggal_selesai = Timestamp.fromDate(moment(data.tanggal_selesai).toDate());
        data.publish = false;
        data.logo = logo.data;
        data.poster = poster.data;
        firestore.saveEvent(data).then(res => {
            setLoading(false);
            resetTambahEvent();
            setErrMessage('Berhasil menyimpan data');
            console.log(res);
        })

        // let fileReader = new FileReader();
        // fileReader.readAsDataURL(tambah_event.logo[0]);

        // fileReader.onload = (event) => {
        //     const formData = { image: event.target.result }
        //     let endpoint = process.env.REACT_APP_imageURL;
        //     axios.post(endpoint, formData, {
        //     }).then((res) => {
        //         // console.log(res);
        //         const data = { ...tambah_event };
        //         data.id_admin = useAuth.user.collection;
        //         data.logo = res.data;
        //         firestore.saveEvent(data).then(res => {
        //             setLoading(false);
        //             console.log(res);
        //         })
        //     })
        // }
    }

    const tambahKategori = () => {
        if (tambah_kategori.nama_kategori === '' || tambah_kategori.max_rambahan === '' || tambah_kategori.max_arrow === '' || tambah_kategori.max_poin === '' || tambah_kategori.aduan === '') {
            setErrMessage('Silahkan lengkapi data');
            return;
        }

        setLoading(true);
        const data = [...list_kategori];
        data.push(tambah_kategori);

        firestore.updateEvent(selected_event.collection, { kategori: data }).then(res => {
            setLoading(false);
            setListKategori(data);
            resetTambahKategori();
            setErrMessage('Berhasil menyimpan data');

            firestore.saveAduan({
                id_event: selected_event.collection,
                nama_kategori: tambah_kategori.nama_kategori,
                aduan: tambah_kategori.aduan,
                isStart: false,
                data: aduan['aduan' + tambah_kategori.aduan]
            }).then(res => {
                console.log(res)
            })

            setTimeout(() => {
                setErrMessage('');
            }, 2000);
            console.log(res);
        })
    }

    const ubahKategori = () => {
        if (selected_kategori.nama_kategori === '' || selected_kategori.max_rambahan === '' || selected_kategori.max_arrow === '' || selected_kategori.max_poin === '' || !selected_kategori.aduan || selected_kategori.aduan === '') {
            setErrMessage('Silahkan lengkapi data');
            return;
        }

        setLoading(true);
        let data = [...list_kategori];
        data[selected_index_kategori] = selected_kategori;

        firestore.updateEvent(selected_event.collection, { kategori: data }).then(res => {
            console.log(res);
            firestore.getAduan(selected_event.collection, selected_kategori.nama_kategori).then(res => {
                // console.log(res);
                if (res.collection) {
                    if (res.aduan !== selected_kategori.aduan) {
                        firestore.updateAduan(res.collection,
                            {
                                id_event: selected_event.collection,
                                nama_kategori: selected_kategori.nama_kategori,
                                aduan: selected_kategori.aduan,
                                isStart: false,
                                data: aduan['aduan' + selected_kategori.aduan]
                            }
                        ).then(res => {
                            console.log(res)
                            setLoading(false);
                            setErrMessage('Berhasil menyimpan data');
                        })
                    }
                } else {
                    firestore.saveAduan({
                        id_event: selected_event.collection,
                        nama_kategori: selected_kategori.nama_kategori,
                        aduan: selected_kategori.aduan,
                        isStart: false,
                        data: aduan['aduan' + selected_kategori.aduan]
                    }).then(res => {
                        console.log(res)
                        setLoading(false);
                        setErrMessage('Berhasil menyimpan data');
                    })
                }
            })


        })
    }

    const deleteKategori = () => {
        setLoading(true);
        let data = [...list_kategori];
        data.splice(selected_index_kategori, 1);

        firestore.updateEvent(selected_event.collection, { kategori: data }).then(res => {
            setLoading(false);
            setErrMessage('Berhasil menghapus kategori');
            console.log(res);
        })

        closeModal.current.click();
    }

    const uploadImage = async (image) => {
        let fileReader = await new FileReader();
        fileReader.readAsDataURL(image);

        let formData = await new Promise((resolve, reject) => {
            fileReader.onload = (event) => {
                resolve({ image: event.target.result })
            }
        });

        let endpoint = process.env.REACT_APP_imageURL;
        return await axios.post(endpoint, formData, {});
    }

    const updateEvent = async () => {
        if (selected_event.nama_event === '' || selected_event.tanggal_mulai === '' ||
            selected_event.tanggal_selesai === '' || selected_event.logo === '' || selected_event.poster === '') {
            setErrMessage('Silahkan lengkapi data');
            return;
        }

        setLoading(true);

        if (!selected_event.logo[0].name && !selected_event.poster[0].name) {
            const data = { ...selected_event };
            data.tanggal_mulai = Timestamp.fromDate(moment(data.tanggal_mulai).toDate());
            data.tanggal_selesai = Timestamp.fromDate(moment(data.tanggal_selesai).toDate());
            delete data.collection;
            firestore.updateEvent(selected_event.collection, data).then(res => {
                // console.log('not change');
                setLoading(false);
                setErrMessage('Berhasil menyimpan data');
                console.log(res);
            })
        }

        let logo = {};
        let poster = {};

        if (selected_event.logo[0].name) {
            logo = await uploadImage(selected_event.logo[0]);
            if (logo.status !== 200) {
                setErrMessage('Gagal menyimpan logo event');
                return;
            }
        }
        if (selected_event.poster[0].name) {
            poster = await uploadImage(selected_event.poster[0]);
            if (poster.status !== 200) {
                setErrMessage('Gagal menyimpan poster event');
                return;
            }
        }

        const data = { ...selected_event };
        if (logo.data)
            data.logo = logo.data;
        if (poster.data)
            data.poster = poster.data;

        data.tanggal_mulai = Timestamp.fromDate(moment(data.tanggal_mulai).toDate());
        data.tanggal_selesai = Timestamp.fromDate(moment(data.tanggal_selesai).toDate());
        delete data.collection;

        firestore.updateEvent(selected_event.collection, data).then(res => {
            setLoading(false);
            setErrMessage('Berhasil menyimpan data');
            console.log(res);
        })

        // let fileReader = new FileReader();
        // fileReader.readAsDataURL(selected_event.logo[0]);

        // fileReader.onload = (event) => {
        //     const formData = { image: event.target.result }
        //     let endpoint = process.env.REACT_APP_imageURL;
        //     axios.post(endpoint, formData, {
        //     }).then((res) => {
        //         // console.log(res);
        //         const data = { ...selected_event };
        //         data.logo = res.data;
        //         delete data.collection;
        //         firestore.updateEvent(selected_event.collection, data).then(res => {
        //             console.log('changed');
        //             setLoading(false);
        //             console.log(res);
        //         })
        //     })
        // }
    }

    const deleteEvent = () => {
        setLoading(true);
        firestore.getPanitiabyEvent(selected_event.collection).then(res => {
            res.forEach(element => {
                deleteDoc(doc(db, "panitia", element.collection)).then(() => {
                    console.log('deleted panitia ' + element.nama);
                });
            });
        })
        firestore.getPesertabyEvent(selected_event.collection).then(res => {
            res.forEach(element => {
                deleteDoc(doc(db, "peserta", element.collection)).then(() => {
                    console.log('deleted peserta ' + element.nama);
                });
            });
        })
        firestore.getSkorbyEvent(selected_event.collection).then(res => {
            res.forEach(element => {
                deleteDoc(doc(db, "skor", element.collection)).then(() => {
                    console.log('deleted skor ' + element.nama);
                });
            });
        })
        firestore.getAduanbyEvent(selected_event.collection).then(res => {
            res.forEach(element => {
                deleteDoc(doc(db, "aduan", element.collection)).then(() => {
                    console.log('deleted aduan ' + element.nama_kategori);
                });
            });
        })
        deleteDoc(doc(db, "event", selected_event.collection)).then(() => {
            console.log('deleted event ' + selected_event.nama_event);
            setLoading(false);
        });
        closeModal.current.click();
    }

    const publishEvent = () => {
        setLoading(true);
        const data = { ...selected_event };
        const publish = data.publish ? !data.publish : true;
        data.tanggal_mulai = Timestamp.fromDate(moment(data.tanggal_mulai).toDate());
        data.tanggal_selesai = Timestamp.fromDate(moment(data.tanggal_selesai).toDate());
        data.publish = publish;
        delete data.collection;
        firestore.updateEvent(selected_event.collection, data).then(res => {
            setLoading(false);
            console.log(res);
        })
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
                <h6 className='mt-2'>Data Event</h6>
            </div>

            <div className="card shadow rounded border-0 m-3 mt-3">
                <div className="card-body">
                    <div className='d-flex align-items-center w-100 mb-4'>
                        <div className="input-group me-auto" style={{ maxWidth: 300 }}>
                            <span className="input-group-text">Cari Event</span>
                            <input type="text" className="form-control" value={search} onChange={(event) => searchFilter(event.target.value)} />
                        </div>
                        {useAuth.user.role === 'admin' ?
                            <div className='justify-content-end'>
                                <button onClick={() => setMode('Tambah Event')} className="btn btn-sm btn-info mx-2 my-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#eventModal">Tambah Event</button>
                            </div>
                            : null}
                    </div>
                    <ListEvent data={search ? search_data : event} setMode={setMode} setSelectedEvent={setSelectedEvent} setListKategori={setListKategori} setSelectedKategori={setSelectedKategori} setSelectedIndexKategori={setSelectedIndexKategori} />
                </div>
            </div>

            <div className="modal fade" id="eventModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{mode}</h5>
                            <button onClick={() => (setErrMessage(''), resetTambahEvent())} ref={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {mode === 'Tambah Event' ?
                            <div className="modal-body">
                                <div className="input-group mt-2">
                                    <span className="input-group-text">Nama Event</span>
                                    <input required type="text" className="form-control" value={tambah_event.nama_event} onChange={(event) => onChangeTambahEvent('nama_event', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Logo Event</span>
                                    <input required type="file" className="form-control" onChange={(event) => onChangeTambahEvent('logo', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Poster Event</span>
                                    <input required type="file" className="form-control" onChange={(event) => onChangeTambahEvent('poster', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Tanggal Mulai</span>
                                    <input required type="date" className="form-control" value={tambah_event.tanggal_mulai} onChange={(event) => onChangeTambahEvent('tanggal_mulai', event)} />
                                </div>
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Tanggal Selesai</span>
                                    <input required type="date" className="form-control" value={tambah_event.tanggal_selesai} onChange={(event) => onChangeTambahEvent('tanggal_selesai', event)} />
                                </div>

                                {errMessage ?
                                    <div className={errMessage.search('Berhasil') !== -1 ? "alert alert-success mt-3" : "alert alert-danger mt-3"} role="alert">
                                        {errMessage}
                                    </div>
                                    : null}
                            </div>
                            : mode === 'Ubah Event' ?
                                <div className="modal-body">
                                    <img className='img-responsive' width="100px" height="100px" src={selected_event.logo[0].name ? URL.createObjectURL(selected_event.logo[0]) : "https://nilai.fespatidepok.id/upload/image-event/" + selected_event.logo} />
                                    <img className='img-responsive ms-2' width="100px" height="130px" src={selected_event.poster[0].name ? URL.createObjectURL(selected_event.poster[0]) : "https://nilai.fespatidepok.id/upload/image-event/" + selected_event.poster} />
                                    <div className="input-group mt-3">
                                        <span className="input-group-text">Nama Event</span>
                                        <input required type="text" className="form-control" value={selected_event.nama_event} onChange={(event) => onChangeEvent('nama_event', event)} />
                                    </div>
                                    <div className="input-group mt-3">
                                        <span className="input-group-text">Logo Event</span>
                                        <input required type="file" className="form-control" onChange={(event) => onChangeEvent('logo', event)} />
                                    </div>
                                    <div className="input-group mt-3">
                                        <span className="input-group-text">Poster Event</span>
                                        <input required type="file" className="form-control" onChange={(event) => onChangeEvent('poster', event)} />
                                    </div>
                                    <div className="input-group mt-3">
                                        <span className="input-group-text">Tanggal Mulai</span>
                                        <input required type="date" className="form-control" value={selected_event.tanggal_mulai} onChange={(event) => onChangeEvent('tanggal_mulai', event)} />
                                    </div>
                                    <div className="input-group mt-3">
                                        <span className="input-group-text">Tanggal Selesai</span>
                                        <input required type="date" className="form-control" value={selected_event.tanggal_selesai} onChange={(event) => onChangeEvent('tanggal_selesai', event)} />
                                    </div>

                                    {errMessage ?
                                        <div className={errMessage.search('Berhasil') !== -1 ? "alert alert-success mt-3" : "alert alert-danger mt-3"} role="alert">
                                            {errMessage}
                                        </div>
                                        : null}
                                </div>
                                : mode === 'Tambah Kategori' ?
                                    <div className="modal-body">
                                        <h5 className="modal-title">{selected_event.nama_event}</h5>

                                        <div className="input-group mt-3">
                                            <span className="input-group-text">Nama Kategori</span>
                                            <input required type="text" className="form-control" value={tambah_kategori.nama_kategori} onChange={(event) => onChangeTambahKategori('nama_kategori', event.target.value)} />
                                        </div>
                                        <div className="input-group mt-2">
                                            <span className="input-group-text">Maksimum Seri</span>
                                            <input required type="number" className="form-control" value={tambah_kategori.max_rambahan} onChange={(event) => event.target.value <= 10 ? onChangeTambahKategori('max_rambahan', event.target.value) : null} />
                                        </div>
                                        <div className="input-group mt-2">
                                            <span className="input-group-text">Maksimum Arrow</span>
                                            <input required type="number" className="form-control" value={tambah_kategori.max_arrow} onChange={(event) => event.target.value <= 10 ? onChangeTambahKategori('max_arrow', event.target.value) : null} />
                                        </div>
                                        <div className="input-group mt-2">
                                            <span className="input-group-text">Maksimum Skor</span>
                                            <input required type="number" className="form-control" value={tambah_kategori.max_poin} onChange={(event) => event.target.value <= 10 ? onChangeTambahKategori('max_poin', event.target.value) : null} />
                                        </div>
                                        <div className="input-group mt-2">
                                            <span className="input-group-text">Aduan</span>
                                            <Select placeholder="Pilih jumlah" options={list_aduan} onChange={(element) => onChangeTambahKategori('aduan', element.value)} />
                                            <span className="input-group-text">Peserta</span>
                                        </div>

                                        {errMessage ?
                                            <div className={errMessage.search('Berhasil') !== -1 ? "alert alert-success mt-3" : "alert alert-danger mt-3"} role="alert">
                                                {errMessage}
                                            </div>
                                            : null}
                                    </div>
                                    : mode === 'Ubah Kategori' ?
                                        <div className="modal-body">
                                            <div className="input-group">
                                                <span className="input-group-text">Nama Kategori</span>
                                                <input required type="text" className="form-control" value={selected_kategori.nama_kategori} onChange={(event) => onChangeUbahKategori('nama_kategori', event.target.value)} />
                                            </div>
                                            <div className="input-group mt-2">
                                                <span className="input-group-text">Maksimum Seri</span>
                                                <input required type="number" className="form-control" value={selected_kategori.max_rambahan} onChange={(event) => event.target.value <= 10 ? onChangeUbahKategori('max_rambahan', event.target.value) : null} />
                                            </div>
                                            <div className="input-group mt-2">
                                                <span className="input-group-text">Maksimum Arrow</span>
                                                <input required type="number" className="form-control" value={selected_kategori.max_arrow} onChange={(event) => event.target.value <= 10 ? onChangeUbahKategori('max_arrow', event.target.value) : null} />
                                            </div>
                                            <div className="input-group mt-2">
                                                <span className="input-group-text">Maksimum Skor</span>
                                                <input required type="number" className="form-control" value={selected_kategori.max_poin} onChange={(event) => event.target.value <= 10 ? onChangeUbahKategori('max_poin', event.target.value) : null} />
                                            </div>
                                            <div className="input-group mt-2">
                                                <span className="input-group-text">Aduan</span>
                                                <Select placeholder="Pilih jumlah" value={list_aduan.find(({ value }) => value === selected_kategori.aduan)} options={list_aduan} onChange={(element) => onChangeUbahKategori('aduan', element.value)} />
                                                <span className="input-group-text">Peserta</span>
                                            </div>

                                            {errMessage ?
                                                <div className={errMessage.search('Berhasil') !== -1 ? "alert alert-success mt-3" : "alert alert-danger mt-3"} role="alert">
                                                    {errMessage}
                                                </div>
                                                : null}
                                        </div>
                                        : mode === 'Hapus Kategori' ?
                                            <div className="modal-body">
                                                <h5>Hapus kategori {selected_kategori.nama_kategori} ?</h5>
                                            </div>
                                            : mode === 'Hapus Event' ?
                                                <div className="modal-body">
                                                    <h5>Semua data peserta, panitia, skor akan ikut terhapus!</h5>
                                                    <h5>Lanjutkan hapus event {selected_event.nama_event}?</h5>
                                                </div>
                                                : mode === 'Publish Event' ?
                                                    <div className="modal-body">
                                                        <h5>{selected_event.publish ? "Unpublish" : "Publish"} event {selected_event.nama_event} ?</h5>
                                                    </div>
                                                    : null
                        }
                        <div className="modal-footer">
                            <button onClick={() => (setErrMessage(''), resetTambahEvent())} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            {mode === 'Tambah Event' ?
                                <button onClick={() => tambahEvent()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                : mode === 'Ubah Event' ?
                                    <button onClick={() => updateEvent()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                    : mode === 'Tambah Kategori' ?
                                        <button onClick={() => tambahKategori()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                        : mode === 'Ubah Kategori' ?
                                            <button onClick={() => ubahKategori()} type="button" className={loading ? 'btn btn-secondary disabled' : 'btn btn-success'}>Simpan</button>
                                            : mode === 'Hapus Kategori' ?
                                                <button onClick={() => deleteKategori()} type="button" className="btn btn-danger ">Hapus</button>
                                                : mode === 'Hapus Event' ?
                                                    <button onClick={() => deleteEvent()} type="button" className="btn btn-danger ">Hapus</button>
                                                    : mode === 'Publish Event' ?
                                                        <button onClick={() => publishEvent()} type="button" className="btn btn-warning text-white">{selected_event.publish ? "Unpublish" : "Publish"}</button>
                                                        : null
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* {errMessage ?
                <div className={errMessage.search('Berhasil') !== -1 ? "alert alert-success" : "alert alert-danger"} role="alert" style={{ position: 'absolute', bottom: 50, left: '20%', right: '20%' }}>
                    {errMessage}
                </div>
                : null
            } */}
        </>
    )
}

export default DataEvent