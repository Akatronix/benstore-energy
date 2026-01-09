async function GetRequest(
  errorText = "Failed to fetch data",
  successText = "Data fetched successfully",
  url
) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });
    if (!response.ok) {
      toast.error(errorText);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    toast.success(successText);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export default GetRequest;
