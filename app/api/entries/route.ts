import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { title, content, projectId } = body

    const entry = await prisma.entry.create({
      data: {
        title,
        content,
        projectId
      }
    })

    return NextResponse.json(entry)

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    )
  }
}