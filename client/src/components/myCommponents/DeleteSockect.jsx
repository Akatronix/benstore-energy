import React from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const DeleteSockect = ({ socket, setLoading, setError }) => {
  return (
    <Button
      onClick={async () => {
        // confirm before delete
        if (
          window.confirm(
            "Are you sure you want to delete this socket?, this action cannot be undone."
          )
        ) {
          try {
            setLoading(true);
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/sockets/${socket}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  token: localStorage.getItem("token"),
                },
              }
            );
            const data = await response.json();
            if (data.success) {
              toast.success("Socket deleted successfully");
              setLoading(false);
              setError(null);
            } else {
              setLoading(false);
              setError(data.message || "Failed to delete socket");
              toast.error(data.message || "Failed to delete socket");
            }
          } catch (error) {
            setLoading(false);
            setError("An error occurred while deleting the socket");
            toast.error("An error occurred while deleting the socket");
          }
        }
      }}
      size="sm"
    >
      <Trash2 />
    </Button>
  );
};

export default DeleteSockect;
