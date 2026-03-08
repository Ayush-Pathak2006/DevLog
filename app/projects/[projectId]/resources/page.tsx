"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useState } from "react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Resource = {
  id: string
  title: string
  url: string
  category: string
}

function getPreviewText(url: string) {
  if (!url) return "No URL yet."
  if (url.length <= 120) return url
  return `${url.slice(0, 117)}...`
}

export default function ResourcesPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const { data, isLoading } = useQuery<Resource[]>({
    queryKey: ["resources", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/resources`)
      return res.json()
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          url,
          category,
          projectId,
        }),
      })
    },
    onSuccess: () => {
      setTitle("")
      setUrl("")
      setCategory("")
      setIsCreateOpen(false)
      queryClient.invalidateQueries({ queryKey: ["resources", projectId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      title,
      url,
      category,
    }: {
      id: string
      title: string
      url: string
      category: string
    }) => {
      await fetch(`/api/resources/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url, category }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", projectId] })
      setSelectedResource((current) => {
        if (!current) return null
        return {
          ...current,
          title: editTitle,
          url: editUrl,
          category: editCategory,
        }
      })
      setIsEditing(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/resources/${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", projectId] })
      setSelectedResource(null)
    },
  })

  const openResourceDetails = (resource: Resource) => {
    setSelectedResource(resource)
    setEditTitle(resource.title)
    setEditUrl(resource.url)
    setEditCategory(resource.category)
    setIsEditing(false)
  }

  const resetFields = () => {
    if (!selectedResource) return
    setEditTitle(selectedResource.title)
    setEditUrl(selectedResource.url)
    setEditCategory(selectedResource.category)
    setIsEditing(false)
  }

  if (isLoading) return <p>Loading resources...</p>

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Resources</h1>

        <Button onClick={() => setIsCreateOpen(true)}>New Resource</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((resource) => (
          <Card
            key={resource.id}
            className="flex h-40 cursor-pointer flex-col transition hover:shadow-md"
            onClick={() => openResourceDetails(resource)}
          >
            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{getPreviewText(resource.url)}</p>
            </CardHeader>

            <CardContent className="mt-auto flex items-center justify-between gap-2">
              <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                {resource.category || "General"}
              </span>

              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteMutation.mutate(resource.id)
                }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Resource</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="Resource title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />

            <Input
              placeholder="Category (Docs, Video, Article)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button onClick={() => createMutation.mutate()}>Add Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedResource)} onOpenChange={(open) => !open && setSelectedResource(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Resource Details</DialogTitle>
          </DialogHeader>

          {selectedResource && (
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Heading</label>
                {isEditing ? (
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                ) : (
                  <div className="rounded border bg-muted/20 p-3 text-sm">{editTitle || "Untitled resource"}</div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Description / README</label>
                {isEditing ? (
                  <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="Resource URL" />
                ) : (
                  <a
                    href={editUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded border bg-muted/20 p-3 text-sm text-primary underline"
                  >
                    {editUrl || "No URL provided"}
                  </a>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-medium">Category</label>
                  {!isEditing && (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <Input
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Category"
                  />
                ) : (
                  <div className="rounded border bg-muted/20 p-3 text-sm">{editCategory || "General"}</div>
                )}
              </div>

              <DialogFooter>
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={resetFields}>
                      Reset
                    </Button>

                    <Button
                      onClick={() =>
                        updateMutation.mutate({
                          id: selectedResource.id,
                          title: editTitle,
                          url: editUrl,
                          category: editCategory,
                        })
                      }
                    >
                      Save changes
                    </Button>
                  </>
                ) : null}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}