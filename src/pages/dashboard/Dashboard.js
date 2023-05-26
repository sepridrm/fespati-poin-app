import logo from '../../assets/logo.png';
import { Link } from "react-router-dom";
import { useState } from 'react';
import CardEvent from '../event-poin/CardEvent';
import RankingIndividu from '../ranking/RankingIndividu';
import RankingTim from '../ranking/RankingTim';
import { collection, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../utils/config';
import Aduan from '../aduan/Aduan';
initializeApp(firebaseConfig());
const db = getFirestore();

function Dashboard() {
  const [selected_event, setSelectedEvent] = useState({});
  const [search, setSearch] = useState('');
  const [data, setData] = useState(null);

  const onSelectEvent = (event) => {
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
    })
  }

  const resetValue = () => {
    setSelectedEvent({});
    setData(null);
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm">
        <div className="container-fluid">

          {selected_event.collection && data ?
            <i onClick={() => resetValue()} className="fa-sharp fa-solid fa-circle-arrow-left fa-2xl ms-2"></i>
            :
            <a className="navbar-brand">
              <img src={logo} width="35" height="35" />
            </a>
          }

          {!selected_event.collection ?
            <div className="d-flex" style={{ maxWidth: 250 }}>
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="form-control text-center" placeholder="Cari Event" />
            </div>
            : null}

            <Link to="/login" className="navbar-brand">
              <i className="fa fa-user-circle fa-xl text-success" aria-hidden="true"></i>
            </Link>
        </div>
      </nav>

      {!selected_event.collection ?
        <div className='pt-5 mt-4'>
          <CardEvent onSelectEvent={onSelectEvent} search={search} />
        </div>
        : null}

      {selected_event.collection && data ?
        <div className='pt-4'>
          <ul className="nav nav-tabs pt-4 mt-4 align-items-center">
            {/* <i onClick={() => resetValue()} className="fa-sharp fa-solid fa-circle-arrow-left fa-2xl mx-4 mb-2"></i> */}

            <li className="nav-item" role="presentation">
              <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#individu" type="button" role="tab" aria-selected="true">Individu</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tim" type="button" role="tab" aria-selected="false">Klub/Provinsi</button>
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
        : null}
    </>
  )
}

export default Dashboard