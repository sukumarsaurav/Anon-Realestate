import TeamMemberForm from '@/components/admin/TeamMemberForm'
import { createTeamMember } from '../actions'
import { getSiteSettings } from '@/lib/queries'

export default async function NewTeamMemberPage() {
  const settings = await getSiteSettings()
  return (
    <div>
      <TeamMemberForm action={createTeamMember} levels={settings?.team_levels ?? undefined} />
    </div>
  )
}
