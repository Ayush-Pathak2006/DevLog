import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json()
    const { title, url, category } = body
    const { id } = await context.params

    const resource = await prisma.resource.update({
      where: {
        id,
      },
      data: {
        title,
        url,
        category,
      },
    })

    return NextResponse.json(resource)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update resource" },
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

    await prisma.resource.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      message: "Resource deleted",
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    )
  }
}