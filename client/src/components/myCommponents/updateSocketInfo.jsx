import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";

// --- Local API Request Helper ---
// This function makes the PUT request directly to your backend.
const updateSocketData = async (id, dataToUpdate) => {
  // IMPORTANT: Replace with your actual API endpoint URL
  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/sockets/updateData`;

  console.log({ id, ...dataToUpdate });

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
    body: JSON.stringify({ id, ...dataToUpdate }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update socket");
  }

  return response.json(); // Return the JSON response from the server
};

// --- The React Component ---
const UpdateSocketInfo = ({ initialData }) => {
  // The form state includes an 'id' field that the user will fill in.
  const [socketForm, setSocketForm] = useState({
    id: "",
    name: "",
    location: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  // This effect runs when the component mounts or when `initialData` changes.
  // It populates the form with the existing data, but NOT the ID.
  useEffect(() => {
    if (initialData) {
      setSocketForm((prev) => ({
        ...prev,
        name: initialData.name || "",
        location: initialData.location || "",
        type: initialData.type || "",
      }));
    }
  }, [initialData]);

  const handleSocketFormChange = (e) => {
    const { name, value } = e.target;
    setSocketForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocketSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields, including the ID
    if (
      !socketForm.id ||
      !socketForm.name ||
      !socketForm.location ||
      !socketForm.type
    ) {
      toast.error("Please fill in all fields, including the Socket ID.");
      return;
    }

    setLoading(true);
    try {
      // Destructure the ID from the rest of the form data
      const { id, ...dataToUpdate } = socketForm;

      // Call the local API request function
      const response = await updateSocketData(id, dataToUpdate);

      if (!response.success) {
        toast.error(response.message || "Failed to update socket");
        throw new Error("Failed to update socket");
      }

      toast.success("Socket updated successfully!");
      setLoading(false);
      // You might want to add a callback here to notify the parent component
      // e.g., onSuccessfulUpdate();
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Error updating socket: " + err.message);
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Update Socket</h1>
          <p className="text-gray-600">
            Enter the Socket ID and modify the details for your smart socket.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Socket Details</CardTitle>
            <CardDescription>
              Provide the ID of the socket you want to update.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSocketSubmit} className="space-y-4">
              {/* --- Editable ID Input --- */}
              <div>
                <label
                  htmlFor="id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Socket ID
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={socketForm.id}
                  onChange={handleSocketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter the ID of the socket to update"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Socket Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={socketForm.name}
                  onChange={handleSocketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Living Room Socket"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={socketForm.location}
                  onChange={handleSocketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Living Room"
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Device Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={socketForm.type}
                  onChange={handleSocketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a device type</option>
                  <option value="ac">Air Conditioner</option>
                  <option value="heater">Heater</option>
                  <option value="refrigerator">Refrigerator</option>
                  <option value="washing">Washing Machine</option>
                  <option value="lighting">Lighting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? "Updating..." : "Update Socket"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateSocketInfo;
