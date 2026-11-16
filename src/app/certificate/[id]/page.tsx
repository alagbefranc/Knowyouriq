import { notFound, redirect } from "next/navigation";
import { Certificate } from "@/components/Certificate";
import { PrintButton } from "@/components/PrintButton";
import { formatDate } from "@/lib/billing";
import { certificateId, certificateName } from "@/lib/certificate";
import { AppError } from "@/lib/errors";
import { getReport } from "@/lib/service";

export default async function CertificatePage(props: { params: Promise<{ id: string }>; searchParams: Promise<{ name?: string }> }) {
  const { id } = await props.params;
  const name = certificateName((await props.searchParams).name);
  let report: Awaited<ReturnType<typeof getReport>>;
  try {
    report = await getReport(id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    if (error instanceof AppError && error.code === "attempt_incomplete") redirect(`/test/${id}`);
    if (error instanceof AppError && error.status === 402) redirect(`/result/${id}`);
    throw error;
  }
  if (!name) redirect(`/report/${id}`);
  return (
    <main>
      <h1>Your certificate</h1>
      <Certificate name={name} estimate={report.result.estimate} date={formatDate(new Date())} id={certificateId(id)} />
      <PrintButton />
      <a className="btn btn-secondary" href={`/report/${id}`}>Back to my report</a>
    </main>
  );
}
