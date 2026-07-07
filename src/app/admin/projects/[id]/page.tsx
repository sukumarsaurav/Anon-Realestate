import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProjectForm from '@/components/admin/ProjectForm'
import PlotsPanel from '@/components/admin/PlotsPanel'
import { updateProject, createPlot, updatePlotStatus, deletePlot } from '../actions'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: developers }, { data: plots }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).single(),
    supabase.from('developers').select('id, name').order('sort_order'),
    supabase.from('plots').select('id, plot_number, size_sqyd, size_sqft, facing, base_price, total_price, status').eq('project_id', id).order('plot_number'),
  ])

  if (!project) notFound()

  return (
    <div>
      <ProjectForm
        project={project}
        developers={developers ?? []}
        action={updateProject.bind(null, id)}
        extraTabs={[{
          label: 'Plots',
          content: (
            <PlotsPanel
              plots={plots ?? []}
              createPlot={createPlot.bind(null, id)}
              updatePlotStatus={updatePlotStatus.bind(null, id)}
              deletePlot={deletePlot.bind(null, id)}
            />
          ),
        }]}
      />
    </div>
  )
}
