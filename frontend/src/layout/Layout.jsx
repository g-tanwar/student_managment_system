import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-wrapper">
        <TopNav />
        <main className="main-content">
          <div className="content-max">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
