import { useChatStore } from "@/store/chatStore"; // Adjust path if needed

export const useChat = () => {
  const { messages, isThinking, sendMessage, clearChat } = useChatStore();

  return {
    messages,
    isThinking,
    sendMessage,
    clearChat,
  };
};
