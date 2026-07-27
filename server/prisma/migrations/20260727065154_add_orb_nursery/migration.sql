-- CreateTable
CREATE TABLE "OrbLesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orbId" TEXT NOT NULL,
    "ownerMessage" TEXT NOT NULL,
    "orbReply" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrbLesson_orbId_fkey" FOREIGN KEY ("orbId") REFERENCES "Orb" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orb" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "values" TEXT NOT NULL,
    "speakingStyle" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "visualForm" TEXT NOT NULL,
    "behaviourRules" TEXT NOT NULL DEFAULT '',
    "releaseStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Orb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Orb" ("createdAt", "id", "interests", "name", "objective", "personality", "releaseStatus", "speakingStyle", "updatedAt", "userId", "values", "visualForm") SELECT "createdAt", "id", "interests", "name", "objective", "personality", "releaseStatus", "speakingStyle", "updatedAt", "userId", "values", "visualForm" FROM "Orb";
DROP TABLE "Orb";
ALTER TABLE "new_Orb" RENAME TO "Orb";
CREATE UNIQUE INDEX "Orb_userId_key" ON "Orb"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "OrbLesson_orbId_createdAt_idx" ON "OrbLesson"("orbId", "createdAt");
