import { toast } from "sonner";

async function PostRequest(
  url,
  data,
  errorText = "Failed to post data",
  successText = "Data posted successfully"
) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log(response);
      toast.error(errorText);
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    toast.success(successText);
    return responseData;
  } catch (error) {
    console.log(error.message);
    console.error("Error making POST request:", error);
    throw error;
  }
}
export default PostRequest;
