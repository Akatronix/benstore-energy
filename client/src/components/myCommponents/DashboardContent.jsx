import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BarChart3, Settings, Zap, PieChart, Home } from "lucide-react";
import useUserStore from "@/store/UserStore";

const DashboardContent = () => {
  const { userData } = useUserStore();

  // Function to format numbers properly (remove trailing zeros)
  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
      return "0";
    }

    // Convert to string and handle trailing zeros
    const str = num.toString();

    // If it's a decimal number, remove trailing zeros
    if (str.includes(".")) {
      return parseFloat(str).toString();
    }

    return str;
  };

  // Calculate device usage data using useMemo for performance
  const deviceUsageData = useMemo(() => {
    // Check if userData is null or undefined
    if (!userData) {
      return {
        devices: [],
        totalPower: 0,
        topDevice: null,
        deviceTypeDistribution: [],
        locationDistribution: [],
      };
    }

    // Filter devices that are ON
    const activeDevices = userData.filter((d) => d.switchStatus === true);

    // When no devices are ON → return empty list
    if (activeDevices.length === 0) {
      return {
        devices: [],
        totalPower: 0,
        topDevice: null,
        deviceTypeDistribution: [],
        locationDistribution: [],
      };
    }

    // Find maximum power only among ON devices (max is 100)
    const maxPower = Math.max(...activeDevices.map((d) => d.power), 0);

    // Prevent divide-by-zero
    const safeMax = maxPower === 0 ? 1 : maxPower;

    // Build usage list
    const devices = activeDevices.map((device) => ({
      id: device._id,
      name: device.name,
      power: device.power, // Keep in watts (0-100 range)
      usageLevel: Math.round((device.power / safeMax) * 100), // 0-100%
      type: device.type,
      location: device.location,
    }));

    // Calculate total power consumption (in watts)
    const totalPower = activeDevices.reduce(
      (sum, device) => sum + device.power,
      0
    );

    // Get top consumption device
    const topDevice = [...devices].sort(
      (a, b) => b.usageLevel - a.usageLevel
    )[0];

    // Calculate power distribution by device type
    const typePowerMap = {};
    activeDevices.forEach((device) => {
      if (!typePowerMap[device.type]) {
        typePowerMap[device.type] = 0;
      }
      typePowerMap[device.type] += device.power;
    });

    // Convert to array and calculate percentages
    const deviceTypeDistribution = Object.entries(typePowerMap)
      .map(([type, power]) => ({
        type,
        power,
        percentage: totalPower > 0 ? Math.round((power / totalPower) * 100) : 0,
      }))
      .sort((a, b) => b.power - a.power);

    // Calculate power distribution by location
    const locationPowerMap = {};
    activeDevices.forEach((device) => {
      if (!locationPowerMap[device.location]) {
        locationPowerMap[device.location] = 0;
      }
      locationPowerMap[device.location] += device.power;
    });

    // Convert to array and calculate percentages
    const locationDistribution = Object.entries(locationPowerMap)
      .map(([location, power]) => ({
        location,
        power,
        percentage: totalPower > 0 ? Math.round((power / totalPower) * 100) : 0,
      }))
      .sort((a, b) => b.power - a.power);

    return {
      devices,
      totalPower,
      topDevice,
      deviceTypeDistribution,
      locationDistribution,
    };
  }, [userData]);

  // Calculate device counts
  const deviceCounts = useMemo(() => {
    // Check if userData is null or undefined
    if (!userData) {
      return {
        totalDevices: 0,
        activeDevices: 0,
        highUsageDevices: 0,
      };
    }

    const totalDevices = userData.length;
    const activeDevices = userData.filter(
      (d) => d.switchStatus === true
    ).length;
    const highUsageDevices = deviceUsageData.devices.filter(
      (d) => d.usageLevel > 75
    ).length;

    return {
      totalDevices,
      activeDevices,
      highUsageDevices,
    };
  }, [userData, deviceUsageData.devices]);

  // Get device type icon
  const getDeviceTypeIcon = (type) => {
    switch (type) {
      case "ac":
        return "❄️";
      case "heater":
        return "🔥";
      case "lighting":
        return "💡";
      case "geyser":
        return "💧";
      case "refrigerator":
        return "❄️";
      case "entertainment":
        return "📺";
      default:
        return "🔌";
    }
  };

  // Get device type name
  const getDeviceTypeName = (type) => {
    switch (type) {
      case "ac":
        return "Air Conditioner";
      case "heater":
        return "Heater";
      case "lighting":
        return "Lighting";
      case "geyser":
        return "Water Heater";
      case "refrigerator":
        return "Refrigerator";
      case "entertainment":
        return "Entertainment";
      default:
        return "Other";
    }
  };

  // Get color for pie chart segments - updated to orange theme
  const getSegmentColor = (index) => {
    const colors = [
      "#F97316", // orange-500
      "#FB923C", // orange-400
      "#FDBA74", // orange-300
      "#EA580C", // orange-600
      "#C2410C", // orange-700
      "#9A3412", // orange-800
      "#7C2D12", // orange-900
    ];
    return colors[index % colors.length];
  };

  // Show loading state if userData is null
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading device data...</p>
      </div>
    );
  }

  // Safely get top device type percentage
  const topDeviceTypePercentage =
    deviceUsageData.deviceTypeDistribution.length > 0
      ? deviceUsageData.deviceTypeDistribution[0].percentage
      : 0;

  // Safely get top location percentage
  const topLocationPercentage =
    deviceUsageData.locationDistribution.length > 0
      ? deviceUsageData.locationDistribution[0].percentage
      : 0;

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's your energy overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Usage
              </CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(deviceUsageData.totalPower)} KW
              </div>
              <p className="text-xs text-muted-foreground">
                {deviceCounts.activeDevices} of {deviceCounts.totalDevices}{" "}
                devices active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Device Type
              </CardTitle>
              <PieChart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(topDeviceTypePercentage)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {deviceUsageData.deviceTypeDistribution.length > 0
                  ? getDeviceTypeName(
                      deviceUsageData.deviceTypeDistribution[0].type
                    )
                  : "No data"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Location
              </CardTitle>
              <Home className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(topLocationPercentage)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {deviceUsageData.locationDistribution.length > 0
                  ? deviceUsageData.locationDistribution[0].location
                  : "No data"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Devices
              </CardTitle>
              <Settings className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deviceCounts.totalDevices}
              </div>
              <p className="text-xs text-muted-foreground">
                {deviceCounts.highUsageDevices} devices on high usage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-orange-600" />
                Energy Distribution by Device Type
              </CardTitle>
              <CardDescription>
                Current energy consumption by device type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deviceUsageData.deviceTypeDistribution.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {deviceUsageData.deviceTypeDistribution.map(
                        (item, index) => {
                          const startAngle =
                            deviceUsageData.deviceTypeDistribution
                              .slice(0, index)
                              .reduce(
                                (sum, d) => sum + (d.percentage / 100) * 360,
                                0
                              );
                          const endAngle =
                            startAngle + (item.percentage / 100) * 360;

                          const startX =
                            50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                          const startY =
                            50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                          const endX =
                            50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                          const endY =
                            50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                          const largeArcFlag =
                            endAngle - startAngle > 180 ? 1 : 0;

                          return (
                            <path
                              key={index}
                              d={`M 50,50 L ${startX},${startY} A 40,40 0 ${largeArcFlag},1 ${endX},${endY} Z`}
                              fill={getSegmentColor(index)}
                              stroke="white"
                              strokeWidth="1"
                            />
                          );
                        }
                      )}
                    </svg>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {deviceUsageData.deviceTypeDistribution.map(
                      (item, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: getSegmentColor(index) }}
                          ></div>
                          <div className="text-sm">
                            <span className="font-medium">
                              {getDeviceTypeName(item.type)}:
                            </span>{" "}
                            {formatNumber(item.percentage)}% (
                            {formatNumber(item.power)}KW)
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">No active devices to display</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
                Device Usage
              </CardTitle>
              <CardDescription>
                {deviceUsageData.topDevice
                  ? `Top consumer: ${
                      deviceUsageData.topDevice.name
                    } (${formatNumber(deviceUsageData.topDevice.power)}KW)`
                  : "No active devices"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceUsageData.devices.length > 0 ? (
                  deviceUsageData.devices.map((device) => (
                    <div
                      key={device.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-3 w-3 rounded-full mr-3 ${
                            device.usageLevel > 75
                              ? "bg-red-500"
                              : device.usageLevel > 50
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                        ></div>
                        <span className="text-sm font-medium">
                          {device.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              device.usageLevel > 75
                                ? "bg-red-500"
                                : device.usageLevel > 50
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: device.usageLevel + "%" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatNumber(device.power)} KW
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No active devices
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
