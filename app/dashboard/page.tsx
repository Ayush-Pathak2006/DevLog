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

type HeatmapDay = {
  date: Date
  key: string
  count: number
}

type MonthLabel = {
  label: string
  weekIndex: number
}

async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard")
  return res.json()
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getContributionClass(count: number) {
  if (count >= 4) return "bg-emerald-500 dark:bg-emerald-400"
  if (count === 3) return "bg-emerald-400 dark:bg-emerald-500"
  if (count === 2) return "bg-emerald-300 dark:bg-emerald-600"
  if (count === 1) return "bg-emerald-200 dark:bg-emerald-700"
  return "bg-gray-100 dark:bg-[#161b22]"
}

function getSpacedMonthLabels(labels: MonthLabel[], minWeekGap: number) {
  if (labels.length <= 2) return labels

  const compactLabels: MonthLabel[] = []

  labels.forEach((month, index) => {
    const isFirst = index === 0
    const isLast = index === labels.length - 1
    const previous = compactLabels[compactLabels.length - 1]
    const isFarEnough = !previous || month.weekIndex - previous.weekIndex >= minWeekGap

    if (isFirst || isLast || isFarEnough) {
      compactLabels.push(month)
    }
  })

  return compactLabels
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  })

  const { weeks, monthLabels, totalActions } = useMemo(() => {
    if (!data) return { weeks: [] as HeatmapDay[][], monthLabels: [] as MonthLabel[], totalActions: 0 }

    const dayCountMap = new Map<string, number>()
    const allActions = [...data.activity.entries, ...data.activity.resources]

    allActions.forEach((action) => {
      const date = new Date(action.createdAt)
      const key = toDateKey(date)
      dayCountMap.set(key, (dayCountMap.get(key) ?? 0) + 1)
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 364)
    const startDay = startDate.getDay()
    startDate.setDate(startDate.getDate() - startDay)

    const days: HeatmapDay[] = []
    const cursor = new Date(startDate)

    while (cursor <= today) {
      const key = toDateKey(cursor)
      days.push({
        date: new Date(cursor),
        key,
        count: dayCountMap.get(key) ?? 0,
      })
      cursor.setDate(cursor.getDate() + 1)
    }

    const weeksCollection: HeatmapDay[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weeksCollection.push(days.slice(i, i + 7))
    }

    const labels: MonthLabel[] = []
    let lastMonth = ""

    weeksCollection.forEach((week, weekIndex) => {
      const firstDay = week[0]
      if (!firstDay) return

      const monthLabel = firstDay.date.toLocaleString("default", { month: "short" })
      const monthKey = `${firstDay.date.getFullYear()}-${firstDay.date.getMonth()}`

      if (monthKey !== lastMonth) {
        labels.push({ label: monthLabel, weekIndex })
        lastMonth = monthKey
      }
    })

    return {
      weeks: weeksCollection,
      monthLabels: labels,
      totalActions: allActions.length,
    }
  }, [data])

  const mobileMonthLabels = useMemo(() => getSpacedMonthLabels(monthLabels, 8), [monthLabels])
    const heatmapWidth = `calc(${weeks.length} * var(--week-width))`

  if (isLoading) return <p>Loading dashboard...</p>

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>

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

      <Card className="w-full max-w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold leading-6 sm:text-base">
            {totalActions} contributions in the last year
          </CardTitle>
        </CardHeader>

        <CardContent className="px-3 pb-4 sm:px-6">
          {weeks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <div className="w-full max-w-full pb-1 [--cell-size:10px] [--cell-gap:3px] [--week-width:calc(var(--cell-size)+var(--cell-gap))] sm:[--cell-size:12px] sm:[--cell-gap:4px]">
              <div className="rounded-md border bg-card p-2 sm:p-3">
                <div className="-mx-1 overflow-x-auto px-1 [touch-action:pan-x]">
                  <div
                    className="space-y-3"
                    style={{ minWidth: `calc(${heatmapWidth} + 2.5rem)` }}
                  >
                    <div className="relative ml-6 h-4 text-[10px] text-muted-foreground sm:ml-8 sm:text-xs">
                      <div className="sm:hidden">
                        {mobileMonthLabels.map((month) => (
                          <span
                            key={`${month.label}-${month.weekIndex}`}
                            className="absolute"
                            style={{ left: `calc(${month.weekIndex} * var(--week-width))` }}
                          >
                            {month.label}
                          </span>
                        ))}
                      </div>
                      <div className="hidden sm:block">
                        {monthLabels.map((month) => (
                          <span
                            key={`${month.label}-${month.weekIndex}`}
                            className="absolute"
                            style={{ left: `calc(${month.weekIndex} * var(--week-width))` }}
                          >
                            {month.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-1.5 sm:gap-2">
                      <div className="grid grid-rows-7 gap-[var(--cell-gap)] pr-1 text-[10px] leading-none text-muted-foreground sm:text-[11px]">
                        <span className="h-[var(--cell-size)]" />
                        <span className="h-[var(--cell-size)]">Mon</span>
                        <span className="h-[var(--cell-size)]" />
                        <span className="h-[var(--cell-size)]">Wed</span>
                        <span className="h-[var(--cell-size)]" />
                        <span className="h-[var(--cell-size)]">Fri</span>
                        <span className="h-[var(--cell-size)]" />
                      </div>

                      <div className="flex gap-[var(--cell-gap)]" style={{ width: heatmapWidth }}>
                        {weeks.map((week) => (
                          <div key={week[0]?.key} className="grid grid-rows-7 gap-[var(--cell-gap)]">
                            {week.map((day) => (
                              <div
                                key={day.key}
                                className={`h-[var(--cell-size)] w-[var(--cell-size)] rounded-[2px] ${getContributionClass(day.count)}`}
                                title={`${day.key}: ${day.count} action${day.count === 1 ? "" : "s"}`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground sm:text-xs">
                      <span>Less</span>
                      <div className="flex items-center gap-[var(--cell-gap)]">
                        {[0, 1, 2, 3, 4].map((level) => (
                          <span
                            key={level}
                            className={`h-[var(--cell-size)] w-[var(--cell-size)] rounded-[2px] ${getContributionClass(level)}`}
                          />
                        ))}
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-[10px] text-muted-foreground sm:hidden">Swipe to see more months →</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}