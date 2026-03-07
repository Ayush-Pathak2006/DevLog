"use client"

import { useQuery } from "@tanstack/react-query"
import CreateProjectDialog from "@/components/create-project-dialog"

async function fetchProjects() {
  const res = await fetch("/api/projects")
  return res.json()
}

export default function ProjectsPage() {

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Projects
      </h1>
        <CreateProjectDialog />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {data?.map((project: any) => (
          <div
            key={project.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <h2 className="font-semibold">
              {project.name}
            </h2>

            <p className="text-sm text-gray-500">
              {project.description}
            </p>

            <span className="text-xs text-blue-600">
              {project.status}
            </span>

          </div>
        ))}

      </div>

    </div>
  )
}