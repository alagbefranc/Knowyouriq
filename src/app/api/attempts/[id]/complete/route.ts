import { errorResponse } from "@/lib/errors";
import { completeAttempt } from "@/lib/service";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    return Response.json(completeAttempt(id));
  } catch (error) {
    return errorResponse(error);
  }
}
