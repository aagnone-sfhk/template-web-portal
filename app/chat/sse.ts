"use client";

type Props = {
  userMessage: string;
  sequenceId: number;
  onSSEProgressIndicator: (message: string) => void;
  onSSETextChunk: (message: string, offset: number) => void;
  onSSEInform: (message: string) => void;
  onSSEEndOfTurn: () => void;
};

export const sendStreamingMessage = async ({
  userMessage,
  sequenceId,
  onSSEProgressIndicator,
  onSSETextChunk,
  onSSEInform,
  onSSEEndOfTurn,
}: Props) => {
  const res = await fetch("/api/message", {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      message: userMessage,
      sequenceId,
    }),
  });
  const reader = res.body?.getReader();
  if (reader) {
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      const lines = decoder.decode(value).split(/\n/);
      const jsonData = JSON.parse(lines[2].replace(/^data:\s*/, ""));
      console.log(jsonData);
      const { type, message } = jsonData.message;
      if (type === "ProgressIndicator") {
        onSSEProgressIndicator(message);
      } else if (type === "TextChunk") {
        const offset = jsonData.offset;
        onSSETextChunk(message, offset);
      } else if (type === "Inform") {
        onSSEInform(message);
      } else if (type === "EndOfTurn") {
        onSSEEndOfTurn();
      }
    }
  }
};
