import { notFound, redirect } from "next/navigation";
import { CancelPlan } from "@/components/CancelPlan";
import { formatDate, formatMoney } from "@/lib/billing";
import { AppError } from "@/lib/errors";
import { getPlan, type PlanView } from "@/lib/service";

export default async function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let plan: PlanView;
  try {
    plan = await getPlan(id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    if (error instanceof AppError && error.status === 402) redirect(`/result/${id}`);
    throw error;
  }
  return (
    <main>
      <h1>Account</h1>
      <section className="panel">
        <span className="label">Your plan</span>
        <CancelPlan
          attemptId={id}
          ended={plan.status === "ended"}
          initiallyCancelled={plan.cancelled}
          accessUntil={formatDate(plan.accessUntil)}
          nextCharge={plan.nextCharge ? `${formatMoney(plan.nextCharge.amountCents)} on ${formatDate(plan.nextCharge.at)}` : null}
        />
      </section>
      <a className="btn btn-secondary" href={`/report/${id}`}>Back to my report</a>
    </main>
  );
}
