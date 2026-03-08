import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json()
    const { title, content } = body
    const { id } = await context.params

    const entry = await prisma.entry.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.entry.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      message: "Entry deleted",
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    )
  }
}