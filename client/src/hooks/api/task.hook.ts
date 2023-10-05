import axiosInstance from '@/lib/axios';
import { components } from '@/types';
import { useMutation } from '@tanstack/react-query';

type TaskEntity = components['schemas']['TaskEntity'];

export type ApiErrorType = {
  message: string;
};

type ITaskUpdateInput = Omit<
  components['schemas']['UpdateTaskDto'],
  'deadline'
> & {
  id: string;
  deadline: Date | string;
};

type ITaskCreateInput = Omit<
  components['schemas']['CreateTaskDto'],
  'deadline'
> & {
  id: string;
  deadline: Date | string;
};

export const useTaskCreateMutation = () =>
  useMutation<TaskEntity, ApiErrorType, ITaskCreateInput>(
    async (data: ITaskUpdateInput) => {
      const res = await axiosInstance.post(`/task/${data.id}`, data);

      return res.data;
    },
  );

export const useTaskUpdateMutation = () =>
  useMutation<TaskEntity, ApiErrorType, ITaskUpdateInput>(
    async (data: ITaskUpdateInput) => {
      const res = await axiosInstance.put(`/task/${data.id}`, data);

      return res.data;
    },
  );

export const useTaskDeleteMutation = () =>
  useMutation(async (id: string) => {
    const res = await axiosInstance.delete(`/task/${id}`);

    return res.data;
  });
