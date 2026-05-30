-- CreateTable
CREATE TABLE "Calculation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skinType" TEXT NOT NULL,
    "outdoorTime" TEXT NOT NULL,
    "protectionItems" TEXT NOT NULL,
    "protectionScore" REAL NOT NULL,
    "safeOutdoorMinutes" REAL NOT NULL,
    "remainingSeconds" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
