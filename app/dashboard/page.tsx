"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DashboardData = {
  stats: {
    totalProjects: number
    totalEntries: number
    totalResources: number
  }
  activity: {
    entries: { createdAt: string }[]
    resources: { createdAt: string }[]
  }
}

async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard")
  return res.json()
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  })

  const monthlyActivity = useMemo(() => {
    if (!data) return []

    const dayCountMap = new Map<string, number>()
    const allActions = [...data.activity.entries, ...data.activity.resources]

    allActions.forEach((action) => {
      const date = new Date(action.createdAt)
      const dayKey = date.toISOString().split("T")[0]
      dayCountMap.set(dayKey, (dayCountMap.get(dayKey) ?? 0) + 1)
    })

    const months = new Map<string, { monthLabel: string; days: { day: number; count: number; date: string }[] }>()

    dayCountMap.forEach((count, dayKey) => {
      const date = new Date(dayKey)
      const monthKey = getMonthKey(date)

      if (!months.has(monthKey)) {
        months.set(monthKey, {
          monthLabel: date.toLocaleString("default", { month: "long", year: "numeric" }),
          days: [],
        })
      }

      months.get(monthKey)?.days.push({
        day: date.getDate(),
        count,
        date: dayKey,
      })
    })

    return Array.from(months.entries())
      .sort(([a], [b]) => (a > b ? -1 : 1))
      .map(([, value]) => ({
        ...value,
        days: value.days.sort((a, b) => a.day - b.day),
      }))
  }, [data])

  if (isLoading) return <p>Loading dashboard...</p>

  const getIntensityClass = (count: number) => {
    if (count >= 4) return "bg-emerald-600"
    if (count === 3) return "bg-emerald-500"
    if (count === 2) return "bg-emerald-400"
    if (count === 1) return "bg-emerald-200"
    return "bg-gray-100"
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.stats.totalProjects}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Logs</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.stats.totalEntries}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Resources</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.stats.totalResources}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Actions (Month-wise)</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {monthlyActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No activity yet.</p>
          ) : (
            monthlyActivity.map((month) => (
              <div key={month.monthLabel} className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">{month.monthLabel}</h3>
                <div className="grid grid-cols-7 gap-2 rounded-lg border p-3">
                  {month.days.map((day) => (
                    <div
                      key={day.date}
                      className={`flex h-10 flex-col items-center justify-center rounded text-[11px] font-medium text-gray-700 ${getIntensityClass(day.count)}`}
                      title={`${day.date}: ${day.count} action${day.count > 1 ? "s" : ""}`}
                    >
                      <span>{day.day}</span>
                      <span>{day.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}