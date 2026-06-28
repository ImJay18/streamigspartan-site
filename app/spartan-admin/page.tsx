'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Usuario o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push('/spartan-admin/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Streaming Spartan" style={{ height: 72, width: 'auto', objectFit: 'contain' }}/>
          </div>
          <p className="text-[#A1A1AA] text-sm">Panel de administración</p>
        </div>

        {/* Card */}
        <div className="bg-[#0F0F0F] border border-[#1A1A2E] rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-6">Iniciar sesión</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">Usuario (email)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@streamingspartan.com"
                className="w-full bg-[#050505] border border-[#1A1A2E] rounded-lg px-4 py-3 text-white text-sm placeholder-[#3f3f46] focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#050505] border border-[#1A1A2E] rounded-lg px-4 py-3 text-white text-sm placeholder-[#3f3f46] focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)' }}
            >
              {loading ? 'Verificando...' : 'Entrar al panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#3f3f46] text-xs mt-6">
          Acceso restringido — Solo administradores
        </p>
      </div>
    </div>
  )
}
