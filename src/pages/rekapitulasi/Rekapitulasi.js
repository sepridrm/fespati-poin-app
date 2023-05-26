import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import CardEvent from '../event-poin/CardEvent';
import RankingIndividu from '../ranking/RankingIndividu';
import RankingTim from '../ranking/RankingTim';
import { collection, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../utils/config';
import { UseAuth } from '../../routes/useAuth';
import { firestore } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Aduan from '../aduan/Aduan';
initializeApp(firebaseConfig());
const db = getFirestore();

function Rekapitulasi() {
    const [selected_event, setSelectedEvent] = useState({});
    const [search, setSearch] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const auth = UseAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (auth.user.role === 'panitia') {
            setLoading(true)
            firestore.getEventId(auth.user.id_event).then(res => {
                getSkor(res);
                setSelectedEvent(res);
            })
        }
    }, [])

    const onSelectEvent = (event) => {
        setLoading(true);
        getSkor(event);
        setSelectedEvent(event);
    }

    const getSkor = (event) => {
        const q = query(collection(db, "skor"), where('id_event', '==', event.collection), orderBy("kode_peserta", "asc"), orderBy("rambahan", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const temp = {
                    ...doc.data(),
                    collection: doc.id
                }
                data.push(temp);
            });

            setData(data);
            setLoading(false);
        })
    }

    const resetValue = () => {
        // if (auth.user.role !== 'panitia') {
        //     setSelectedEvent({});
        //     setData(null);
        // } else
        navigate(-1)
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm">
                <div className="container-fluid">
                    <i onClick={() => resetValue()} className="fa-sharp fa-solid fa-circle-arrow-left fa-2xl ms-2"></i>

                    {!selected_event.collection ?
                        <div className="d-flex" style={{ maxWidth: 250 }}>
                            <input value={search} onChange={(event) => setSearch(event.target.value)} className="form-control text-center" placeholder="Cari Event" />
                        </div>
                        : null}

                    <a className="navbar-brand">
                        <img src={logo} width="35" height="35" />
                    </a>
                </div>
            </nav>

            {auth.user.role !== 'panitia' && !selected_event.collection ?
                <div className='pt-5 mt-4'>
                    <CardEvent onSelectEvent={onSelectEvent} search={search} />
                </div>
                : null}

            {selected_event.collection && data ?
                <div className='pt-4'>
                    <ul className="nav nav-tabs pt-4 mt-4 align-items-center">
                        {/* <i onClick={() => resetValue()} className="fa-sharp fa-solid fa-circle-arrow-left fa-2xl mx-4 mb-2"></i> */}
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#individu" type="button" role="tab" aria-controls="home" aria-selected="true">Individu</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tim" type="button" role="tab" aria-controls="profile" aria-selected="false">Klub/Provinsi</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#aduan" type="button" role="tab" aria-selected="false">Aduan</button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="individu" role="tabpanel">{<RankingIndividu selected_event={selected_event} data={data} />}</div>
                        <div className="tab-pane fade" id="tim" role="tabpanel">{<RankingTim selected_event={selected_event} data={data} />}</div>
                        <div className="tab-pane fade" id="aduan" role="tabpanel">{<Aduan selected_event={selected_event} data={data} />}</div>
                    </div>
                </div>
                :
                loading ?
                    <div className='container pt-5'>
                        <img className="logo-1 pt-5 mt-4 mb-3" src={logo} style={{ marginTop: -60 }} />
                        <h6 className='text-muted'>Loading...</h6>
                    </div>
                    : null
            }
        </>
    )
}

export default Rekapitulasi