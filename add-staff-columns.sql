-- Add new columns to Users table for staff registration functionality
-- Run this SQL script in your PostgreSQL database

ALTER TABLE "Users" 
ADD COLUMN "isTemporaryPassword" BOOLEAN DEFAULT false,
ADD COLUMN "accountStatus" VARCHAR(50) DEFAULT 'active' 
CHECK ("accountStatus" IN ('active', 'pending_staff_registration', 'inactive'));
