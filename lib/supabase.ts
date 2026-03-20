import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// SSR 数据查询客户端：优先使用 service role key（绕过 RLS），回退到 anon key。
// lib/db/ 仅在 Server Components 中调用，service role key 不会泄露到客户端。
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseAnonKey);

// 导入脚本使用的管理员客户端（绕过 RLS）
export function createAdminClient() {
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
