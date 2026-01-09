import { toast } from "sonner";

async function DeleteRequest(
  url,
  id,
  errorText = "Failed to delete item",
  successText = "Item deleted successfully"
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${url}/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        method: "DELETE",
      }
    );
    if (!response.ok) {
      toast.error(errorText);
      throw new Error(errorText);
    }
    toast.success(successText);
    return response.json();
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}

export default DeleteRequest;
