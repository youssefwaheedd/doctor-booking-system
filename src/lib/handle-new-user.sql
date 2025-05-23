
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if a profile already exists for this user_id to prevent errors
  -- if this trigger somehow runs twice or if a profile was manually inserted.
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name', -- Attempt to get full_name if provided during signup
      'patient' -- Default role for new users
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- Create trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
