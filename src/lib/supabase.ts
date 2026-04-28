import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ScammerProfile {
  id: string;
  slug: string;
  display_name: string;
  aliases: string[];
  twitter_handle: string | null;
  telegram_handle: string | null;
  discord_handle: string | null;
  wallet_addresses: string[];
  categories: string[];
  status: string;
  summary: string;
  amount_lost_usd: number | null;
  incident_date: string | null;
  verified: boolean;
  reports_count: number;
  created_at: string;
  updated_at: string;
  profile_type: 'person' | 'project';
  website: string | null;
  chain: string | null;
  featured_until: string | null;
  featured_tier: string | null;
  tx_hashes: string[] | null;
  evidence_urls: string[] | null;
}

export async function getProfiles({
  page = 1,
  pageSize = 20,
  search = '',
  category = '',
  sortBy = 'reports_count',
  profileType = '',
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  profileType?: string;
} = {}) {
  let query = supabase
    .from('scammer_profiles')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .order(sortBy === 'amount' ? 'amount_lost_usd' : 'reports_count', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    query = query.or(
      `display_name.ilike.%${search}%,summary.ilike.%${search}%,twitter_handle.ilike.%${search}%`
    );
  }

  if (category) {
    query = query.contains('categories', [category]);
  }

  if (profileType && profileType !== 'hack') {
    query = query.eq('profile_type', profileType);
  }

  return query;
}

export async function getTopProfiles(limit = 9) {
  return supabase
    .from('scammer_profiles')
    .select('*')
    .eq('status', 'approved')
    .order('reports_count', { ascending: false })
    .limit(limit);
}

export async function getProfileBySlug(slug: string) {
  return supabase
    .from('scammer_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single();
}

// Get currently featured profiles (featured_until > now)
export async function getFeaturedProfiles(limit = 3) {
  const now = new Date().toISOString();
  return supabase
    .from('scammer_profiles')
    .select('*')
    .eq('status', 'approved')
    .gt('featured_until', now)
    .order('featured_until', { ascending: false })
    .limit(limit);
}

// Get profile by ID (UUID) or slug
export async function getProfileBySlugOrId(slugOrId: string) {
  // Try slug first
  const bySlug = await supabase
    .from('scammer_profiles')
    .select('*')
    .eq('slug', slugOrId)
    .eq('status', 'approved')
    .maybeSingle();
  if (bySlug.data) return bySlug;
  // Fallback to id
  return supabase
    .from('scammer_profiles')
    .select('*')
    .eq('id', slugOrId)
    .eq('status', 'approved')
    .maybeSingle();
}

export async function getTotalStats() {
  const { count } = await supabase
    .from('scammer_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  const { data } = await supabase
    .from('scammer_profiles')
    .select('amount_lost_usd')
    .eq('status', 'approved');

  const totalLost = data?.reduce((sum, p) => sum + (p.amount_lost_usd ?? 0), 0) ?? 0;

  return { count: count ?? 0, totalLost };
}
