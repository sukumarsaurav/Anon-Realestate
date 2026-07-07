import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DeveloperForm from '@/components/admin/DeveloperForm'
import { updateDeveloper } from '../actions'

export default async function EditDeveloperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: developer } = await supabase.from('developers').select('*').eq('id', id).single()

  if (!developer) notFound()

  return (
    <div>
      <DeveloperForm developer={developer} action={updateDeveloper.bind(null, id)} />
    </div>
  )
}
