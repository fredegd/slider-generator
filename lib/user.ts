"use server"

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function createUser(data: {
  name: string
  email: string
  password: string
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    })

    // Return user without password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}
