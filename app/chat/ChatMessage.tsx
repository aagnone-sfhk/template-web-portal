import type { Message } from "./types";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { clientEnv } from "app/config/client-env";
import { User2 } from "lucide-react";

export default function ChatMessage({
  type,
  message,
  aiStatus,
  isTyping,
  subtype,
  handleResponse,
}: Message & { handleResponse: (response: boolean) => void }) {
  console.log("handleResponse:", handleResponse);
  console.log("Subtype:", subtype);
  if (type === "ai") {
    return (
      <>
        <div className="flex gap-3 pl-2 pr-4">
          <Image
            className="object-cover flex-shrink-0 w-12 h-12"
            width={48}
            height={48}
            src={clientEnv.NEXT_PUBLIC_AVATAR}
            alt={clientEnv.NEXT_PUBLIC_LOGO_ALT}
          />
          {isTyping && message.length === 0 ? (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                <div className="animate-spin h-3 w-3 bg-indigo-300 rounded-sm"></div>
              </div>
              <div>
                {aiStatus && aiStatus.length > 0 && (
                  <p className="text-sm font-normal text-slate-500">
                    {aiStatus}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div
              className={
                  "flex flex-col my-auto bg-[#231F20] text-white rounded-2xl shadow-sm max-w-[75%]"
              }
            >
              <div className="text-sm font-light prose prose-sm prose-invert max-w-none px-3.5 py-2">
                <ReactMarkdown>{message}</ReactMarkdown>
                {isTyping && <span className="animate-pulse">_</span>}
              </div>
              {subtype === "productBackfilled" && handleResponse && (
                <div className="flex gap-3 px-3.5 pb-3 m-2">
                  <button
                    onClick={() => handleResponse(true)}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleResponse(false)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  } else if (type === "user") {
    return (
      <>
        <div className="flex flex-row-reverse gap-3 pl-4 pr-2">
          <User2 size={48} className="bg-white rounded-full" />
          <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 max-w-[75%]">
            <div className="text-sm font-light prose prose-sm max-w-none text-gray-800 px-3.5 py-2 flex items-center min-h-[40px]">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          </div>
        </div>
      </>
    );
  }
  return <></>;
}
