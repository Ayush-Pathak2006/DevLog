import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const resources = await prisma.resource.findMany({
      where: {
        projectId: id
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(resources)

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    )
  }
}