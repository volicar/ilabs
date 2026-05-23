import { createClient } from '@/lib/supabase/client';

type SupabaseClient = ReturnType<typeof createClient>;

export type CmsScope = 'banner' | 'hero' | 'services';
export type CmsActionType = 'insert' | 'update' | 'delete' | 'reorder';

export type CmsHistoryPayload =
  | { kind: 'insert'; table: string; inserted_id: string }
  | { kind: 'update'; table: string; id: string; previous: Record<string, unknown> }
  | { kind: 'delete'; table: string; row: Record<string, unknown> }
  | { kind: 'reorder'; table: string; swaps: Array<{ id: string; order_index: number }> };

export type CmsHistoryEntry = {
  scope: CmsScope;
  action_type: CmsActionType;
  description: string;
  payload: CmsHistoryPayload;
  created_at?: string;
  created_by?: string | null;
};

export async function recordAction(
  supabase: SupabaseClient,
  entry: Omit<CmsHistoryEntry, 'created_at' | 'created_by'>
) {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from('cms_history').upsert({
    scope: entry.scope,
    action_type: entry.action_type,
    description: entry.description,
    payload: entry.payload,
    created_at: new Date().toISOString(),
    created_by: user?.email ?? null,
  });
}

export async function getLastAction(
  supabase: SupabaseClient,
  scope: CmsScope
): Promise<CmsHistoryEntry | null> {
  const { data } = await supabase
    .from('cms_history')
    .select('*')
    .eq('scope', scope)
    .maybeSingle();
  return (data as CmsHistoryEntry | null) ?? null;
}

export async function clearAction(supabase: SupabaseClient, scope: CmsScope) {
  await supabase.from('cms_history').delete().eq('scope', scope);
}

export async function applyUndo(supabase: SupabaseClient, entry: CmsHistoryEntry) {
  const p = entry.payload;
  switch (p.kind) {
    case 'insert': {
      const { error } = await supabase.from(p.table).delete().eq('id', p.inserted_id);
      if (error) throw error;
      break;
    }
    case 'update': {
      const { error } = await supabase.from(p.table).update(p.previous).eq('id', p.id);
      if (error) throw error;
      break;
    }
    case 'delete': {
      const { error } = await supabase.from(p.table).insert(p.row);
      if (error) throw error;
      break;
    }
    case 'reorder': {
      await Promise.all(
        p.swaps.map((s) =>
          supabase.from(p.table).update({ order_index: s.order_index }).eq('id', s.id),
        ),
      );
      break;
    }
  }
}
