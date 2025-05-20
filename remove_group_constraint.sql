-- Rimuove il vincolo di chiave esterna lesson_group_id_fkey
ALTER TABLE "public"."lesson" DROP CONSTRAINT "lesson_group_id_fkey";

-- Opzionale: se vuoi anche rimuovere il valore di default per group_id
ALTER TABLE "public"."lesson" ALTER COLUMN "group_id" DROP DEFAULT; 