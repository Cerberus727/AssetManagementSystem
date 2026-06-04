-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_asset_id_fkey";

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("asset_id") ON DELETE CASCADE ON UPDATE CASCADE;
