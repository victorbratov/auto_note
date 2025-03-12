CREATE TABLE `collections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `records` ADD `collection_id` integer NOT NULL REFERENCES collections(id);