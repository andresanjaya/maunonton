import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { JournalCardSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <><AppHeader compact/><PageContainer className="space-y-5"><div className="skeleton h-8 w-44 rounded-lg"/><JournalCardSkeleton/><JournalCardSkeleton/></PageContainer></>;
}
