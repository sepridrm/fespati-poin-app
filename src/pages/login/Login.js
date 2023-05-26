
import '../../index.css';
import { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import av from '../../assets/av.png'
import logo from '../../assets/logo.png';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../utils/config';
import { UseAuth } from '../../routes/useAuth';
import { useNavigate } from "react-router-dom";
initializeApp(firebaseConfig());
const provider = new GoogleAuthProvider();
const auth = getAuth();

function Login() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const useAuth = UseAuth();
  const navigate = useNavigate();

  const signInGoogle = () => {
    setLoading(true);

    signInWithPopup(auth, provider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // const user = result.user;
        firestore.getAdmin(result.user.email).then(res => {
          if (res.collection)
            login(res);
          else {
            firestore.getPanitia(result.user.email).then(res => {
              if (res.collection)
                login(res);
              else{
                setLoading(false);
                setErrMessage('Admin tidak terdaftar');
              }
            })
          }
        })
      }).catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.customData.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
        setLoading(false);
        setErrMessage(error.code === 'auth/popup-closed-by-user' ? '' : error.message.replace('Firebase:', ''));
      });
  }

  // const signInEmail = () => {
  //   if (email === '' || password === '') {
  //     setErrMessage('Silahkan lengkapi data');
  //     return;
  //   } else if (!validateEmail(email)) {
  //     setErrMessage('Email tidak valid');
  //     return;
  //   }

  //   signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       console.log(user);
  //     })
  //     .catch((error) => {
  //       // const errorCode = error.code;
  //       // const errorMessage = error.message;
  //       setErrMessage(error.message.replace('Firebase:', ''));
  //     });
  // }

  const login = (user) => {
    setLoading(false);
    useAuth.login(user)
  }

  useEffect(() => {
    if (useAuth.user)
      navigate("/admin", { replace: true });
  }, [])


  return (
    <div className="container">
      <img className="logo-5 mb-5" style={{ marginTop: 130 }} src={logo} />

      {/* <input required type="email" style={{ maxWidth: 280 }} className="form-control mt-4" placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} />
      <input required type="password" style={{ maxWidth: 280 }} className="form-control mt-2" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} />
      <button onClick={() => signInEmail()} className="btn btn-md btn-info mt-4 mb-4 mx-2 px-3 text-white">Masuk</button>
      <label>atau</label> */}

      <button onClick={() => signInGoogle()} className={loading ? 'btn btn-secondary disabled mt-5 px-3' : 'btn btn-success mt-5 mx-2 px-3'}>Masuk dengan Google</button>

      <div style={{ fontSize: 13, marginTop: 300 }}>Develop by</div>
      <img className="logo-1" src={av} />

      {errMessage ?
        <div className="alert alert-danger" role="alert" style={{ position: 'absolute', bottom: 50 }}>
          {errMessage}
        </div>
        : null
      }
    </div>
  )
}

export default Login