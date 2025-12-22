-- CreateEnum
CREATE TYPE "RestaurantImageType" AS ENUM ('RESTAURANT', 'MENU', 'MENU_ITEM');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('FSSAI', 'PAN', 'GST', 'BANK', 'OTHERS');

-- CreateEnum
CREATE TYPE "DieteryTag" AS ENUM ('VEG', 'NON_VEG', 'EGG');

-- CreateTable
CREATE TABLE "RestaurantCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RestaurantCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "landmark" TEXT,
    "countryId" INTEGER NOT NULL,
    "stateId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    "pincode" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "description" TEXT,
    "voiceNoteDirection" TEXT,
    "rating" DECIMAL(3,2),
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "isPureVeg" BOOLEAN NOT NULL DEFAULT false,
    "avgPrepTime" INTEGER,
    "searchText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantImage" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "imageType" "RestaurantImageType" NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RestaurantImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkingDay" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,

    CONSTRAINT "WorkingDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantTiming" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "workingDayId" INTEGER NOT NULL,
    "openMinute" INTEGER NOT NULL,
    "closeMinute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RestaurantTiming_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantDoc" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "docType" "DocumentType" NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RestaurantDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FoodCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantMenu" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "servingSize" TEXT NOT NULL,
    "dieteryTag" "DieteryTag" NOT NULL,
    "description" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemMetrics" (
    "menuItemId" INTEGER NOT NULL,
    "orderCount" INTEGER NOT NULL DEFAULT 0,
    "lastOrderedAt" TIMESTAMP(3),

    CONSTRAINT "MenuItemMetrics_pkey" PRIMARY KEY ("menuItemId")
);

-- CreateTable
CREATE TABLE "RestaurantMetrics" (
    "restaurantId" INTEGER NOT NULL,
    "avgRating" DECIMAL(3,2),
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "avgPrepTime" INTEGER,
    "orderCount" INTEGER NOT NULL DEFAULT 0,
    "lastOrderAt" TIMESTAMP(3),

    CONSTRAINT "RestaurantMetrics_pkey" PRIMARY KEY ("restaurantId")
);

-- CreateTable
CREATE TABLE "RestaurantStatusHistory" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "reason" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantSearchLog" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER,
    "searchText" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "userId" INTEGER,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantSearchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantFeatureFlag" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,

    CONSTRAINT "RestaurantFeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantCategory_name_key" ON "RestaurantCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_code_key" ON "Restaurant"("code");

-- CreateIndex
CREATE INDEX "Restaurant_ownerId_idx" ON "Restaurant"("ownerId");

-- CreateIndex
CREATE INDEX "Restaurant_countryId_idx" ON "Restaurant"("countryId");

-- CreateIndex
CREATE INDEX "Restaurant_stateId_idx" ON "Restaurant"("stateId");

-- CreateIndex
CREATE INDEX "Restaurant_cityId_idx" ON "Restaurant"("cityId");

-- CreateIndex
CREATE INDEX "Restaurant_categoryId_idx" ON "Restaurant"("categoryId");

-- CreateIndex
CREATE INDEX "RestaurantImage_restaurantId_idx" ON "RestaurantImage"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantTiming_restaurantId_workingDayId_key" ON "RestaurantTiming"("restaurantId", "workingDayId");

-- CreateIndex
CREATE INDEX "RestaurantMenu_restaurantId_idx" ON "RestaurantMenu"("restaurantId");

-- CreateIndex
CREATE INDEX "RestaurantMenu_categoryId_idx" ON "RestaurantMenu"("categoryId");

-- CreateIndex
CREATE INDEX "RestaurantStatusHistory_restaurantId_idx" ON "RestaurantStatusHistory"("restaurantId");

-- CreateIndex
CREATE INDEX "RestaurantSearchLog_cityId_idx" ON "RestaurantSearchLog"("cityId");

-- CreateIndex
CREATE INDEX "RestaurantSearchLog_restaurantId_idx" ON "RestaurantSearchLog"("restaurantId");

-- CreateIndex
CREATE INDEX "RestaurantSearchLog_searchText_idx" ON "RestaurantSearchLog"("searchText");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantFeatureFlag_restaurantId_key_key" ON "RestaurantFeatureFlag"("restaurantId", "key");

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RestaurantCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantImage" ADD CONSTRAINT "RestaurantImage_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantTiming" ADD CONSTRAINT "RestaurantTiming_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantTiming" ADD CONSTRAINT "RestaurantTiming_workingDayId_fkey" FOREIGN KEY ("workingDayId") REFERENCES "WorkingDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantDoc" ADD CONSTRAINT "RestaurantDoc_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodCategory" ADD CONSTRAINT "FoodCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FoodCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantMenu" ADD CONSTRAINT "RestaurantMenu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantMenu" ADD CONSTRAINT "RestaurantMenu_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FoodCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemMetrics" ADD CONSTRAINT "MenuItemMetrics_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "RestaurantMenu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantMetrics" ADD CONSTRAINT "RestaurantMetrics_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantStatusHistory" ADD CONSTRAINT "RestaurantStatusHistory_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantSearchLog" ADD CONSTRAINT "RestaurantSearchLog_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantSearchLog" ADD CONSTRAINT "RestaurantSearchLog_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantFeatureFlag" ADD CONSTRAINT "RestaurantFeatureFlag_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
