CREATE TABLE `employees` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`is_admin` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leave_policies` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`is_unlimited` integer NOT NULL,
	`allowed_days_per_year` integer
);
--> statement-breakpoint
CREATE TABLE `leave_requests` (
	`id` integer PRIMARY KEY NOT NULL,
	`employee_id` integer NOT NULL,
	`leave_policy_id` integer NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leave_policy_id`) REFERENCES `leave_policies`(`id`) ON UPDATE no action ON DELETE no action
);
