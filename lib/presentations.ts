"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function savePresentation(data: {
  title: string
  template: string
  customStyles: any
  slides: any[]
  userId: string
}) {
  try {
    const presentation = await prisma.presentation.create({
      data: {
        title: data.title,
        template: data.template,
        customStyles: data.customStyles,
        slides: data.slides,
        userId: data.userId,
      },
    })

    return presentation
  } catch (error) {
    console.error("Error saving presentation:", error)
    throw new Error("Failed to save presentation")
  }
}

export async function getUserPresentations(userId: string) {
  try {
    const presentations = await prisma.presentation.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return presentations
  } catch (error) {
    console.error("Error fetching presentations:", error)
    throw new Error("Failed to fetch presentations")
  }
}

export async function getPresentation(id: string) {
  try {
    const presentation = await prisma.presentation.findUnique({
      where: {
        id,
      },
    })

    if (!presentation) {
      throw new Error("Presentation not found")
    }

    return presentation
  } catch (error) {
    console.error("Error fetching presentation:", error)
    throw new Error("Failed to fetch presentation")
  }
}

export async function updatePresentation(
  id: string,
  data: {
    title?: string
    template?: string
    customStyles?: any
    slides?: any[]
  },
) {
  try {
    const presentation = await prisma.presentation.update({
      where: {
        id,
      },
      data,
    })

    return presentation
  } catch (error) {
    console.error("Error updating presentation:", error)
    throw new Error("Failed to update presentation")
  }
}

export async function deletePresentation(id: string) {
  try {
    await prisma.presentation.delete({
      where: {
        id,
      },
    })

    return true
  } catch (error) {
    console.error("Error deleting presentation:", error)
    throw new Error("Failed to delete presentation")
  }
}
