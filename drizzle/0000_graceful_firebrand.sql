CREATE TABLE `records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`audio_uri` text,
	`text_uri` text,
	`markdown_uri` text
);
