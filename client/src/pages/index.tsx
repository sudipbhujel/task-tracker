import { useAuth } from '@/hooks/useAuth';
import { FC } from 'react';

const MainPage: FC = () => {
  const { user } = useAuth();

  console.log('user = ', user);
  return <div>Hi</div>;
};

export default MainPage;
