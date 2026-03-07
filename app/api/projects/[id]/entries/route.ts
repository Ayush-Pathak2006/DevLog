import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const entries = await prisma.entry.findMany({
      where: {
        projectId: id
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(entries)

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    )
  }
}