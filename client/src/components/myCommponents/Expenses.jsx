import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useUserStore from "@/store/UserStore";
import { toast } from "sonner";
import {
  Zap,
  DollarSign,
  Thermometer,
  Snowflake,
  Lightbulb,
  Droplets,
  Wifi,
  Settings,
} from "lucide-react";

// --- Default Configuration ---
// This is the fallback value if no rate is saved in localStorage.
const DEFAULT_PRICE_PER_KWH = 50; // Example: ₦50 per kWh (more reasonable for Nigeria)

const Expenses = () => {
  const { userData } = useUserStore();

  // State for the configurable price per kWh
  const [pricePerKwh, setPricePerKwh] = useState(DEFAULT_PRICE_PER_KWH);
  const [tempRate, setTempRate] = useState(String(DEFAULT_PRICE_PER_KWH)); // Use a separate state for the input to allow "canceling"
  const [isEditingRate, setIsEditingRate] = useState(false);

  // --- localStorage Effects ---
  // Load the saved rate from localStorage when the component mounts
  useEffect(() => {
    const savedRate = localStorage.getItem("energyRate");
    if (savedRate) {
      const rate = parseFloat(savedRate);
      if (!isNaN(rate)) {
        setPricePerKwh(rate);
        setTempRate(String(rate));
      }
    }
  }, []);

  // --- Helper Functions ---
  const getDeviceIcon = (type) => {
    switch (type) {
      case "ac":
        return Snowflake;
      case "heater":
        return Thermometer;
      case "lighting":
        return Lightbulb;
      case "geyser":
        return Droplets;
      default:
        return Wifi;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatEnergy = (energy) => {
    const numEnergy = Number(energy) || 0;
    return `${numEnergy.toFixed(2)} kWh`;
  };

  const handleSaveRate = () => {
    const newRate = parseFloat(tempRate);
    if (isNaN(newRate) || newRate < 0) {
      toast.error("Please enter a valid positive number for the rate.");
      return;
    }
    setPricePerKwh(newRate);
    localStorage.setItem("energyRate", String(newRate));
    setIsEditingRate(false);
    toast.success(`Energy rate updated to ₦${newRate.toFixed(2)}/kWh`);
  };

  // --- Calculations ---
  if (!userData || userData.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Energy Expenses</h1>
          <p className="text-gray-600">
            Monitor and track the cost of your device usage.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No device data available to calculate expenses.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalEnergyKwh = userData.reduce(
    (sum, device) => sum + (Number(device.energy) || 0),
    0
  );
  const totalCost = totalEnergyKwh * pricePerKwh;
  const locations = [...new Set(userData.map((device) => device.location))];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Energy Expenses</h1>
        <p className="text-gray-600">
          Monitor and track the cost of your device usage.
        </p>
      </div>

      {/* Rate Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Rate Settings
          </CardTitle>
          <CardDescription>
            Set your electricity rate to calculate costs accurately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isEditingRate ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Current Rate: </span>
                <span className="font-semibold text-lg">
                  ₦{pricePerKwh.toFixed(2)}/kWh
                </span>
              </div>
              <button
                onClick={() => {
                  setTempRate(String(pricePerKwh));
                  setIsEditingRate(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Change Rate
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <label
                htmlFor="rate-input"
                className="text-sm font-medium text-gray-700"
              >
                New Rate (₦/kWh):
              </label>
              <input
                id="rate-input"
                type="number"
                step="0.01"
                min="0"
                value={tempRate}
                onChange={(e) => setTempRate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., 50.00"
              />
              <button
                onClick={handleSaveRate}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingRate(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Summary</CardTitle>
          <CardDescription>
            Total cost and energy consumption across all devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Cost
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalCost)}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Energy Consumed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatEnergy(totalEnergyKwh)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room-wise Expense Breakdown */}
      <div className="space-y-6">
        {locations.map((room) => {
          const roomDevices = userData.filter(
            (device) => device.location === room
          );

          const devicesWithCost = roomDevices
            .map((device) => ({
              ...device,
              cost: (Number(device.energy) || 0) * pricePerKwh,
            }))
            .sort((a, b) => b.cost - a.cost);

          return (
            <Card key={room}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">{room}</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({devicesWithCost.length} devices)
                  </span>
                </CardTitle>
                <CardDescription>
                  Expenses for devices in {room}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {devicesWithCost.map((device) => {
                    const IconComponent = getDeviceIcon(device.type);
                    return (
                      <div
                        key={device._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-orange-100">
                            <IconComponent className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {device.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatEnergy(device.energy)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(device.cost)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {device.switchStatus ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Expenses;
