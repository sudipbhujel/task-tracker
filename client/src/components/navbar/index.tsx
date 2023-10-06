import { useAuthContext } from '@/context/useAuthContext';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ReaderIcon } from '@radix-ui/react-icons';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const { user, logout } = useAuthContext();
  return (
    <>
      <nav className="flex justify-between items-center py-1">
        {/* <h1 className="text-xl font-bold">Task Tracker</h1> */}
        {/* <img src="logo.png" alt="Logo" className="h-8 w-8 scale-150" /> */}
        <div className="flex space-x-1 items-center">
          <ReaderIcon className="h-6 w-6" />
          <p>Task Tracker</p>
        </div>

        {!user && (
          <Link to="/login" className={buttonVariants()}>
            Login
          </Link>
        )}
        {user && (
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
            <Button variant="ghost" className="space-x-1">
              <Avatar className="h-8 w-8">
                <AvatarImage />
                <AvatarFallback>
                  {user.firstName?.at(0) + '' + user.lastName?.at(0)}
                </AvatarFallback>
              </Avatar>
              <p>
                {user.firstName} {user.lastName}
              </p>
            </Button>
          </div>
        )}
      </nav>
      <Separator />
    </>
  );
};

export default Navbar;
