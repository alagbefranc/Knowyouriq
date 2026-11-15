import { errorResponse } from "@/lib/errors";
import { checkout } from "@/lib/service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { renewsOn } = await checkout({ attemptId: String(body?.attemptId ?? ""), consent: body?.consent });
    return Response.json({ renewsOn: renewsOn.toISOString() }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
