-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "projectName" VARCHAR(500) NOT NULL,
    "studentName" VARCHAR(255) NOT NULL,
    "studentEmail" VARCHAR(255) NOT NULL,
    "researchTopic" TEXT NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(255) NOT NULL DEFAULT 'ahiya',
    "docxUrl" TEXT NOT NULL,
    "htmlUrl" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastAccessed" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" VARCHAR(45),

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSession" (
    "id" SERIAL NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectId_key" ON "Project"("projectId");

-- CreateIndex
CREATE INDEX "Project_projectId_idx" ON "Project"("projectId");

-- CreateIndex
CREATE INDEX "Project_studentEmail_idx" ON "Project"("studentEmail");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_token_key" ON "AdminSession"("token");

-- CreateIndex
CREATE INDEX "AdminSession_token_idx" ON "AdminSession"("token");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectSession_token_key" ON "ProjectSession"("token");

-- CreateIndex
CREATE INDEX "ProjectSession_token_idx" ON "ProjectSession"("token");

-- CreateIndex
CREATE INDEX "ProjectSession_projectId_idx" ON "ProjectSession"("projectId");
