-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'CASHIER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CASHIER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "nin" TEXT,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cashier" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "nin" TEXT,
    "storeid" INTEGER,

    CONSTRAINT "Cashier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "managerId" INTEGER,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_userId_key" ON "Manager"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Cashier_userId_key" ON "Cashier"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Store_name_key" ON "Store"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Store_managerId_key" ON "Store"("managerId");

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_storeid_fkey" FOREIGN KEY ("storeid") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
