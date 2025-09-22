-- Clean orphaned data before adding foreign key constraints
-- Delete likes that reference non-existent posts
DELETE FROM "strak_social"."likes" 
WHERE "post_id" NOT IN (SELECT "id" FROM "strak_social"."posts");

-- Delete comments that reference non-existent posts  
DELETE FROM "strak_social"."comments" 
WHERE "post_id" NOT IN (SELECT "id" FROM "strak_social"."posts");

-- Delete post_media that reference non-existent posts
DELETE FROM "strak_social"."post_media" 
WHERE "post_id" NOT IN (SELECT "id" FROM "strak_social"."posts");
