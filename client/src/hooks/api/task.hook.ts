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

export const useTaskUpdateMutation = () =>
  useMutation<TaskEntity, ApiErrorType, ITaskUpdateInput>(
    async (data: ITaskUpdateInput) => {
      const res = await axiosInstance.put(`/task/${data.id}`, data);

      return res.data;
    },
  );
