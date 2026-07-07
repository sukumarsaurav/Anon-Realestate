import { createClient } from '@/lib/supabase/server'
import ProjectForm from '@/components/admin/ProjectForm'
import { createProject } from '../actions'

export default async function NewProjectPage() {
  const supabase = await createClient()
  const { data: developers } = await supabase.from('developers').select('id, name').order('sort_order')

  return (
    <div>
      <ProjectForm developers={developers ?? []} action={createProject} />
    </div>
  )
}
