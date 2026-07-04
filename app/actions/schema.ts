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
  content: string;
  format: Format;
} | null> {
 
const supabase = await createClient();
const userResult = await supabase.auth.getUser();
const user = userResult.data.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('saved_schemas')
    .select('content, format')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    content: data.content,
    format: data.format as Format,
  };
}