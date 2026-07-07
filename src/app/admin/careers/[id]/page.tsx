import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CareerListingForm from '@/components/admin/CareerListingForm'
import { updateCareerListing } from '../actions'

export default async function EditCareerListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: listing } = await supabase.from('career_listings').select('*').eq('id', id).single()

  if (!listing) notFound()

  return (
    <div>
      <CareerListingForm listing={listing} action={updateCareerListing.bind(null, id)} />
    </div>
  )
}
