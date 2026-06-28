import { createClient } from './supabase/client'
import type { Platform, Combo, SiteSetting, FAQ } from '@/types'

// ─── Platforms ────────────────────────────────────────────────
export async function getPlatforms(): Promise<Platform[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })

  if (error) { console.error('getPlatforms:', error); return [] }
  return data ?? []
}

export async function getAllPlatforms(): Promise<Platform[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) { console.error('getAllPlatforms:', error); return [] }
  return data ?? []
}

export async function upsertPlatform(platform: Partial<Platform>): Promise<Platform | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('platforms')
    .upsert(platform)
    .select()
    .single()

  if (error) { console.error('upsertPlatform:', error); return null }
  return data
}

export async function deletePlatform(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('platforms').delete().eq('id', id)
  if (error) { console.error('deletePlatform:', error); return false }
  return true
}

// ─── Combos ───────────────────────────────────────────────────
export async function getCombos(): Promise<Combo[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('combos')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })

  if (error) { console.error('getCombos:', error); return [] }
  return data ?? []
}

export async function getAllCombos(): Promise<Combo[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('combos')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) { console.error('getAllCombos:', error); return [] }
  return data ?? []
}

export async function upsertCombo(combo: Partial<Combo>): Promise<Combo | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('combos')
    .upsert(combo)
    .select()
    .single()

  if (error) { console.error('upsertCombo:', error); return null }
  return data
}

export async function deleteCombo(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('combos').delete().eq('id', id)
  if (error) { console.error('deleteCombo:', error); return false }
  return true
}

// ─── Settings ─────────────────────────────────────────────────
export async function getSettings(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')

  if (error) { console.error('getSettings:', error); return {} }
  return Object.fromEntries((data ?? []).map((s: Pick<SiteSetting, 'key' | 'value'>) => [s.key, s.value]))
}

export async function updateSetting(key: string, value: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value })

  if (error) { console.error('updateSetting:', error); return false }
  return true
}

// ─── FAQs ─────────────────────────────────────────────────────
export async function getFAQs(): Promise<FAQ[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })

  if (error) { console.error('getFAQs:', error); return [] }
  return data ?? []
}

export async function getAllFAQs(): Promise<FAQ[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) { console.error('getAllFAQs:', error); return [] }
  return data ?? []
}

export async function upsertFAQ(faq: Partial<FAQ>): Promise<FAQ | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('faqs')
    .upsert(faq)
    .select()
    .single()

  if (error) { console.error('upsertFAQ:', error); return null }
  return data
}

export async function deleteFAQ(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('faqs').delete().eq('id', id)
  if (error) { console.error('deleteFAQ:', error); return false }
  return true
}
