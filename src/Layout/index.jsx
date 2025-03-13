import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="mt-5 bg-light">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
