import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, setDoc, query, where, arrayUnion, updateDoc, orderBy, Timestamp, onSnapshot } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from '../utils/config';

initializeApp(firebaseConfig());

const db = getFirestore();

export const firestore = {
    allTim: async function () {
        const q = query(collection(db, `tim`));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    listTim: async function (cat) {
        const q = query(collection(db, `tim`), where("category", "==", cat));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    listPemanah: async function (coll) {
        const q = query(collection(db, `tim/${coll}/anggota`), orderBy("kode_peserta", "asc"));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    saveSkor: async function (data) {
        const ref = collection(db, `skor`);
        await addDoc(ref, data);

        return true;
    },
    saveTim: async function (tim) {
        const ref = collection(db, `tim`);
        const docRef = await addDoc(ref, tim);
        // console.log(tim);

        return docRef.id;
    },
    savePeserta: async function (data) {
        const ref = collection(db, `peserta`);
        await addDoc(ref, data);

        return true;
    },
    listPeserta: async function () {
        const q = query(collection(db, `peserta`), where("kategori", "==", "IKHWAN BEREGU"), orderBy("kode_peserta", "asc"));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    getSkor: async function () {
        const q = query(collection(db, `skor`), where("kode_peserta", "==", "T242B"), orderBy("rambahan", "asc"));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    getPeserta: async function () {
        const q = query(collection(db, `peserta`), where("kode_peserta", "==", "T261C"));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    saveAnggota: async function (coll, anggota) {
        const ref = collection(db, `tim/${coll}/anggota`);
        await addDoc(ref, anggota);
        // console.log(col, anggota);

        return true;
    },
    updatePeserta: async function (coll, data) {
        const ref = doc(db, `peserta`, coll);
        await updateDoc(ref, data);

        return true;
    },
    updateSkor: async function (coll, data) {
        const ref = doc(db, `skor`, coll);
        await updateDoc(ref, data);

        return true;
    },
    getSkorPeserta: async function (id_peserta) {
        const q = query(collection(db, "skor"), where("id_peserta", "==", id_peserta), orderBy("rambahan", "asc"));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    getAdmin: async function (email) {
        const q = query(collection(db, `admin`), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        let data = {};
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data = temp;
        });
        return data;
    },
    saveAdmin: async function (data) {
        const ref = collection(db, `admin`);
        await addDoc(ref, data);

        return true;
    },
    updateAdmin: async function (coll, data) {
        const ref = doc(db, `admin`, coll);
        await updateDoc(ref, data);

        return true;
    },
    getEventId: async function (id_event) {
        const docRef = doc(db, "event", id_event);
        const docSnap = await getDoc(docRef);
        let data = {};

        if (docSnap.exists()) {
            data = {
                ...docSnap.data(),
                collection: id_event
            }
        }
        return data;
    },
    getEvent: async function (admin) {
        const q = query(collection(db, `event`), where("id_admin", "==", admin));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    saveEvent: async function (data) {
        const ref = collection(db, `event`);
        await addDoc(ref, data);

        return true;
    },
    updateEvent: async function (coll, data) {
        const ref = doc(db, `event`, coll);
        await updateDoc(ref, data);

        return true;
    },
    getPanitia: async function (email) {
        const q = query(collection(db, `panitia`), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        let data = {};
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                role: 'panitia',
                collection: doc.id
            }
            data = temp;
        });
        
        return data;
    },
    savePanitia: async function (data) {
        const ref = collection(db, `panitia`);
        await addDoc(ref, data);

        return true;
    },
    updatePanitia: async function (coll, data) {
        const ref = doc(db, `panitia`, coll);
        await updateDoc(ref, data);

        return true;
    },
    getAduan: async function (event, kategori) {
        const q = query(collection(db, `aduan`), where("id_event", "==", event), where('kategori', '==', kategori));
        const querySnapshot = await getDocs(q);
        let data = {};
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data = temp;
        });
        
        return data;
    },
    saveAduan: async function (aduan) {
        const ref = collection(db, `aduan`);
        await addDoc(ref, aduan);

        return true;
    },
    updateAduan: async function (coll, aduan) {
        const ref = doc(db, `aduan`, coll);
        await updateDoc(ref, aduan);

        return true;
    },
    getPanitiabyEvent: async function (event) {
        const q = query(collection(db, `panitia`), where("id_event", "==", event));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                role: 'panitia',
                collection: doc.id
            }
            data.push(temp);
        });
        
        return data;
    },
    getPesertabyEvent: async function (event) {
        const q = query(collection(db, `peserta`), where("id_event", "==", event));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        
        return data;
    },
    getSkorbyEvent: async function (event) {
        const q = query(collection(db, `skor`), where("id_event", "==", event));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        
        return data;
    },
    getAduanbyEvent: async function (event) {
        const q = query(collection(db, `aduan`), where("id_event", "==", event));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        
        return data;
    },

    // ===============

    saveKebun: async function (collectionId, kebun) {
        const ref = collection(db, `companies/${collectionId}/kebuns`);
        await setDoc(doc(ref), kebun);

        return true;
    },
    updateKebun: async function (collectionId, kebunId, geoserver) {
        const ref = doc(db, `companies/${collectionId}/kebuns`, kebunId);
        await updateDoc(ref, { geoserver: geoserver });

        return true;
    },
    savePackage: async function (collectionId, packaged) {
        const ref = doc(db, `statics/${collectionId}`);
        await updateDoc(ref, packaged);

        return true;
    },
    updatePackage: async function (collectionId, packaged) {
        const ref = doc(db, `statics/${collectionId}`);
        await updateDoc(ref, packaged);

        return true;
    },
    listUser: async function (company_id) {
        const q = query(collection(db, `users`), where("company_id", "==", company_id));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    saveUser: async function (user) {
        const ref = collection(db, "users");
        await setDoc(doc(ref), user);

        return true;
    },
    getUser: async function (email) {
        const q = query(collection(db, `users`), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        let data;
        querySnapshot.forEach((doc) => {
            data = doc.data();
        });
        return data;
    },
    listCompany: async function () {
        const q = query(collection(db, "companies"));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    saveCompany: async function (company) {
        const ref = collection(db, "companies");
        await setDoc(doc(ref), company);

        return true;
    },
    updateCompany: async function (collectionId, company) {
        const ref = doc(db, `companies/${collectionId}`);
        await updateDoc(ref, company);

        return true;
    },
    getCompany: async function (companyId) {
        const q = query(collection(db, "companies"), where("id", "==", companyId));
        const querySnapshot = await getDocs(q);
        let data;
        querySnapshot.forEach((doc) => {
            data = {
                ...doc.data(),
                collection: doc.id
            }
        });
        if (data)
            delete data.id;
        return data;
    },
    companyPackage: async function (companyId) {
        let q = query(collection(db, "companies"), where("id", "==", companyId));
        let querySnapshot = await getDocs(q);
        let data;
        querySnapshot.forEach((doc) => {
            data = {
                package: doc.data().package
            };
        });

        q = query(collection(db, `statics`), where("id", "==", 'package'));
        querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data = {
                ...data,
                data: doc.data()[data.package]
            }
        });

        return data;
    },
    listKebun: async function (collectionId) {
        const q = query(collection(db, `companies/${collectionId}/kebuns`));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    getKebuns: async function (collectionId) {
        const q = query(collection(db, `companies/${collectionId}/kebuns`));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const temp = {
                ...doc.data(),
                collection: doc.id
            }
            data.push(temp);
        });
        return data;
    },
    getBlokColls: async function () {
        const q = query(collection(db, `statics`), where("id", "==", 'blok'));
        const querySnapshot = await getDocs(q);
        let data;
        querySnapshot.forEach((doc) => {
            data = doc.data().data;
        });
        return data;
    },
    getBlokData: async function (collectionId, kebunId, field, layerId) {
        const ref = collection(db, `companies/${collectionId}/kebuns/${kebunId}/${field}`);
        const q = query(ref, where("layer_id", "==", layerId));
        const querySnapshot = await getDocs(q);
        let data;
        querySnapshot.forEach((doc) => {
            data = doc.data();
        });
        return data;
    },
    saveBlokData: async function (collectionId, kebunId, field, layerId, docData) {
        let ref = collection(db, `companies/${collectionId}/kebuns/${kebunId}/${field}`);
        const q = query(ref, where("layer_id", "==", layerId));
        const querySnapshot = await getDocs(q);
        let data = [];
        let docId;
        querySnapshot.forEach((doc) => {
            docId = doc.id;
            data = doc.data().data;
        });
        data.push(docData.data[0]);

        if (docId) {
            ref = doc(db, `companies/${collectionId}/kebuns/${kebunId}/${field}`, docId);
            await updateDoc(ref, { data: data });
        } else {
            await addDoc(ref, docData);
        }

        return true;
    }
}

export const auth = {
    addUser: async function (user) {
        const auth = getAuth();
        const createUser = await createUserWithEmailAndPassword(auth, user.email, user.password);

        return createUser;
    },
}