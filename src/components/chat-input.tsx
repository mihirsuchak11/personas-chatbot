import React from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { PauseCircleIcon, Send } from "lucide-react";
import { ChatStatus } from "ai";

type Props = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<Element>) => void;
  status: ChatStatus;
  stop: () => Promise<void>;
};

const ChatInput = ({
  handleSubmit,
  input,
  setInput,
  handleKeyDown,
  status,
  stop,
}: Props) => {
  return (
    <>
      <div className="text-center text-xs text-gray-500 mb-2">
        shift + ↵ to add a new line
      </div>
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Type your message..."
            className="max-h-[120px] min-h-[40px] resize-none overflow-y-auto bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-20 py-3 rounded-xl focus:border-gray-600 focus:ring-1 focus:ring-gray-600 font-jetbrains"
            maxLength={1000}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              type="submit"
              disabled={!input.trim()}
              size="icon"
              className="bg-purple-600 hover:bg-purple-700 text-white h-8 w-8 rounded-lg disabled:bg-gray-700 disabled:text-gray-500"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatInput;
