import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Power,
  Thermometer,
  Snowflake,
  Lightbulb,
  Droplets,
  Wifi,
} from "lucide-react";
import useUserStore from "@/store/UserStore";
import { useSocketStore } from "@/store/socketStore";
import DeleteSockect from "./DeleteSockect";

const ControlDevices = () => {
  const { userData } = useUserStore();
  const { updateDeviceStatus } = useSocketStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleDeviceStatus = (deviceId, switchStatus) => {
    updateDeviceStatus({ id: deviceId, status: !switchStatus });
  };

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

  // Format power value (0-100) to display string
  const formatPower = (power) => {
    return `${power} KW`;
  };

  // Get unique locations
  const locations = [...new Set(userData.map((device) => device.location))];

  return (
    <div className="space-y-6">
      <div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control Devices</h1>
          <p className="text-gray-600">
            Turn your smart devices on or off remotely
          </p>
        </div>
        <div>
          {/* show loading and error */}

          {loading && <p className="text-orange-600">Loading...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
          {/* check if not userData */}
        </div>
      </div>

      {/* Room-wise Device Groups */}
      <div className="space-y-6">
        {locations.map((room) => {
          const roomDevices = userData.filter(
            (device) => device.location === room
          );

          return (
            <Card key={room}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">{room}</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({roomDevices.filter((d) => d.switchStatus).length} of{" "}
                    {roomDevices.length} active)
                  </span>
                </CardTitle>
                <CardDescription>Devices in {room}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roomDevices.map((device) => {
                    const IconComponent = getDeviceIcon(device.type);
                    return (
                      <div
                        key={device._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div
                              className={`p-2 rounded-lg mr-3 ${
                                device.switchStatus
                                  ? "bg-orange-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <IconComponent
                                className={`h-5 w-5 ${
                                  device.switchStatus
                                    ? "text-orange-600"
                                    : "text-gray-500"
                                }`}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{device.name}</h3>
                              <p className="text-sm text-gray-500">
                                {formatPower(device.power)}
                              </p>
                              <p className="text-sm text-gray-500">
                                ID: {device._id}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              toggleDeviceStatus(
                                device._id,
                                device.switchStatus
                              )
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              device.switchStatus
                                ? "bg-orange-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                device.switchStatus
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center justify-start gap-2 flex-nowrap">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                device.switchStatus
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {device.switchStatus ? "ON" : "OFF"}
                            </span>
                            <DeleteSockect
                              socket={device._id}
                              setLoading={setLoading}
                              setError={setError}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {device.switchStatus ? "Active" : "Inactive"}
                          </span>
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

      {/* All Devices Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Devices</CardTitle>
          <CardDescription>
            Control all your smart devices from one place
            {!userData.length && (
              <p className="text-gray-500 mt-4 w-full text-center">
                No devices found.
              </p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.map((device) => {
              const IconComponent = getDeviceIcon(device.type);
              return (
                <div
                  key={device._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          device.switchStatus ? "bg-orange-100" : "bg-gray-100"
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            device.switchStatus
                              ? "text-orange-600"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{device.name}</h3>
                        <p className="text-sm text-gray-500 flex gap-0.5 items-start justify-start">
                          Location: {device.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {device._id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        toggleDeviceStatus(device._id, device.switchStatus);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        device.switchStatus ? "bg-orange-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          device.switchStatus
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="w-full flex items-start justify-start gap-4  mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Volatge: {device.voltage} V
                      </p>
                      <p className="text-sm text-gray-500">
                        Current: {device.current} A
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Power: {formatPower(device.power)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Energy: {device.energy} kWh
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center justify-start gap-2 flex-nowrap">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          device.switchStatus
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {device.switchStatus ? "ON" : "OFF"}
                      </span>
                      <DeleteSockect
                        socket={device._id}
                        setLoading={setLoading}
                        setError={setError}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Control multiple devices at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20"
              onClick={() => {
                userData.forEach((device) => {
                  if (!device.switchStatus) {
                    updateDeviceStatus({
                      id: device._id,
                      status: !device.switchStatus,
                    });
                  }
                });
              }}
            >
              <Power className="h-6 w-6 mb-1" />
              <span>Turn All On</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20"
              onClick={() => {
                userData.forEach((device) => {
                  if (device.switchStatus) {
                    updateDeviceStatus({
                      id: device._id,
                      status: !device.switchStatus,
                    });
                  }
                });
              }}
            >
              <Power className="h-6 w-6 mb-1" />
              <span>Turn All Off</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20"
              onClick={() => {
                userData.forEach((device, index) => {
                  if (device.type === "lighting" && !device.switchStatus) {
                    updateDeviceStatus({
                      id: device._id,
                      status: !device.switchStatus,
                    });
                  }
                });
              }}
            >
              <Lightbulb className="h-6 w-6 mb-1" />
              <span>Lights On</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20"
              onClick={() => {
                userData.forEach((device) => {
                  if (device.type === "lighting" && device.switchStatus) {
                    updateDeviceStatus({
                      id: device._id,
                      status: !device.switchStatus,
                    });
                  }
                });
              }}
            >
              <Lightbulb className="h-6 w-6 mb-1" />
              <span>Lights Off</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlDevices;
