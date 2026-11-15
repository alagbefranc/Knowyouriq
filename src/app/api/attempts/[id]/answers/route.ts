import { errorResponse } from "@/lib/errors";
import { submitAnswer } from "@/lib/service";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    return Response.json(await submitAnswer({ attemptId: id, questionId: body?.questionId, choice: body?.choice, ms: body?.ms }));
  } catch (error) {
    return errorResponse(error);
  }
}
