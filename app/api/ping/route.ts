import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Este endpoint es llamado por Vercel Cron cada día a las 12:00 UTC
// Su único propósito es hacer una query liviana a Supabase para
// evitar que el proyecto Free se pause por inactividad (se pausa a los 7 días)

export async function GET(request: Request) {
  // Seguridad: solo Vercel Cron puede llamar este endpoint
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Query mínima — solo cuenta 1 registro, no trae datos
    const { error } = await supabase
      .from('platforms')
      .select('id', { count: 'exact', head: true })
      .limit(1)

    if (error) throw error

    const now = new Date().toISOString()
    console.log(`[ping] Supabase OK — ${now}`)

    return NextResponse.json({
      ok: true,
      message: 'Supabase activo',
      timestamp: now,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    console.error(`[ping] Error — ${msg}`)

    return NextResponse.json(
      { ok: false, error: msg },
      { status: 500 }
    )
  }
}
