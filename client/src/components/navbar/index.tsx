import { useAuthContext } from '@/context/useAuthContext';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '../ui/button';

interface NavbarProps {}

// eslint-disable-next-line no-empty-pattern
const Navbar: FC<NavbarProps> = ({}) => {
  const { user, logout } = useAuthContext();
  return (
    <nav className="flex justify-between items-center py-2">
      <h1 className="text-xl font-bold">Task Tracker</h1>
      <div>
        {!user && (
          <Link to="/login" className={buttonVariants()}>
            Login
          </Link>
        )}
        {user && (
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
