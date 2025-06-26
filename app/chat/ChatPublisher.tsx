"use client";
import { useState } from "react";

type Props = {
  onPostMessage: (message: string) => void;
};

export default function ChatPublisher({ onPostMessage }: Props) {
  const [message, setMessage] = useState("");

  const submitted = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message && message.length > 0) {
      onPostMessage(message);
      setMessage("");
    }
  };
  const changed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={submitted} className="w-full">
      <input
        type="text"
        value={message}
        autoFocus={true}
        onChange={changed}
        placeholder="Message..."
        className="shadow-lg appearance-none border text-sm font-light rounded-full w-full py-4 px-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </form>
  );
}
