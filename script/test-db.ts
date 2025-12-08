import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const now = await prisma.$queryRaw`SELECT NOW()`;
  console.log(now);
}

main();
