import { errorResponse } from "@/lib/errors";
import { completeLesson } from "@/lib/service";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    return Response.json(await completeLesson({ attemptId: id, lessonId: body?.lessonId }));
  } catch (error) {
    return errorResponse(error);
  }
}
