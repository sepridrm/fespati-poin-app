import '../../index.css';
import notfound from '../../assets/404.png';

const NoPage = () => {
  return (
    <div className="container">
        <img className="logo" src={notfound}/>
    </div>
  )
}

export default NoPage