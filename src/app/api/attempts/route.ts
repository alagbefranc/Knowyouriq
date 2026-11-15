import { errorResponse } from "@/lib/errors";
import { startAttempt } from "@/lib/service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    return Response.json(startAttempt({ ageConfirmed: body?.ageConfirmed }), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
