import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { useTaskDeleteMutation } from '@/hooks/api/task.hook';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '../ui/use-toast';
import { TrashIcon } from '@radix-ui/react-icons';

export function TaskDeleteButton({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { mutate } = useTaskDeleteMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="space-x-2" aria-label="Delete">
          <TrashIcon className="w-5 h-5" />
          <p className="hidden sm:block">Delete</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={(e) => {
              e.preventDefault();
              mutate(id, {
                onSuccess: () => {
                  toast({
                    title: 'Success',
                    description: 'Task deleted successfully',
                  });
                  queryClient.invalidateQueries(['tasks']);
                },
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
