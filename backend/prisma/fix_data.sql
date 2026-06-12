-- Null out orphaned po_no values before FK enforcement
UPDATE "Asset" SET "po_no" = NULL WHERE "po_no" IS NOT NULL;

-- Add FK if not already present (idempotent approach via DO block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Asset_po_no_fkey'
  ) THEN
    ALTER TABLE "Asset" ADD CONSTRAINT "Asset_po_no_fkey"
      FOREIGN KEY ("po_no") REFERENCES "PurchaseOrder"("po_no")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;
