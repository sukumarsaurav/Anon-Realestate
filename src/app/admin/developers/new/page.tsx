import DeveloperForm from '@/components/admin/DeveloperForm'
import { createDeveloper } from '../actions'

export default function NewDeveloperPage() {
  return (
    <div>
      <DeveloperForm action={createDeveloper} />
    </div>
  )
}
