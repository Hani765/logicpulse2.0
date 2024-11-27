import { Skeleton } from "../ui/skeleton";

export default function OffersFormSkeleton() {
    return (
        <div className="px-4 h-full w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full h-full gap-2">
                <div className="space-y-4 w-full">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Skeleton className="col-span-2 h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-4 w-[30%] rounded-md" />
                    <Skeleton className="h-32 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex w-full flex-col gap-4">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Skeleton className="col-span-2 h-10 w-full rounded-md" />
                        <div className="flex gap-2 items-center">
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-24 rounded-sm" />
                        </div>
                    </div>
                    <Skeleton className="h-32 w-full rounded-md" />
                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="col-span-2 h-10 w-full rounded-md" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-[30%] rounded-md" />
                        <Skeleton className="h-4 w-4 rounded-sm" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="w-full flex justify-end gap-2">
                        <Skeleton className="h-10 w-32 rounded-md" />
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
