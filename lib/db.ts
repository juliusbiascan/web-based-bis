import { PrismaClient } from './generated/prisma'
import { withAccelerate } from "@prisma/extension-accelerate"

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate())
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db