import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TeamMemberForm from '@/components/admin/TeamMemberForm'
import { updateTeamMember } from '../actions'
import { getSiteSettings } from '@/lib/queries'

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [memberRes, settings] = await Promise.all([
    supabase.from('team_members').select('*').eq('id', id).single(),
    getSiteSettings()
  ])
  const member = memberRes.data

  if (!member) notFound()

  return (
    <div>
      <TeamMemberForm member={member} action={updateTeamMember.bind(null, id)} levels={settings?.team_levels ?? undefined} />
    </div>
  )
}
