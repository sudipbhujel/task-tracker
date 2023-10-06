import { useTaskUpdateMutation } from '@/hooks/api/task.hook';
import axiosInstance from '@/lib/axios';
import { cn } from '@/lib/utils';
import { components } from '@/types';
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  MixerVerticalIcon,
} from '@radix-ui/react-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { toast } from '../ui/use-toast';
import { TaskDeleteButton } from './task-delete-button';
import TaskEditButton from './task-edit-button';
import TaskAddButton from './task-add-button';

interface TaskListProps {}
type ITask = components['schemas']['TaskEntity'];
type IPriority = components['schemas']['CreateTaskDto']['priority'];
type IDeadline = 'PAST' | 'TODAY' | 'FUTURE';
// type ISortBy = 'priority' | 'deadline' | 'updatedAt';
// type IOrderBy = 'asc' | 'desc';

// const sortFields = ['priority', 'deadline', 'updatedAt'];

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
  const { mutate } = useTaskUpdateMutation();
  const queryClient = useQueryClient();

  const search = [...searchParam.entries()].reduce(
    (acc, cur) => ({
      ...acc,
      [cur[0]]: cur[1],
    }),
    {},
  ) as { priority: string; deadline: string; sortBy: string; orderBy: string };

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
    <section className="mt-2">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <h2 className="text-lg font-semibold">Tasks</h2>
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
            <SelectTrigger className="w-[120px]" aria-label="Priority">
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
            <SelectTrigger className="w-[120px]" aria-label="Deadline">
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
            <CrossCircledIcon />
            <p>Clear filters</p>
          </Button>
        </div>
        <div className="flex space-x-2">
          {/* <Select
            value={search.sortBy === 'priority' ? search.orderBy : undefined}
            onValueChange={(value) => {
              if (value)
                setSearchParam({
                  ...search,
                  sortBy: 'priority',
                  orderBy: value,
                });
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue
                placeholder={
                  <div className="flex space-x-1 items-center">
                    <MixerVerticalIcon />
                    <p>Priority</p>
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Priority Asc</SelectItem>
              <SelectItem value="desc">Priority Desc</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={search.sortBy === 'deadline' ? search.orderBy : undefined}
            onValueChange={(_value) => {
              const value = _value === 'ALL' ? undefined : (_value as IOrderBy);

              if (value)
                setSearchParam({
                  ...search,
                  sortBy: 'deadline',
                  orderBy: value,
                });
              else {
                const copy = { ...search };
                setSearchParam({ ..._.omit(copy, ['sortBy', 'orderBy']) });
              }
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue
                placeholder={
                  <div className="flex space-x-1 items-center">
                    <MixerVerticalIcon />
                    <p>Deadline</p>
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Deadline Asc</SelectItem>
              <SelectItem value="desc">Deadline Desc</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={search.sortBy === 'updatedAt' ? search.orderBy : undefined}
            onValueChange={(_value) => {
              const value = _value === 'ALL' ? undefined : (_value as IOrderBy);

              if (value)
                setSearchParam({
                  ...search,
                  sortBy: 'updatedAt',
                  orderBy: value,
                });
              else {
                const copy = { ...search };
                setSearchParam({ ..._.omit(copy, ['sortBy', 'orderBy']) });
              }
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue
                placeholder={
                  <div className="flex space-x-1 items-center">
                    <MixerVerticalIcon />
                    <p>Updated</p>
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Updated Asc</SelectItem>
              <SelectItem value="desc">Updated Desc</SelectItem>
            </SelectContent>
          </Select> */}

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
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
        {data?.map((item) => {
          return (
            <div
              key={item.id}
              className="h-full flex flex-row items-center justify-between rounded-lg border p-2"
            >
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="link"
                        onClick={(e) => {
                          e.preventDefault();
                          mutate(
                            { ...item, isCompleted: !item.isCompleted },
                            {
                              onSuccess: () => {
                                toast({
                                  title: 'Success',
                                  description: 'Task updated successfully',
                                });

                                queryClient.invalidateQueries(['tasks']);
                              },
                            },
                          );
                        }}
                        aria-label="Mark as complete"
                      >
                        {item.isCompleted ? (
                          <CheckCircledIcon className="h-6 w-6" />
                        ) : (
                          <CircleIcon className="h-6 w-6" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {item.isCompleted
                          ? 'Mark as incomplete'
                          : 'Mark as complete'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div>
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
                    {item.isCompleted ? (
                      <CheckCircledIcon className="text-green-500" />
                    ) : (
                      <CrossCircledIcon className="text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <TaskEditButton defaultValues={item} />
                <TaskDeleteButton id={item.id} />
              </div>
            </div>
          );
        })}
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
