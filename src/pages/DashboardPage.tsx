"use client";

import * as React from "react";
import { 
  Users, 
  UserPlus, 
  ClipboardList, 
  Calendar,
  TrendingUp,
  Activity
} from "lucide-react";

export function DashboardPage() {
  const stats = [
    {
      label: "Total Patients Today",
      value: "48",
      change: "+12%",
      icon: Users,
      trend: "up",
    },
    {
      label: "New Registrations",
      value: "12",
      change: "+5",
      icon: UserPlus,
      trend: "up",
    },
    {
      label: "Appointments",
      value: "35",
      change: "+8",
      icon: Calendar,
      trend: "up",
    },
    {
      label: "Pending Records",
      value: "7",
      change: "-3",
      icon: ClipboardList,
      trend: "down",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="font-semibold" 
            style={{ 
              fontSize: "var(--text-h4)", 
              fontWeight: "var(--font-weight-semibold)" 
            }}
          >
            Dashboard
          </h1>
          <p 
            className="text-muted-foreground mt-1" 
            style={{ fontSize: "var(--text-sm)" }}
          >
            Welcome back! Here's your overview for today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="border rounded-md p-6 bg-background shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span 
                    className="text-muted-foreground" 
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {stat.label}
                  </span>
                  <span 
                    className="font-semibold" 
                    style={{ 
                      fontSize: "var(--text-h3)", 
                      fontWeight: "var(--font-weight-semibold)" 
                    }}
                  >
                    {stat.value}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp 
                      className={`size-3 ${
                        stat.trend === "up" 
                          ? "text-cyan-700" 
                          : "text-orange-700"
                      }`} 
                    />
                    <span 
                      className={`font-mono ${
                        stat.trend === "up" 
                          ? "text-cyan-700" 
                          : "text-orange-700"
                      }`}
                      style={{ fontSize: "var(--text-xs)" }}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center size-12 rounded-md bg-primary/10">
                  <Icon className="size-6 text-primary" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="border rounded-md p-6 bg-background shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="size-5 text-primary" strokeWidth={1.5} />
          <h2 
            className="font-semibold" 
            style={{ 
              fontSize: "var(--text-base)", 
              fontWeight: "var(--font-weight-semibold)" 
            }}
          >
            Recent Activity
          </h2>
        </div>
        <div className="space-y-4">
          {[
            { time: "10:30 AM", action: "New patient registered", patient: "John Smith" },
            { time: "10:15 AM", action: "Appointment scheduled", patient: "Sarah Johnson" },
            { time: "09:45 AM", action: "Patient checked in", patient: "Michael Chen" },
            { time: "09:30 AM", action: "Record updated", patient: "Emily Rodriguez" },
          ].map((activity, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: "var(--text-base)" }}>
                  {activity.action}
                </span>
                <span 
                  className="text-muted-foreground" 
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {activity.patient}
                </span>
              </div>
              <span 
                className="text-muted-foreground font-mono" 
                style={{ fontSize: "var(--text-sm)" }}
              >
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
