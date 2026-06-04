import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Lazily-created service-role client for server route handlers.
// Created on first use (not at module load) so that `next build` can collect
// page data without the service-role secret being present in the environment.
let client: SupabaseClient | null = null

export function getServiceClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }
  return client
}
