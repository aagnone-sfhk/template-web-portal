import { NextRequest, NextResponse } from "next/server";
import { sendStreamingMessage } from "app/chat/agentforce";

export async function POST(req: NextRequest) {
  const { message, sequenceId } = await req.json();
  const contentStream = await sendStreamingMessage(message, sequenceId);
  const headers = new Headers({
    "Content-Type": "text/event-stream",
  });
  return new NextResponse(contentStream, {
    status: 200,
    headers,
  });
}
