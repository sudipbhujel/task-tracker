import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTaskUpdateMutation } from '@/hooks/api/task.hook';
import { cn } from '@/lib/utils';
import { components } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Calendar } from '../ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from '../ui/use-toast';

interface TaskEditButtonProps {
  defaultValues: components['schemas']['TaskEntity'];
}

const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  deadline: z.date(),
  isCompleted: z.boolean().optional(),
});

export const TaskEditButton: FC<TaskEditButtonProps> = ({ defaultValues }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      deadline: defaultValues?.deadline
        ? new Date(defaultValues.deadline)
        : undefined,
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useTaskUpdateMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Task updated successfully',
        });

        queryClient.invalidateQueries(['tasks']);
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="space-x-2" aria-label="Edit Task">
          <Pencil1Icon className="w-5 h-5" />
          <p className="hidden sm:block">Edit</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Make changes to your task. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="w-full space-y-3 my-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Priority</FormLabel>
                    <FormMessage />
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid max-w-md grid-cols-3 gap-3 pt-2"
                    >
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="LOW" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent text-center py-3">
                            Low
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem
                              value="MEDIUM"
                              className="sr-only"
                            />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent text-center py-3">
                            Medium
                          </div>
                        </FormLabel>
                      </FormItem>

                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="HIGH" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent text-center py-3">
                            High
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditButton;
