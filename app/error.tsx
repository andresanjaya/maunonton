"use client";

import { PageContainer } from "@/components/layout/page-container";
import { ErrorState } from "@/components/ui/error-state";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageContainer className="pt-[max(2rem,env(safe-area-inset-top))]"><ErrorState onRetry={reset}/></PageContainer>;
}
