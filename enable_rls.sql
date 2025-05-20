-- Enable Row Level Security
ALTER TABLE public.profile_role ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own role and coaches to read their students' roles
CREATE POLICY "Users can read their own role and coaches can read their students' roles"
ON public.profile_role
FOR SELECT
USING (
  auth.uid() = profile_id -- User can read their own role
  OR 
  EXISTS ( -- Coach can read their students' roles
    SELECT 1 FROM public.coach_profile cp
    WHERE cp.coach_id = auth.uid()
    AND cp.profile_id = profile_role.profile_id
  )
);

-- Create policy to allow authenticated users to read role information
CREATE POLICY "Allow reading role information"
ON public.role
FOR SELECT
TO authenticated
USING (true);

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.profile_role TO authenticated;
GRANT SELECT ON public.role TO authenticated;
GRANT SELECT ON public.coach_profile TO authenticated; 