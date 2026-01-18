
-- 🛡️ AUTO-ONBOARDING SYSTEM 🛡️
-- This ensures every new user (Email or Google) gets a profile automatically.

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- We ONLY create the profile here.
  -- Restaurant creation is handled by the OnboardingUI (for Google)
  -- or the Register form (for Email/Password).
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New Member'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'owner'),
    'pending'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    status = EXCLUDED.status; -- Keep status as pending if it's a social re-login

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();
