'use server';

import { createClient } from '@utils/supabase/server';
import type { Format } from '@/components/swagger-editor/utils';

export async function saveSchema(
  content: string,
  format: Format
): Promise<{ error?: string | undefined }> {


const supabase = await createClient();
const userResult = await supabase.auth.getUser();
const user = userResult.data.user;

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase.from('saved_schemas').upsert(
    {
      user_id: user.id,
      content,
      format,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id',
    }
  );

  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function getSavedSchema(): Promise<{
  data?: { content: string; format: Format };
  error?: string;
}> {
  const supabase = await createClient();
  const userResult = await supabase.auth.getUser();
  const user = userResult.data.user;

  if (!user) {
    return {};
  }

  const { data, error } = await supabase
    .from('saved_schemas')
    .select('content, format')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return {};
  }

  return {
    data: {
      content: data.content,
      format: data.format as Format,
    },
  };
}