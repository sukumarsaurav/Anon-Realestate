import type { Metadata } from 'next'
import { getDevelopers, getTeamMembers } from '@/lib/queries'
import Avatar from '@/components/Avatar'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'The ANON INDIA Group',
  description: 'ANON INDIA — real estate, construction & interiors. Structures, spaces & solutions engineered by Anon.',
}

export default async function DevelopersPage() {
  const [verticals, team] = await Promise.all([getDevelopers(), getTeamMembers()])

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">The ANON INDIA Group</h1>
          <p className="text-gray-300">Real estate, construction &amp; interiors — engineered by Anon.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Verticals */}
        <section>
          <h2 className="section-heading mb-6">Our Verticals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {verticals.map((d) => (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center h-28 text-center">
                {d.logo_url
                  ? /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={d.logo_url} alt={d.name} className="max-h-12 max-w-full object-contain" />
                  : <span className="font-semibold text-brand-900">{d.name}</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        {team.length > 0 && (
          <section>
            <h2 className="section-heading mb-6">Leadership &amp; Advisors</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {team.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-brand-900 overflow-hidden mb-3 flex">
                    <Avatar name={m.name} src={m.photo_url} fontClass="text-lg" />
                  </div>
                  <p className="font-semibold text-brand-900 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.designation}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
