CREATE TABLE "strak_social"."comments_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comment_id" uuid NOT NULL,
	"media_url" text NOT NULL,
	"media_type" varchar(20) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "strak_social"."comments_media" ADD CONSTRAINT "comments_media_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "strak_social"."comments"("id") ON DELETE cascade ON UPDATE no action;