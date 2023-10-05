import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { ErrorResponse } from '@/index';
import axiosInstance from '@/lib/axios';
import { components } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';

export type User = components['schemas']['MeEntity'];

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { getItem, setItem, removeItem } = useLocalStorage();
  const { toast } = useToast();

  // Login mutation
  const { mutate: loginMutate } = useMutation(
    ['login'],
    async ({ data }: { data: components['schemas']['AuthLoginDto'] }) => {
      const res = await axiosInstance.post('/auth/login', data);

      return res.data;
    },
  );

  // Logout mutation
  const { mutate: logoutMutate } = useMutation(['logout'], async () => {
    const res = await axiosInstance.post('/auth/logout', {});

    return res.data;
  });

  useEffect(() => {
    const _user = getItem('user');
    if (_user) setUser(JSON.parse(_user));
    else setUser(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addUser = useCallback(
    (user: User) => {
      setItem('user', JSON.stringify(user));
      setUser(user);
    },
    [setItem],
  );

  const removeUser = useCallback(() => {
    removeItem('user');
    setUser(null);
  }, [removeItem]);

  const login = (data: { email: string; password: string }) => {
    loginMutate(
      { data },
      {
        onSuccess: (data) => {
          addUser(data);
          navigate('/');
          toast({
            title: 'Success',
            description: 'Logged in successfully',
          });
        },
        onError: (err) => {
          toast({
            title: 'Error',
            description: (err as AxiosError<ErrorResponse>).response?.data
              ?.message,
            variant: 'destructive',
          });
        },
      },
    );
  };

  const logout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        removeUser();
        navigate('/');
        toast({
          title: 'Success',
          description: 'Logged out successfully',
        });
      },
      onError: (err) => {
        toast({
          title: 'Error',
          description: (err as AxiosError<ErrorResponse>).response?.data
            ?.message,
          variant: 'destructive',
        });
      },
    });
  };

  return { user, login, logout };
};
