"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

async function fetchDashboard() {
  const res = await fetch("/api/dashboard")
  return res.json()
}

export default function DashboardPage() {

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard
  })

  if (isLoading) return <p>Loading dashboard...</p>

  const chartData = data.activity.map((entry: any) => ({
    date: new Date(entry.createdAt).toLocaleDateString(),
    count: 1
  }))

  return (
    <div className="flex flex-col gap-6">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            {data.stats.totalProjects}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Logs</CardTitle>
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            {data.stats.totalEntries}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Resources</CardTitle>
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            {data.stats.totalResources}
          </CardContent>
        </Card>

      </div>

      {/* Activity Chart */}

      <Card>

        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>

        <CardContent className="h-72">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
              />

            </LineChart>
          </ResponsiveContainer>

        </CardContent>

      </Card>

    </div>
  )
}