import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Neon (plan gratuit) met le compute en veille après ~5 min sans requête.
 * La première requête le réveille : elle met de 1 à 3 s, parfois plus, et
 * Prisma la remonte comme une *erreur de connexion*, pas comme une lenteur.
 * Sans nouvelle tentative, cette erreur remonte jusqu'à l'ErrorBoundary et
 * le marchand voit une page d'erreur au lieu de son app.
 */
const WAKE_UP_CODES = ["P1001", "P1002", "P1008", "P1017"];
const WAKE_UP_MESSAGES = [
  "Can't reach database server",
  "Timed out fetching a new connection",
  "Server has closed the connection",
];

function buildUrl() {
  const base = process.env.DATABASE_URL || "";
  if (!base) return base;
  // La DATABASE_URL Neon porte déjà `?sslmode=require&channel_binding=require`
  // (et parfois les paramètres de pool) : concaténer un second `?` produirait
  // une URL invalide, d'où le choix du séparateur et les tests de présence.
  const sep = base.includes("?") ? "&" : "?";
  const extra = [
    base.includes("connection_limit=") ? null : "connection_limit=3",
    base.includes("pool_timeout=") ? null : "pool_timeout=15",
    base.includes("connect_timeout=") ? null : "connect_timeout=15",
  ].filter(Boolean);
  return extra.length ? `${base}${sep}${extra.join("&")}` : base;
}

// En serverless (Vercel), réutiliser l'instance globale pour éviter
// d'épuiser le connection pool
const prisma =
  global.prisma ??
  new PrismaClient({
    datasources: { db: { url: buildUrl() } },
  });

global.prisma = prisma;

export default prisma;

function isWakeUpError(error: unknown): boolean {
  const code = (error as { code?: string })?.code;
  if (code && WAKE_UP_CODES.includes(code)) return true;
  const message = (error as { message?: string })?.message || "";
  return WAKE_UP_MESSAGES.some((m) => message.includes(m));
}

/**
 * Rejoue une requête Prisma tant qu'elle échoue pour cause de base endormie.
 * Attentes cumulées : 1 s + 2 s + 3 s, soit 6 s au pire — largement sous la
 * limite de durée d'une fonction Vercel, et bien au-delà du réveil d'un
 * compute Neon. Toute autre erreur (contrainte unique, requête invalide…)
 * est relancée immédiatement, sans réessai.
 */
export async function withDbRetry<T>(query: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= 3; attempt++) {
    try {
      return await query();
    } catch (error) {
      if (!isWakeUpError(error)) throw error;
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}
