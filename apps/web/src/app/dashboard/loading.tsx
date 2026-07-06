import React from "react";
import { Grid } from "@/components/layout/layout";
import { Skeleton } from "@/components/ui/feedback";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="flex flex-col gap-6">
        <Grid columns={12} className="gap-6">
          <div className="col-span-12 md:col-span-3">
            <Skeleton className="h-[120px] w-full" />
          </div>
          <div className="col-span-12 md:col-span-3">
            <Skeleton className="h-[120px] w-full" />
          </div>
          <div className="col-span-12 md:col-span-3">
            <Skeleton className="h-[120px] w-full" />
          </div>
          <div className="col-span-12 md:col-span-3">
            <Skeleton className="h-[120px] w-full" />
          </div>
        </Grid>

        <Grid columns={12} className="gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Skeleton className="h-[500px] w-full" />
          </div>
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </Grid>
      </div>
    </div>
  );
}
