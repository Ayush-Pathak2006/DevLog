"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateProjectDialog from "@/components/create-project-dialog";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

async function fetchProjects() {
  const res = await fetch("/api/projects");
  return res.json();
}

export default function ProjectsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>

        <CreateProjectDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((project: any) => (
          <Card key={project.id} className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <div className="flex gap-2">
                <Link href={`/projects/${project.id}/logs`}>
                  <Button size="sm">Logs</Button>
                </Link>

                <Link href={`/projects/${project.id}/resources`}>
                  <Button size="sm">
                    Resources
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-gray-500">{project.description}</p>

              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded w-fit">
                {project.status}
              </span>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(project.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
