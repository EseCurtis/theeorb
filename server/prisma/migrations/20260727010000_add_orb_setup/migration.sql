-- CreateTable
CREATE TABLE "Orb" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "values" TEXT NOT NULL,
    "speakingStyle" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "visualForm" TEXT NOT NULL,
    "releaseStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Orb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Orb_userId_key" ON "Orb"("userId");
