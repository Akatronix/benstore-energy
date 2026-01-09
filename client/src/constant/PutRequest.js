import { toast } from "sonner";

async function PutRequest(
  data,
  errorText = "Failed to update data",
  successText = "Data updated successfully",
  url
) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      toast.error(errorText);
      throw new Error("Network response was not ok");
    }
    toast.success(successText);
    return await response.json();
  } catch (error) {
    console.error("Error making PUT request:", error);
    throw error;
  }
}
export default PutRequest;
