
import '../../index.css';
import logo from '../../assets/logo.png';
import { Link } from "react-router-dom";
import av from '../../assets/av.png'
import { UseAuth } from '../../routes/useAuth';
import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import moment from 'moment';

function Admin() {
  const [event, setEvent] = useState({})
  const auth = UseAuth()

  useEffect(() => {
    if (auth.user.role === 'panitia')
      firestore.getEventId(auth.user.id_event).then(res => {
        setEvent(res);
      })
  }, [])


  const logout = () => {
    auth.logout()
  }

  const capitalizeFirstLetter = (str) => {
    if (str)
      return str[0].toUpperCase() + str.slice(1);
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand">
            <img src={logo} width="35" height="35" />
          </a>
          <button onClick={() => logout()} className="btn btn-sm btn-danger m-2 px-3 text-white">Keluar</button>
        </div>
      </nav>

      <div className="container mt-5 pt-4">

        {auth.user.role === 'panitia' && event.collection ?
          <div className='shadow rounded pb-3 p-4 mt-4'>
            <div className='text-center'>
              <img className="logo-1" src={process.env.REACT_APP_imageURL.replace('.php', '/') + event.logo} />
              <h5 className='mt-3'>{event.nama_event}</h5>
              <h6>{moment(event.tanggal_mulai.toDate()).format('DD MMM YYYY')} s/d {moment(event.tanggal_selesai.toDate()).format('DD MMM YYYY')}</h6>
            </div>
          </div>
          : <img className="logo-1 mt-3" src={logo} />
        }

        <div className='py-2 px-3 mt-3'>
          <div className='text-center'>
            <h5>{auth.user.nama}</h5>
            <h6>{auth.user.email}</h6>
            <h6>{capitalizeFirstLetter(auth.user.role)}</h6>
          </div>
        </div>

        {auth.user.role === 'superadmin' ?
          <>
            <Link className="btn btn-md btn-success mt-5 mx-2 px-3 text-white" to="/data-admin">Data Admin</Link>
            <Link className="btn btn-md btn-success mt-2 mx-2 px-3 text-white" to="/data-event">Data Event</Link>
          </>
          : null}

        {auth.user.role === 'admin' ?
          <>
            <Link className="btn btn-md btn-success mt-3 mx-2 px-3 text-white" to="/data-event">Data Event</Link>
            <Link className="btn btn-md btn-success mt-2 mx-2 px-3 text-white" to="/data-panitia">Data Panitia</Link>
            <Link className="btn btn-md btn-success mt-2 mx-2 px-3 text-white" to="/peserta">Data Peserta</Link>
            <Link className="btn btn-md btn-success mt-2 mx-2 px-3 text-white" to="/input-poin">Input Poin Peserta</Link>
            <Link className="btn btn-md btn-success mt-2 mx-2 px-3 text-white" to="/ubah-poin">Ubah Poin Peserta</Link>
            <Link className="btn btn-md btn-success mt-2 mx-2 px-3 text-white" to="/rakapitulasi">Rekapitulasi Poin</Link>
          </>
          : null}

        {auth.user.role === 'panitia' ?
          <>
            {/* <Link className="btn btn-md btn-success mt-5 mx-2 px-3 text-white" to="/peserta">Data Peserta</Link> */}
            <Link className="btn btn-md btn-success mt-5 mx-2 px-3 text-white" to="/input-poin">Input Poin Peserta</Link>
            <Link className="btn btn-md btn-success mt-2 mx-2 px-3 text-white" to="/rakapitulasi">Rekapitulasi Poin</Link>
            {/* <Link className="btn btn-md btn-success mt-2 mx-2 px-3 text-white" to="/ubah-poin">Ubah Poin Peserta</Link> */}
          </>
          : null}

        <div style={{ fontSize: 13, marginTop: auth.user.role === 'panitia' ? 250 : 130 }}>Develop by</div>
        <img className="logo-1" src={av} />
      </div>
    </>
  )
}

export default Admin