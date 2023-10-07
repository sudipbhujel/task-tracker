import { Skeleton } from '../ui/skeleton';

const TaskListSkeleton = () => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
      {[1, 2, 3, 4]?.map((item) => {
        return (
          <div
            key={item}
            className="h-full flex flex-row items-center justify-between rounded-lg border p-2"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" />

              <div>
                <Skeleton className="h-4 w-32" />
                <div className="flex space-x-2 items-center">
                  <Skeleton className="h-4 w-40 my-1" />
                  <Skeleton className="h-4 w-8 my-1" />
                  <Skeleton className="h-4 w-4 my-1" />
                </div>
                <Skeleton className="h-4 w-32 my-1" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Skeleton className="w-8 h-8 sm:w-24 sm:h-8" />
              <Skeleton className="w-8 h-8 sm:w-24 sm:h-8" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskListSkeleton;
