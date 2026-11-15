import { errorResponse } from "@/lib/errors";
import { cancelPlan } from "@/lib/service";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const plan = await cancelPlan(id);
    return Response.json({ cancelled: plan.cancelled, accessUntil: plan.accessUntil.toISOString() });
  } catch (error) {
    return errorResponse(error);
  }
}
