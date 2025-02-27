/*
  # Create encrypted_messages table

  1. New Tables
    - `encrypted_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `encrypted_text` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `encrypted_messages` table
    - Add policies for authenticated users to read/write their own data
*/

CREATE TABLE IF NOT EXISTS encrypted_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  encrypted_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE encrypted_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages"
  ON encrypted_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON encrypted_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON encrypted_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);