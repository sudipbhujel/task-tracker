import axiosInstance from '@/lib/axios';
import { components } from '@/types';
import { CrossCircledIcon, MixerVerticalIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Task from './task';
import TaskAddButton from './task-add-button';
import TaskListSkeleton from './task-skeleton';

interface TaskListProps {}
type ITask = components['schemas']['TaskEntity'];
type IPriority = components['schemas']['CreateTaskDto']['priority'];
type IDeadline = 'PAST' | 'TODAY' | 'FUTURE';
// type ISortBy = 'priority' | 'deadline' | 'updatedAt';
// type IOrderBy = 'asc' | 'desc';

// const sortFields = ['priority', 'deadline', 'updatedAt'];

const TaskList: FC<TaskListProps> = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedValue] = useDebounce(searchText, 500);

  const [searchParam, setSearchParam] = useSearchParams();

  const search = [...searchParam.entries()].reduce(
    (acc, cur) => ({
      ...acc,
      [cur[0]]: cur[1],
    }),
    {},
  ) as {
    q: string;
    priority: string;
    deadline: string;
    sortBy: string;
    orderBy: string;
  };

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const query = Object.entries(search)
        .map(([key, val]) => `${key}=${val}`)
        .join('&');

      const res = await axiosInstance.get('/task?' + query);

      return res.data as ITask[];
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // First set search text from query
  useEffect(() => {
    if (search.q) {
      setSearchText(search.q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch query if search changes
  useEffect(() => {
    if (search) {
      refetch();
    }
  }, [refetch, search]);

  // Set debounced value in search text `q` params
  useEffect(() => {
    if (debouncedValue) {
      setSearchParam({ ...search, q: debouncedValue });
    } else {
      const copy = { ...search };
      setSearchParam({ ..._.omit(copy, 'q') });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, setSearchParam]);

  return (
    <section className="mt-6">
      {/* Filters */}
      <div className="flex gap-2 justify-between flex-col sm:flex-row flex-wrap">
        <div className="flex items-center flex-wrap gap-2">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <Input
            value={searchText}
            type="text"
            placeholder="Search"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            className="w-[100px] sm:w-[120px]"
          />
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
            <SelectTrigger
              className="w-[90px] sm:w-[120px]"
              aria-label="Priority"
            >
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
            <SelectTrigger
              className="w-[100px] sm:w-[120px]"
              aria-label="Deadline"
            >
              <SelectValue placeholder="Deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PAST">Past</SelectItem>
              <SelectItem value="TODAY">Today</SelectItem>
              <SelectItem value="FUTURE">Future</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            className="space-x-1 items-center"
            onClick={(e) => {
              e.preventDefault();
              setSearchParam({});
            }}
            aria-label="Clear filters"
          >
            <CrossCircledIcon className="w-5 h-5" />
            <p className="hidden sm:block">Clear&nbsp;filters</p>
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select
            value={search.sortBy}
            onValueChange={(value) => {
              if (value)
                setSearchParam({
                  ...search,
                  sortBy: value,
                });
            }}
          >
            <SelectTrigger className="w-[130px]" aria-label="Sort">
              <SelectValue
                placeholder={
                  <div className="flex space-x-1 items-center">
                    <MixerVerticalIcon />
                    <p>Sort</p>
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="updatedAt">Updated At</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={search.orderBy}
            onValueChange={(value) => {
              if (value)
                setSearchParam({
                  ...search,
                  orderBy: value,
                });
            }}
          >
            <SelectTrigger className="w-[130px]" aria-label="Order">
              <SelectValue
                placeholder={
                  <div className="flex space-x-1 items-center">
                    <MixerVerticalIcon />
                    <p>Order</p>
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>

          {/* <Button aria-label="Add Task">Add Task</Button> */}
          <TaskAddButton />
        </div>
      </div>
      {isLoading && <TaskListSkeleton />}
      {/* Tasks */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3 flex-wrap w-full">
        {data?.map((item) => <Task key={item.id} item={item} />)}
      </div>
      {!data?.length && !isLoading && (
        <p className="text-sm text-muted-foreground text-center">
          No tasks found
        </p>
      )}
    </section>
  );
};

export default TaskList;
