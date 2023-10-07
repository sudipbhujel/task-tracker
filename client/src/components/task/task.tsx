import { useTaskUpdateMutation } from '@/hooks/api/task.hook';
import { cn } from '@/lib/utils';
import { components } from '@/types';
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
} from '@radix-ui/react-icons';
import { Tooltip } from '@radix-ui/react-tooltip';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { FC } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { toast } from '../ui/use-toast';
import { TaskDeleteButton } from './task-delete-button';
import TaskEditButton from './task-edit-button';

type ITask = components['schemas']['TaskEntity'];

interface TaskProps {
  item: ITask;
}

const Task: FC<TaskProps> = ({ item }) => {
  const { mutate } = useTaskUpdateMutation();
  const queryClient = useQueryClient();

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
                {item.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
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
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <TaskEditButton defaultValues={item} />
        <TaskDeleteButton id={item.id} />
      </div>
    </div>
  );
};

export default Task;
