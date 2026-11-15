import { notFound, redirect } from "next/navigation";
import { TestRunner } from "@/components/TestRunner";
import { AppError } from "@/lib/errors";
import { viewAttempt, type AttemptView } from "@/lib/service";

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let view: AttemptView;
  try {
    view = viewAttempt(id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    throw error;
  }
  if (view.completed) redirect(`/result/${id}`);
  return (
    <main>
      <TestRunner attemptId={view.id} questions={view.questions} answeredIds={view.answeredIds} />
    </main>
  );
}
