import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerClient = async () => {
  const cookieStore = cookies();
  return createRouteHandlerClient({ cookies: () => cookieStore });
};

export const createServerComponentSupabase = async () => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
}; 