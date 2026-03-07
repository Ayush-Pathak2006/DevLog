import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {

    const totalProjects = await prisma.project.count()
    const totalEntries = await prisma.entry.count()
    const totalResources = await prisma.resource.count()

    const entries = await prisma.entry.findMany({
      select: {
        createdAt: true
      }
    })

    return NextResponse.json({
      stats: {
        totalProjects,
        totalEntries,
        totalResources
      },
      activity: entries
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}