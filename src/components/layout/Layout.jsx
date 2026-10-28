import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Header from './Header';
import ToastContainer from '../common/ToastContainer';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 lg:pb-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
      <ToastContainer />
    </div>
  );
}
