import TestimonialForm from '@/components/admin/TestimonialForm'
import { createTestimonial } from '../actions'

export default function NewTestimonialPage() {
  return (
    <div>
      <TestimonialForm action={createTestimonial} />
    </div>
  )
}
