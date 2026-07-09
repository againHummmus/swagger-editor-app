'use server'

import { createClient } from "@/utils/supabase/server";

export type SendRequestResult = {
  status: string;
  statusText: string;
  ok: boolean;
  headers: Record<string, string>;
  body: string;
};

export type RequestLog = {
  id: string;
  method: string;
  endpoint: string;
  url: string;
  status_code: number | null;
  duration_ms: number | null;
  request_size: number | null;
  response_size: number | null;
  error_details: string | null;
  created_at: string;
};

export type RequestLogEntry = Omit<RequestLog, 'id' | 'created_at'>;

export async function logRequest(entry: RequestLogEntry): Promise<void> {
  try {
    const supabase = await createClient();
    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;

    if (!user) {
      return;
    }

    await supabase.from('request_history').insert({ ...entry, user_id: user.id });
  } catch(e) {
    console.error('There was en error logging the request:', e)
  }
}

export async function getHistory(): Promise<{
  data?: RequestLog[];
  error?: string;
}> {
  const supabase = await createClient();
  const userResult = await supabase.auth.getUser();
  const user = userResult.data.user;

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('request_history')
    .select(
      'id, method, endpoint, url, status_code, duration_ms, request_size, response_size, error_details, created_at'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }
  return { data };
}

export async function getHistoryEntry(id: string): Promise<{
  data?: RequestLog;
  error?: string;
}> {
  const supabase = await createClient();
  const userResult = await supabase.auth.getUser();
  const user = userResult.data.user;

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('request_history')
    .select(
      'id, method, endpoint, url, status_code, duration_ms, request_size, response_size, error_details, created_at'
    )
    .eq('user_id', user.id)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }
  return { data: data ?? undefined };
}