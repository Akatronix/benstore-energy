import DeleteRequest from "@/constant/DeleteRequest";
import GetRequest from "@/constant/GetRequest";
import PostRequest from "@/constant/PostRequest";
import PutRequest from "@/constant/PutRequest";
import { create } from "zustand";

export const useSocketStore = create((set) => ({
  // State
  sockets: [],
  loading: false,
  error: null,

  // Actions
  setSockets: (sockets) => set({ sockets }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Create socket
  createSocket: async (socketData) => {
    set({ loading: true, error: null });

    const response = await PostRequest(
      "/api/sockets/create",
      socketData,
      "Failed to create socket",
      "Socket created successfully"
    );

    // Update state with new socket
    set((state) => ({
      sockets: [...state.sockets, response],
      loading: false,
    }));

    return response;
  },

  // Update socket
  updateDeviceStatus: async (socketData) => {
    set({ loading: true, error: null });

    const response = await PutRequest(
      { switchStatus: socketData.status },
      "Failed to update socket",
      "Socket updated successfully",
      `/api/sockets/${socketData.id}`
    );

    // Update state with updated socket
    set((state) => ({
      sockets: state.sockets.map((socket) =>
        socket.id === id ? response : socket
      ),
      loading: false,
    }));

    return response;
  },

  // Delete socket
  deleteSocket: async (id) => {
    set({ loading: true, error: null });

    await DeleteRequest(
      (url = `/sockets/${id}`),
      (errorText = "Failed to delete socket"),
      (successText = "Socket deleted successfully")
    );

    // Remove socket from state
    set((state) => ({
      sockets: state.sockets.filter((socket) => socket.id !== id),
      loading: false,
    }));
  },

  // Fetch all sockets
  fetchSockets: async () => {
    set({ loading: true, error: null });

    const response = await GetRequest(
      (url = "/sockets"),
      (errorText = "Failed to fetch sockets"),
      (successText = "Sockets fetched successfully")
    );

    // Update state with fetched sockets
    set({ sockets: response, loading: false });
    return response;
  },

  // Get socket by ID
  getSocketById: async (id) => {
    set({ loading: true, error: null });

    const response = await GetRequest(
      (url = `/sockets/${id}`),
      (errorText = "Failed to fetch socket"),
      (successText = "Socket fetched successfully")
    );

    set({ loading: false });
    return response;
  },
}));
