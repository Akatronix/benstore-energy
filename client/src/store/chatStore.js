// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// export const useChatStore = create(
//   persist(
//     (set, get) => ({
//       // State
//       messages: [],
//       isThinking: false,

//       // Actions
//       sendMessage: async (prompt, user, devices) => {
//         // Add user message to the state immediately
//         const userMessage = { from: "user", text: prompt };
//         set((state) => ({
//           messages: [...state.messages, userMessage],
//           isThinking: true,
//         }));

//         try {
//           // Call your Flask API
//           const response = await fetch(
//             "https://wattbot-ai.onrender.com/analyze",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 user_info: user,
//                 user_device_data: devices,
//                 user_prompt: prompt,
//               }),
//             }
//           );

//           if (!response.ok) {
//             throw new Error(`API Error: ${response.statusText}`);
//           }

//           const data = await response.json();
//           const aiMessage = { from: "ai", text: data.answer };

//           // Add AI response to the state
//           set((state) => ({
//             messages: [...state.messages, aiMessage],
//             isThinking: false,
//           }));
//         } catch (error) {
//           console.error("Failed to send message:", error);
//           const errorMessage = {
//             from: "ai",
//             text: "Sorry, I had trouble connecting. Please try again.",
//           };
//           set((state) => ({
//             messages: [...state.messages, errorMessage],
//             isThinking: false,
//           }));
//         }
//       },

//       // Optional: A function to clear the chat history
//       clearChat: () => set({ messages: [] }),
//     }),
//     {
//       name: "wattbot-chat-storage", // name of the item in localStorage
//       storage: createJSONStorage(() => localStorage), // use localStorage
//     }
//   )
// );






// // src/store/chatStore.js
// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// // IMPORTANT: Replace with your actual Render API URL
// const API_URL = "https://wattbot-ai.onrender.com/analyze";

// export const useChatStore = create(
//   persist(
//     (set, get) => ({
//       // State
//       messages: [],
//       isThinking: false,

//       // Actions
//       sendMessage: async (prompt, user, devices) => {
//         // Add user message to the state immediately
//         const userMessage = { from: "user", text: prompt };
//         set((state) => ({
//           messages: [...state.messages, userMessage],
//           isThinking: true,
//         }));

//         try {
//           // Call your Flask API
//           const response = await fetch(API_URL, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               user_info: user,
//               user_device_data: devices,
//               user_prompt: prompt,
//             }),
//           });

//           // --- Check for the specific rate-limit error ---
//           if (!response.ok) {
//             if (response.status === 503) {
//               // Try to parse the custom error JSON from our backend
//               let errorData;
//               try {
//                 errorData = await response.json();
//               } catch (e) {
//                 // If parsing fails, fall back to a generic error
//                 throw new Error(`API Error: ${response.statusText}`);
//               }
              
//               // Create a specific error object with more details
//               const rateLimitError = new Error(errorData.error || "Service temporarily unavailable.");
//               rateLimitError.isRateLimit = true;
//               rateLimitError.retryAfter = errorData.retry_after || 60; // Default to 60s
//               throw rateLimitError;
//             } else {
//               // For other non-503 errors
//               throw new Error(`API Error: ${response.statusText}`);
//             }
//           }

//           const data = await response.json();
//           const aiMessage = { from: "ai", text: data.answer };

//           // Add AI response to the state
//           set((state) => ({
//             messages: [...state.messages, aiMessage],
//             isThinking: false,
//           }));
//         } catch (error) {
//           console.error("Failed to send message:", error);
          
//           let errorMessageText = "Sorry, I had trouble connecting. Please try again.";

//           // --- Check if it's our special rate-limit error ---
//           if (error.isRateLimit) {
//             errorMessageText = `WattBot AI is currently at its usage limit. Please wait a moment and try again.`;
//             // You could even show the retry time if you want:
//             // errorMessageText = `WattBot AI is at its limit. Please try again in ${error.retryAfter} seconds.`;
//           }
          
//           const errorMessage = {
//             from: "ai",
//             text: errorMessageText,
//           };
//           set((state) => ({
//             messages: [...state.messages, errorMessage],
//             isThinking: false,
//           }));
//         }
//       },

//       clearChat: () => set({ messages: [] }),
//     }),
//     {
//       name: "wattbot-chat-storage",
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );// src/store/chatStore.js



import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// IMPORTANT: Replace with your actual Render API URL
const API_URL = "https://wattbot-ai.onrender.com/analyze";

export const useChatStore = create(
  persist(
    (set, get) => ({
      // State
      messages: [],
      isThinking: false,

      // Actions
      sendMessage: async (prompt, user, devices) => {
        // Add user message to the state immediately
        const userMessage = { from: "user", text: prompt };
        set((state) => ({
          messages: [...state.messages, userMessage],
          isThinking: true,
        }));

        try {
          // Call your Flask API
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_info: user,
              user_device_data: devices,
              user_prompt: prompt,
            }),
          });

          // --- Check for the specific rate-limit error ---
          if (!response.ok) {
            if (response.status === 503) {
              // Try to parse the custom error JSON from our backend
              let errorData;
              try {
                errorData = await response.json();
              } catch (e) {
                // If parsing fails, fall back to a generic error
                throw new Error(`API Error: ${response.statusText}`);
              }
              
              // Create a specific error object with more details
              const rateLimitError = new Error(errorData.error || "Service temporarily unavailable.");
              rateLimitError.isRateLimit = true;
              rateLimitError.retryAfter = errorData.retry_after || 60; // Default to 60s
              throw rateLimitError;
            } else {
              // For other non-503 errors
              throw new Error(`API Error: ${response.statusText}`);
            }
          }

          const data = await response.json();
          const aiMessage = { from: "ai", text: data.answer };

          // Add AI response to the state
          set((state) => ({
            messages: [...state.messages, aiMessage],
            isThinking: false,
          }));
        } catch (error) {
          console.error("Failed to send message:", error);
          
          let errorMessageText = "Sorry, I had trouble connecting. Please try again.";

          // --- Check if it's our special rate-limit error ---
          if (error.isRateLimit) {
            errorMessageText = `WattBot AI is currently at its usage limit. Please wait a moment and try again.`;
            // You could even show the retry time if you want:
            // errorMessageText = `WattBot AI is at its limit. Please try again in ${error.retryAfter} seconds.`;
          }
          
          const errorMessage = {
            from: "ai",
            text: errorMessageText,
          };
          set((state) => ({
            messages: [...state.messages, errorMessage],
            isThinking: false,
          }));
        }
      },

      clearChat: () => set({ messages: [] }),
    }),
    {
      name: "wattbot-chat-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
