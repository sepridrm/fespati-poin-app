import { useEffect, useState } from 'react';
import '../../index.css';
import logo from '../../assets/logo.png';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { firebaseConfig } from '../../utils/config';
import { ItemEvent } from './ItemEvent';
import { UseAuth } from '../../routes/useAuth';
// import moment from 'moment';

initializeApp(firebaseConfig());
const db = getFirestore();

const CardEvent = ({ onSelectEvent, search }) => {
    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);

    const useAuth = UseAuth();

    // const dateNow = Timestamp.fromDate(moment().toDate());

    useEffect(() => {
        if (event.length === 0)
            getEvent();
    }, [])

    const getEvent = () => {
        // , where('tanggal_selesai', '>=', dateNow)
        let q;
        if (useAuth.user && useAuth.user.role === 'admin')
            q = query(collection(db, `event`), where('publish', '==', true), where('id_admin', '==', useAuth.user.collection));
        else
            q = query(collection(db, `event`), where('publish', '==', true));
        onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const temp = {
                    ...doc.data(),
                    collection: doc.id
                }
                data.push(temp);
            });
            setEvent(data.reverse());
            setLoading(false);
        })
    }

    function searchFilter() {
        const newData = event.filter(item => {
            const itemData = `${item.nama_event.toUpperCase()}`
            const textData = search.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        return newData;
    }

    return (
        event.length > 0 ?
            <ItemEvent data={search ? searchFilter() : event} onSelectEvent={onSelectEvent} />
            :
            <div className='container mt-5'>
                <img className="logo-1 mt-5 mb-3" src={logo} style={{ marginTop: -60 }} />
                {loading ?
                    <h6 className='text-muted'>Loading...</h6>
                    :
                    <h6 className='text-muted'>Belum ada Event</h6>
                }
            </div>

    )
}

export default CardEvent