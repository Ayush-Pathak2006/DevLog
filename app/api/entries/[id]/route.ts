import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.entry.delete({
      where: {
        id
      }
    })

    return NextResponse.json({
      message: "Entry deleted"
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    )
  }
}