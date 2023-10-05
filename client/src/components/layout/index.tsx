import { FC } from 'react';
import Navbar from '../navbar';
import { Outlet } from 'react-router-dom';

const Layout: FC = () => {
  return (
    <main className="container mx-auto min-h-screen">
      <Navbar />
      <section className="">
        <Outlet />
      </section>
    </main>
  );
};

export default Layout;
