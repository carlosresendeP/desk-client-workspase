-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('backlog', 'em_andamento', 'pausado', 'concluido', 'entregue');

-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('baixa', 'media', 'alta');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'backlog',
    "priority" "ProjectPriority" NOT NULL DEFAULT 'media',
    "startDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "totalValue" DOUBLE PRECISION,
    "receivedValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "links" JSONB NOT NULL DEFAULT '[]',
    "notes" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
