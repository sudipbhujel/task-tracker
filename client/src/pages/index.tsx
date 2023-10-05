import TaskList from '@/components/task/task-list';
import { useAuthContext } from '@/context/useAuthContext';
import { FC } from 'react';

const MainPage: FC = () => {
  const { user } = useAuthContext();

  console.log('user = ', user);
  return <div>{user ? <TaskList /> : null}</div>;
};

export default MainPage;
