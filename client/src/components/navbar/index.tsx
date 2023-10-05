import { useAuthContext } from '@/context/useAuthContext';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface NavbarProps {}

// eslint-disable-next-line no-empty-pattern
const Navbar: FC<NavbarProps> = ({}) => {
  const { user, logout } = useAuthContext();
  return (
    <nav className="flex justify-between items-center py-2">
      <h1 className="text-xl font-bold">Task Tracker</h1>

      {!user && (
        <Link to="/login" className={buttonVariants()}>
          Login
        </Link>
      )}
      {user && (
        <div className="flex space-x-2">
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
          <div className="flex items-center space-x-1">
            <Avatar>
              <AvatarImage />
              <AvatarFallback>
                {user.firstName?.at(0) + '' + user.lastName?.at(0)}
              </AvatarFallback>
            </Avatar>
            <p>
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
