import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useSocketStore } from "@/store/socketStore";
import { toast } from "sonner";

const CreateSocket = () => {
  const [socketForm, setSocketForm] = useState({
    name: "",
    location: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { createSocket } = useSocketStore();

  const handleSocketFormChange = (e) => {
    const { name, value } = e.target;
    setSocketForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocketSubmit = async (e) => {
    e.preventDefault();
    if (!socketForm.name || !socketForm.location || !socketForm.type) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await createSocket(socketForm);

      if (!response.success) {
        toast.error(response.message || "Failed to create socket");
        throw new Error("Failed to create socket");
      }
      setSocketForm({ name: "", location: "", type: "" });
      toast.success("Socket created successfully");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err.message);
      toast.error("Error creating socket: " + err.message);
    }

    console.log("Creating new socket:", socketForm);
    // Reset form
    // Show success message or notification
  };

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Socket
          </h1>
          <p className="text-gray-600">Add a new smart socket to monitor</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Socket Details</CardTitle>
            <CardDescription>
              Enter the details for your new smart socket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSocketSubmit} className="space-y-4">
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
                  {loading ? "Creating..." : "Create Socket"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSocket;
