import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// En serverless (Vercel), réutiliser l'instance globale pour éviter
// d'épuiser le connection pool Neon
const prisma = global.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?connection_limit=3&pool_timeout=10",
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
} else {
  global.prisma = prisma;
}

export default prisma;
