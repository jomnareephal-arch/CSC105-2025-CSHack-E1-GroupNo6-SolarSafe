-- CreateTable
CREATE TABLE "Day" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UVData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hour" INTEGER NOT NULL,
    "uvIndex" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    CONSTRAINT "UVData_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "recommendedStart" INTEGER,
    "recommendedEnd" INTEGER,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Activity_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UVData_dayId_hour_key" ON "UVData"("dayId", "hour");
