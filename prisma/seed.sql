-- Insert default roles if they don't exist
INSERT INTO public.role (id, name, description)
VALUES 
  (gen_random_uuid(), 'student', 'Student role')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.role (id, name, description)
VALUES 
  (gen_random_uuid(), 'coach', 'Coach role')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.role (id, name, description)
VALUES 
  (gen_random_uuid(), 'staff', 'Staff role')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.role (id, name, description)
VALUES 
  (gen_random_uuid(), 'admin', 'Administrator role')
ON CONFLICT (name) DO NOTHING; 