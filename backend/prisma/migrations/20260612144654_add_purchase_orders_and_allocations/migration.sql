-- AlterTable: make po_no nullable first (backward compatible)
ALTER TABLE "Asset" ALTER COLUMN "po_no" DROP NOT NULL;

-- DATA FIX: Null out any existing po_no values that don't reference a real PurchaseOrder.
-- This prevents FK violation on existing demo/test data.
UPDATE "Asset" SET "po_no" = NULL WHERE "po_no" IS NOT NULL;

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "po_no" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capitalized_date" TIMESTAMP(3) NOT NULL,
    "ordered_qty" INTEGER NOT NULL,
    "unit_cost" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "sub_category" TEXT NOT NULL,
    "warranty_expiry" TIMESTAMP(3) NOT NULL,
    "vendor_id" TEXT NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("po_no")
);

-- CreateTable
CREATE TABLE "AssetAllocation" (
    "allocation_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "allocated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetAllocation_pkey" PRIMARY KEY ("allocation_id")
);

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("vendor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_po_no_fkey" FOREIGN KEY ("po_no") REFERENCES "PurchaseOrder"("po_no") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAllocation" ADD CONSTRAINT "AssetAllocation_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("asset_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAllocation" ADD CONSTRAINT "AssetAllocation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAllocation" ADD CONSTRAINT "AssetAllocation_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;
