import { createClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
export default async function TestPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('clients')
    .select('*')

  return (
    <div style={{ padding: 20 }}>
      <h1>Test DB</h1>

      {error && <p style={{ color: 'red' }}>{error.message}</p>}

      <pre>{JSON.stringify(data ?? [], null, 2)}</pre>
    </div>
  )
}
