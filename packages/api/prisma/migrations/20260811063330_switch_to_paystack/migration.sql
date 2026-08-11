/*
  Warnings:

  - You are about to drop the column `stripeInvoiceId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubId` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "stripeInvoiceId",
ADD COLUMN     "paystackInvoiceId" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubId",
ADD COLUMN     "paystackCustomerCode" TEXT,
ADD COLUMN     "paystackSubCode" TEXT;
