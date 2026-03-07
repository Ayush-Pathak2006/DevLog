import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { title, url, category, projectId } = body

    const resource = await prisma.resource.create({
      data: {
        title,
        url,
        category,
        projectId
      }
    })

    return NextResponse.json(resource)

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    )
  }
}