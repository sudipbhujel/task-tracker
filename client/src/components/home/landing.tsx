import { FC } from 'react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button';

interface LandingProps {}

const Landing: FC<LandingProps> = () => {
  return (
    <div className="my-10">
      <h1 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
        Track your tasks
      </h1>
      <p className="my-4 max-w-[750px] text-base text-muted-foreground sm:text-lg">
        Stay On Top of Your Tasks with Ease! Simplify Your Life with our Task
        Tracker App.
      </p>
      <div className="flex space-x-2">
        <Link to="/register" className={buttonVariants()}>
          Register
        </Link>
        <Link to="/login" className={buttonVariants({ variant: 'outline' })}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Landing;
