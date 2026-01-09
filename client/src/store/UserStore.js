import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      userData: null,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      clearUserData: () => set({ userData: null }),

      fetchUserData: async () => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/sockets/getData`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token"),
              },
            }
          );

          const data = await response.json();
          if (!data.success) {
            toast.error(data.message || "Failed to fetch user data");
            throw new Error("Failed to fetch user data");
          }

          set({ userData: data.data, loading: false });
        } catch (error) {
          toast.error(error.message || "An error occurred");
          set({ loading: false, error: error.message });
        }
      },
      updateUser: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/update`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token"),
              },
              body: JSON.stringify(userData),
            }
          );

          const data = await response.json();
          if (!data.success) {
            toast.error(data.message || "Failed to update user");
            throw new Error("Failed to update user");
          }

          toast.success(data.message || "User updated successfully");
          set({ user: data.data, loading: false });
          return data;
        } catch (error) {
          toast.error(error.message || "An error occurred");
          set({ loading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
        userData: state.userData,
      }),
    }
  )
);

export default useUserStore;
