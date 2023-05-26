import { useEffect, useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas'
import '../../index.css';
import logo from '../../assets/logo.png';
import av from '../../assets/av.png';
import { firestore } from '../../firebase';
import ListArrow from './ListArrow';
import Select from 'react-select';

import { UseAuth } from '../../routes/useAuth'

import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { firebaseConfig } from '../../utils/config';
import { getKategori } from '../../utils/helpers';
import { useNavigate } from "react-router-dom";

initializeApp(firebaseConfig());
const db = getFirestore();

const FormPoin = () => {
    const [event, setEvent] = useState([]);
    const [selected_event, setSelectedEvent] = useState({});
    const [pemanah, setPemanah] = useState(null);
    const [kategori, setKategori] = useState({});
    const [arrow, setArrow] = useState([]);
    const [skor, setSkor] = useState([]);
    const [list_pemanah, setListPemanah] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);

    const useAuth = UseAuth();
    const showModal = useRef();
    const closeModal = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        getEvent();
    }, [])

    const resetValue = () => {
        setKategori({});
        setPemanah(null);
        setArrow([]);
    }

    const initialSkor = (kategori) => {
        if (!kategori)
            return;

        const arrow_skor = []
        for (let index = 1; index <= kategori.max_arrow; index++) {
            arrow_skor.push(
                { arrow: index, skor: null }
            )
        }
        setSkor(arrow_skor);
    }

    Array.prototype.sum = function (prop) {
        var total = 0
        for (var i = 0, _len = this.length; i < _len; i++) {
            total += this[i][prop]
        }
        return total
    }

    const onSave = () => {
        setLoading(true);

        const counter = {};
        const max_poin = kategori.max_poin;
        skor.forEach(function (obj) {
            var key = JSON.stringify(obj.skor)
            counter[key] = (counter[key] || 0) + 1
        })

        const data = {
            id_peserta: pemanah.collection,
            id_event: selected_event.collection,
            kode_peserta: pemanah.kode_peserta,
            nama: pemanah.nama,
            kategori: pemanah.kategori,
            tim: pemanah.tim,
            rambahan: pemanah.rambahan,
            total_skor_rambahan: skor.sum("skor"),
            skor_max1: counter[max_poin] ? counter[max_poin] : 0,
            skor_max2: counter[max_poin - 1] ? counter[max_poin - 1] : 0,
            skor_max3: counter[max_poin - 2] ? counter[max_poin - 2] : 0,
            data: skor
        }
        data.id_admin = useAuth.user.role === 'panitia' ? useAuth.user.id_admin : useAuth.user.collection;
        if (useAuth.user.role === 'panitia')
            data.id_panitia = useAuth.user.collection;

        firestore.saveSkor(data).then(res => {
            console.log(res);
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
            showModal.current.click();

            const data = {
                rambahan: pemanah.rambahan + 1,
                total_skor: pemanah.total_skor + skor.sum("skor")
            }
            firestore.updatePeserta(pemanah.collection, data).then(res => {
                console.log(res);
                setLoading(false);
                setAlert(true);
            })
        })
    }

    const getEvent = () => {
        if (useAuth.user.role === 'panitia')
            firestore.getEventId(useAuth.user.id_event).then(res => {
                const temp = [];
                temp.push(
                    { label: res.nama_event, value: JSON.stringify(res) },
                )
                setEvent(temp);
                setSelectedEvent(res);
                listPemanah(res);
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

        // const q = query(collection(db, `event`), where('id_admin', '==', useAuth.user.role === 'panitia' ? useAuth.user.id_admin : useAuth.user.collection));
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

    const listPemanah = (event) => {
        const q = query(collection(db, `peserta`), where("id_event", "==", event.collection), orderBy("kode_peserta", "asc"));
        onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const temp = {
                    ...doc.data(),
                    collection: doc.id
                }
                data.push(
                    { label: doc.data().kode_peserta, value: JSON.stringify(temp) },
                );
            });
            setListPemanah(data);
        })
    }

    const updateSkor = (index, arrow_skor) => {
        const temp = [...skor]
        const temp_arrow = temp[index]
        temp_arrow.skor = arrow_skor
        temp[index] = temp_arrow
        setSkor(temp);

        if (arrow.find(element => element == index) === undefined) {
            const temp = [...arrow]
            temp.push(index)
            setArrow(temp)
        }
    }

    const listSkor = () => {
        const temp = []
        skor.forEach(element => {
            temp.push(<div key={element.arrow} className='d-flex flex-row mt-1 align-items-center justify-content-center'>
                <div className="mx-1">Skor Arrow {element.arrow} : </div>
                <div className='title mx-1'>{element.skor}</div>
            </div>)
        });

        return temp;
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

                <button hidden ref={showModal} className="btn btn-sm btn-info mx-1 px-3 text-white" data-bs-toggle="modal" data-bs-target="#skorModal">Show</button>

                <label className="form-label mt-3">Event</label>
                <Select value={[event.find(({ value }) => value === JSON.stringify(selected_event))]} isSearchable placeholder="Pilih Event" options={event} onChange={(element) =>
                (
                    setSelectedEvent(JSON.parse(element.value)),
                    listPemanah(JSON.parse(element.value)),
                    setPemanah(null),
                    setArrow([]),
                    setKategori({})
                )} />

                <label className="form-label mt-3">Kode Pegiat</label>
                <Select isSearchable value={[list_pemanah.find(({ value }) => value === JSON.stringify(pemanah))]} placeholder="Pilih Kode Pegiat" options={list_pemanah} onChange={(element) =>
                (
                    setPemanah(JSON.parse(element.value)),
                    setKategori(getKategori(JSON.parse(element.value).kategori, selected_event.kategori ? selected_event.kategori : [])),
                    setArrow([]),
                    initialSkor(getKategori(JSON.parse(element.value).kategori, selected_event.kategori))
                )} />

                {pemanah ?
                    <div className="mt-4">
                        <div className='text-center' style={{ fontSize: 13 }}>Nama Pegiat :</div>
                        <div className='title text-center'>{pemanah.nama}</div>

                        <div className='text-center mt-2' style={{ fontSize: 13 }}>Nama Klub/Provinsi :</div>
                        <div className='title text-center'>{pemanah.tim}</div>

                        <div className='mt-2 text-center' style={{ fontSize: 13 }}>Kategori :</div>
                        <div className='title text-center'>{pemanah.kategori}</div>

                        {kategori && pemanah && pemanah.rambahan < parseInt(kategori.max_rambahan) + 1 ?
                            <div className='mt-2 mb-4 d-flex flex-row align-items-center justify-content-center'>
                                <div>Seri</div>
                                <div className='mx-2'>:</div>
                                <div className='title'>{pemanah.rambahan}</div>
                            </div>
                            : null}
                    </div>
                    : null
                }

                {kategori ?
                    <>
                        {pemanah && pemanah.rambahan >= parseInt(kategori.max_rambahan) + 1 ?
                            <div className='menu mt-4'>
                                <div className='text-center mt-4'>Seri Selesai</div>

                                <div className='text-center mt-4'>Total Skor</div>
                                <div className='text-center skor'>{pemanah.total_skor}</div>
                            </div>
                            : null
                        }

                        {pemanah && pemanah.rambahan < parseInt(kategori.max_rambahan) + 1 ?
                            <>
                                {/* <div className='mt-4 flex-row'>
                                    <ul className="pagination pagination-md">
                                        <li className={"page-item"} onClick={() => null}><a className="page-link">0</a></li>
                                        <li className={"page-item"} onClick={() => null}><a className="page-link">0</a></li>
                                        <li className={"page-item"} onClick={() => null}><a className="page-link">0</a></li>
                                        <li className={"page-item"} onClick={() => null}><a className="page-link">0</a></li>
                                    </ul>
                                </div> */}

                                <ListArrow skor={skor} updateSkor={updateSkor} kategori={kategori} />

                                <div className='menu mt-4'>
                                    <div className='text-center'>Total Skor</div>
                                    <div className='text-center skor'>{skor.sum("skor")}</div>
                                </div>

                                {arrow.length === parseInt(kategori.max_arrow) ?
                                    <>
                                        <div className='menu mt-4'>
                                            <div className='text-center'>Dengan tanda tangan ini, Pegiat menyatakan data yang diinput benar</div>
                                            <div className="card mt-2">
                                                <div className="d-flex card-footer pb-3 pt-3 align-items-center justify-content-center">
                                                    <SignatureCanvas penColor='black'
                                                        canvasProps={{ width: 270, height: 200, className: 'sigCanvas' }} />
                                                </div>
                                            </div>
                                            {/* <button onClick={()=>sigCanvas.clear()} className='btn btn-success px-4 mt-2'>Reset</button> */}
                                        </div>

                                        <button onClick={() => onSave()} className={loading ? 'btn btn-secondary disabled px-4 mt-4 mb-5' : 'btn btn-success px-4 mt-4 mb-5'}>Simpan</button>
                                    </>
                                    : null}
                            </>
                            : null}
                    </>
                    :
                    <div className='title text-center text-danger mt-5'>Kategori tidak ditemukan</div>}
            </div>

            <div className="modal fade" id="skorModal" tabIndex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            {/* <h5 className="modal-title">Rangkuman</h5> */}
                            <button onClick={() => (setAlert(false), resetValue())} ref={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        {alert ?
                            <div className="modal-body d-flex flex-column align-items-center">
                                {selected_event.logo ?
                                    <img className="logo-1" src={"https://nilai.fespatidepok.id/upload/image-event/" + selected_event.logo} />
                                    : null}

                                <div className='mt-3 text-center' style={{ fontSize: 13 }}>Nama Pegiat :</div>
                                <div className='title text-center'>{pemanah.nama}</div>

                                <div className='mt-2 text-center' style={{ fontSize: 13 }}>Nama Klub/Provinsi :</div>
                                <div className='title text-center'>{pemanah.tim}</div>

                                <div className='mt-2 text-center' style={{ fontSize: 13 }}>Kategori :</div>
                                <div className='title text-center'>{pemanah.kategori}</div>

                                <div className='mt-2 mb-2 d-flex flex-row align-items-center justify-content-center'>
                                    <div>Seri</div>
                                    <div className='mx-2'>:</div>
                                    <div className='title'>{pemanah.rambahan}</div>
                                </div>

                                {listSkor()}

                                <div className="mt-3 title">Total Skor : {skor.sum("skor")}</div>

                                <div className='mt-5' style={{ fontSize: 13 }}>Develop by</div>
                                <img className="logo-1 mt-2 mb-2" src={av} />
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default FormPoin