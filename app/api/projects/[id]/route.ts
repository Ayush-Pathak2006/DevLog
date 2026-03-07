import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    await prisma.project.delete({
      where: {
        id
      }
    })

    return NextResponse.json({
      message: "Project deleted"
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
}