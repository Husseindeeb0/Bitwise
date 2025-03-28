import './style.css';

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-50">
      <span className="loader"></span>
    </div>
  )
}

export default Loader