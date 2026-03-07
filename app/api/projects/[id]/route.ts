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

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()

    const { status } = body

    const project = await prisma.project.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(project)

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
  }
}