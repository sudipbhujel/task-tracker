import axiosInstance from '@/lib/axios';
import { cn } from '@/lib/utils';
import { components } from '@/types';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import moment from 'moment';
import { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import TaskEditButton from './task-edit-button';

interface TaskListProps {}
type ITask = components['schemas']['TaskEntity'];
type IPriority = components['schemas']['CreateTaskDto']['priority'];
type IDeadline = 'PAST' | 'TODAY' | 'FUTURE';

const TaskListSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
};

const TaskList: FC<TaskListProps> = () => {
  const [searchParam, setSearchParam] = useSearchParams();

  const search = [...searchParam.entries()].reduce(
    (acc, cur) => ({
      ...acc,
      [cur[0]]: cur[1],
    }),
    {},
  ) as { priority: string; deadline: string };

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const query = Object.entries(search)
        .map(([key, val]) => `${key}=${val}`)
        .join('&');

      const res = await axiosInstance.get('/task?' + query);

      return res.data as ITask[];
    },
  });

  useEffect(() => {
    if (search) {
      refetch();
    }
  }, [refetch, search]);

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <div className="flex space-x-2">
          <Select
            value={search.priority}
            onValueChange={(_value) => {
              const value =
                _value === 'ALL' ? undefined : (_value as IPriority);

              if (value) setSearchParam({ ...search, priority: value });
              else {
                const copy = { ...search };
                setSearchParam({ ..._.omit(copy, 'priority') });
              }
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={search.deadline}
            onValueChange={(_value) => {
              const value =
                _value === 'ALL' ? undefined : (_value as IDeadline);

              if (value) setSearchParam({ ...search, deadline: value });
              else {
                const copy = { ...search };
                setSearchParam({ ..._.omit(copy, 'deadline') });
              }
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PAST">Past</SelectItem>
              <SelectItem value="TODAY">Today</SelectItem>
              <SelectItem value="FUTURE">Future</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading && <TaskListSkeleton />}
      <TaskEditButton />
      <div className="space-y-2 mt-2">
        {data?.map((item) => {
          return (
            <div
              key={item.id}
              className="flex flex-row items-center justify-between rounded-lg border p-2"
            >
              <div className="">
                <p className="text-base font-medium">{item.title}</p>

                <div className="flex space-x-2 items-center">
                  <p className="text-sm text-muted-foreground">
                    {moment(item.deadline).format('YYYY/MMM/DD hh:mm A')}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn('text-white', {
                      'text-red-500': item.priority === 'HIGH',
                      'text-green-500': item.priority === 'MEDIUM',
                      'text-blue-500': item.priority === 'LOW',
                    })}
                  >
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button>Edit </Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TaskList;
