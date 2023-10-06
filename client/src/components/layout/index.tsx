import { FC } from 'react';
import Helmet from 'react-helmet';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar';

const Layout: FC = () => {
  return (
    <>
      <Helmet>
        <title>Task Tracker</title>
        <meta name="description" content="Task Prioritizer" />
      </Helmet>
      <main className="container mx-auto min-h-screen">
        <Navbar />
        <section className="">
          <Outlet />
        </section>
      </main>
    </>
  );
};

export default Layout;
