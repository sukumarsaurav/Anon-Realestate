import CareerListingForm from '@/components/admin/CareerListingForm'
import { createCareerListing } from '../actions'

export default function NewCareerListingPage() {
  return (
    <div>
      <CareerListingForm action={createCareerListing} />
    </div>
  )
}
