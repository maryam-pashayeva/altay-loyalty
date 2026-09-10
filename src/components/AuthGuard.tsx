"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { Skeleton } from "@/components/ui/Skeleton";

/** Giriş etməmiş istifadəçini qarşılama (onboarding) ekranına yönləndirir. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { customer, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !customer) router.replace("/welcome");
  }, [loading, customer, router]);

  if (loading || !customer) {
    return (
      <div className="space-y-4 p-5">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
