"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useState } from "react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function LogsPage() {

  const params = useParams()
  const projectId = params.projectId as string

  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["logs", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/entries`)
      return res.json()
    }
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          content,
          projectId
        })
      })
    },
    onSuccess: () => {
      setTitle("")
      setContent("")
      queryClient.invalidateQueries({ queryKey: ["logs", projectId] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/entries/${id}`, {
        method: "DELETE"
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", projectId] })
    }
  })

  if (isLoading) return <p>Loading logs...</p>

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Logs</h1>

      {/* Create Log */}

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 p-4">

          <Input
            placeholder="Log title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Write your notes..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <Button
            onClick={() => createMutation.mutate()}
          >
            Add Log
          </Button>

        </CardContent>
      </Card>

      {/* Logs List */}

      <div className="flex flex-col gap-4">

        {data?.map((log: any) => (

          <Card key={log.id}>

            <CardHeader>
              <CardTitle>{log.title}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">

              <p className="text-sm text-gray-600">
                {log.content}
              </p>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteMutation.mutate(log.id)}
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