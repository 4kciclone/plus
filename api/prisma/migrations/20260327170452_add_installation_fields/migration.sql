/*
  Warnings:

  - Added the required column `cep` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNumber` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_INSTALL',
    "cep" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "reference" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "installationDate" DATETIME,
    "installationTime" TEXT,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("id", "planId", "startDate", "status", "updatedAt", "userId") SELECT "id", "planId", "startDate", "status", "updatedAt", "userId" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
