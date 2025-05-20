-- Drop the unique constraint
ALTER TABLE "public"."lesson" DROP CONSTRAINT IF EXISTS "group_id_court_id_coach_id_uniquess";

-- Drop the foreign key constraints
ALTER TABLE "public"."lesson" DROP CONSTRAINT IF EXISTS "lesson_group_id_fkey";
ALTER TABLE "public"."lesson" DROP CONSTRAINT IF EXISTS "lesson_court_id_fkey";

-- Drop the default values for UUID columns
ALTER TABLE "public"."lesson" ALTER COLUMN "group_id" DROP DEFAULT;
ALTER TABLE "public"."lesson" ALTER COLUMN "coach_id" DROP DEFAULT;
ALTER TABLE "public"."lesson" ALTER COLUMN "court_id" DROP DEFAULT;
ALTER TABLE "public"."lesson" ALTER COLUMN "profile_id" DROP DEFAULT;

-- Recreate the foreign key constraints with proper ON DELETE actions
ALTER TABLE "public"."lesson" 
  ADD CONSTRAINT "lesson_group_id_fkey" 
  FOREIGN KEY ("group_id") 
  REFERENCES "public"."group"("id") 
  ON DELETE SET NULL;

ALTER TABLE "public"."lesson" 
  ADD CONSTRAINT "lesson_court_id_fkey" 
  FOREIGN KEY ("court_id") 
  REFERENCES "public"."court"("id") 
  ON DELETE SET NULL; 