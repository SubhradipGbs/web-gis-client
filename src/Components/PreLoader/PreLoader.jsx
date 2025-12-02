import "./preloader.css";

function Preloader() {
  return (
    <div className='preloader'>
      <img
        src='/preloader_logo.png'
        alt='Loading...'
        className='preloader-image'
      />
    </div>
  );
}

export default Preloader;
