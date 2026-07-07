import type { Metadata } from 'next'
import Image from 'next/image'
import { getDevelopers, getTeamMembers } from '@/lib/queries'
import Avatar from '@/components/Avatar'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'The ANON INDIA Group',
  description: 'ANON INDIA — real estate, construction & interiors. Structures, spaces & solutions engineered by Anon.',
}

export default async function DevelopersPage() {
  const [verticals, team] = await Promise.all([getDevelopers(), getTeamMembers()])

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="The group"
        title="The ANON INDIA Group"
        subtitle="Real estate, construction & interiors — engineered by Anon."
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80&auto=format&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section space-y-14">
        {/* Verticals */}
        <Reveal as="section">
          <h2 className="section-heading mb-6">Our Verticals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {verticals.map((d) => (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center h-28 text-center">
                {d.logo_url ? (
                  <div className="relative w-full h-12">
                    <Image
                      src={d.logo_url}
                      alt={d.name}
                      fill
                      sizes="(max-width: 768px) 150px, 200px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="font-semibold text-brand-900">{d.name}</span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Team */}
        {team.length > 0 && (
          <Reveal as="section" delay={120}>
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
          </Reveal>
        )}
      </div>
    </div>
  )
}
