"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CreateProjectDialog from "@/components/create-project-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type ProjectStatus = "IDEA" | "BUILDING" | "SHIPPED" | "PAUSED";

type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
};

const statusLabels: Record<ProjectStatus, string> = {
  IDEA: "Idea",
  BUILDING: "Building",
  SHIPPED: "Finished",
  PAUSED: "Pause",
};

const editableStatuses: ProjectStatus[] = ["BUILDING", "PAUSED", "SHIPPED"];

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  return res.json();
}

function getPreviewText(description: string) {
  if (!description) return "No description yet.";
  const trimmed = description.trim();
  if (trimmed.length <= 120) return trimmed;
  return `${trimmed.slice(0, 117)}...`;
}

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<ProjectStatus>("BUILDING");
  const [isEditingDescription, setIsEditingDescription] = useState(false);

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
      setSelectedProject(null);
    },
  });

  const detailsMutation = useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      status,
    }: {
      id: string;
      name: string;
      description: string;
      status: ProjectStatus;
    }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, status }),
      });

      return res.json() as Promise<Project>;
    },
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSelectedProject(updatedProject);
      setEditStatus(updatedProject.status);
      setIsEditingDescription(false);
    },
  });

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setEditName(project.name);
    setEditDescription(project.description);
    setEditStatus(project.status);
    setIsEditingDescription(false);
  };

  const resetFields = () => {
    if (!selectedProject) return;
    setEditName(selectedProject.name);
    setEditDescription(selectedProject.description);
    setEditStatus(selectedProject.status);
    setIsEditingDescription(false);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        <CreateProjectDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer transition hover:shadow-md"
            onClick={() => openProjectDetails(project)}
          >
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <p className="text-sm text-gray-500">{getPreviewText(project.description)}</p>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <span className="w-fit rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                {statusLabels[project.status]}
              </span>

              <div className="flex flex-wrap gap-2">
                <Link href={`/projects/${project.id}/logs`} onClick={(e) => e.stopPropagation()}>
                  <Button size="sm">Logs</Button>
                </Link>

                <Link
                  href={`/projects/${project.id}/resources`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button size="sm">Resources</Button>
                </Link>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(project.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-auto p-4 sm:max-w-3xl sm:p-6 lg:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Project name</label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Status</label>
                  <select
                    value={editStatus}
                    className="h-8 w-full rounded border bg-white px-2 text-xs"
                    onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
                  >
                    {editableStatuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-medium">Description / README</label>
                  {!isEditingDescription && (
                    <Button size="xs" variant="outline" onClick={() => setIsEditingDescription(true)}>
                      Edit
                    </Button>
                  )}
                </div>

                {isEditingDescription ? (
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="min-h-64"
                  />
                ) : (
                  <div className="min-h-64 rounded border bg-muted/20 p-3 text-sm whitespace-pre-wrap">
                    {editDescription || "No README description yet."}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetFields}>
                  Reset
                </Button>

                <Button
                  onClick={() =>
                    detailsMutation.mutate({
                      id: selectedProject.id,
                      name: editName,
                      description: editDescription,
                      status: editStatus,
                    })
                  }
                >
                  Save changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}