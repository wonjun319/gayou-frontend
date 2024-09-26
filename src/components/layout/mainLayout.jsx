import { Outlet } from 'react-router-dom';
import Navbar from '../../pages/navbar/navbar';
import Footer from '../../pages/homepage/footer';
import '../../components/layout/msinLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
