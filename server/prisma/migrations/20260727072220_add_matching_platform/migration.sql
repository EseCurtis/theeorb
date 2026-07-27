-- CreateTable
CREATE TABLE "DatingProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "genderIdentity" TEXT NOT NULL,
    "sexualOrientation" TEXT NOT NULL,
    "intents" TEXT NOT NULL,
    "interestedIn" TEXT NOT NULL,
    "minimumAge" INTEGER NOT NULL,
    "maximumAge" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "maximumDistanceKm" INTEGER NOT NULL,
    "bio" TEXT NOT NULL,
    "prompts" TEXT NOT NULL,
    "lifestyle" TEXT NOT NULL DEFAULT '{}',
    "isDiscoverable" BOOLEAN NOT NULL DEFAULT true,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DatingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfilePhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "datingProfileId" TEXT NOT NULL,
    "cloudinaryId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfilePhoto_datingProfileId_fkey" FOREIGN KEY ("datingProfileId") REFERENCES "DatingProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrbMatchSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "orbAId" TEXT NOT NULL,
    "orbBId" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "userADecision" TEXT,
    "userBDecision" TEXT,
    "turnCount" INTEGER NOT NULL,
    "compatibilityScore" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "highlights" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "evaluatedAt" DATETIME NOT NULL,
    "matchedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrbMatchSession_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrbMatchSession_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrbMatchSession_orbAId_fkey" FOREIGN KEY ("orbAId") REFERENCES "Orb" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrbMatchSession_orbBId_fkey" FOREIGN KEY ("orbBId") REFERENCES "Orb" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrbMatchActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrbMatchActivity_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OrbMatchSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConnectionMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unmatchedAt" DATETIME,
    CONSTRAINT "ConnectionMatch_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OrbMatchSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConnectionMatch_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConnectionMatch_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatConversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatConversation_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "ConnectionMatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" DATETIME,
    CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserBlock_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserBlock_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SafetyReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "matchId" TEXT,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SafetyReport_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DatingProfile_userId_key" ON "DatingProfile"("userId");

-- CreateIndex
CREATE INDEX "DatingProfile_isDiscoverable_completedAt_idx" ON "DatingProfile"("isDiscoverable", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePhoto_cloudinaryId_key" ON "ProfilePhoto"("cloudinaryId");

-- CreateIndex
CREATE INDEX "ProfilePhoto_datingProfileId_position_idx" ON "ProfilePhoto"("datingProfileId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePhoto_datingProfileId_position_key" ON "ProfilePhoto"("datingProfileId", "position");

-- CreateIndex
CREATE INDEX "OrbMatchSession_userAId_status_expiresAt_idx" ON "OrbMatchSession"("userAId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "OrbMatchSession_userBId_status_expiresAt_idx" ON "OrbMatchSession"("userBId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "OrbMatchActivity_sessionId_createdAt_idx" ON "OrbMatchActivity"("sessionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionMatch_sessionId_key" ON "ConnectionMatch"("sessionId");

-- CreateIndex
CREATE INDEX "ConnectionMatch_userAId_unmatchedAt_idx" ON "ConnectionMatch"("userAId", "unmatchedAt");

-- CreateIndex
CREATE INDEX "ConnectionMatch_userBId_unmatchedAt_idx" ON "ConnectionMatch"("userBId", "unmatchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChatConversation_matchId_key" ON "ChatConversation"("matchId");

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_createdAt_idx" ON "ChatMessage"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "UserBlock_targetId_idx" ON "UserBlock"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBlock_creatorId_targetId_key" ON "UserBlock"("creatorId", "targetId");

-- CreateIndex
CREATE INDEX "SafetyReport_targetId_createdAt_idx" ON "SafetyReport"("targetId", "createdAt");

-- CreateIndex
CREATE INDEX "SafetyReport_creatorId_createdAt_idx" ON "SafetyReport"("creatorId", "createdAt");
