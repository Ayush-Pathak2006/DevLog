"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useState } from "react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ResourcesPage() {

  const params = useParams()
  const projectId = params.projectId as string

  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["resources", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/resources`)
      return res.json()
    }
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          url,
          category,
          projectId
        })
      })
    },
    onSuccess: () => {
      setTitle("")
      setUrl("")
      setCategory("")
      queryClient.invalidateQueries({ queryKey: ["resources", projectId] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/resources/${id}`, {
        method: "DELETE"
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", projectId] })
    }
  })

  if (isLoading) return <p>Loading resources...</p>

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Resources</h1>

      {/* Create Resource */}

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 p-4">

          <Input
            placeholder="Resource title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <Input
            placeholder="Category (Docs, Video, Article)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Button
            onClick={() => createMutation.mutate()}
          >
            Add Resource
          </Button>

        </CardContent>
      </Card>

      {/* Resource List */}

      <div className="flex flex-col gap-4">

        {data?.map((resource: any) => (

          <Card key={resource.id}>

            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">

              <a
                href={resource.url}
                target="_blank"
                className="text-blue-600 text-sm underline"
              >
                {resource.url}
              </a>

              <span className="text-xs text-gray-500">
                {resource.category}
              </span>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteMutation.mutate(resource.id)}
              >
                Delete
              </Button>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>
  )
}