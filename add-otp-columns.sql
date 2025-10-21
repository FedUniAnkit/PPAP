-- Add OTP columns to Users table for forgot password functionality
ALTER TABLE "Users" 
ADD COLUMN IF NOT EXISTS "otpCode" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "otpExpires" TIMESTAMP WITH TIME ZONE;

-- Add index for better performance on OTP lookups
CREATE INDEX IF NOT EXISTS idx_users_otp_code ON "Users"("otpCode");
CREATE INDEX IF NOT EXISTS idx_users_otp_expires ON "Users"("otpExpires");

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Users' 
AND column_name IN ('otpCode', 'otpExpires');
