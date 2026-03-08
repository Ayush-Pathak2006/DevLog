"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useState } from "react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Entry = {
  id: string
  title: string
  content: string
}

function getPreviewText(content: string) {
  if (!content) return "No details yet."
  const trimmed = content.trim()
  if (trimmed.length <= 120) return trimmed
  return `${trimmed.slice(0, 117)}...`
}

export default function LogsPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [selectedLog, setSelectedLog] = useState<Entry | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const { data, isLoading } = useQuery<Entry[]>({
    queryKey: ["logs", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/entries`)
      return res.json()
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          projectId,
        }),
      })
    },
    onSuccess: () => {
      setTitle("")
      setContent("")
      setIsCreateOpen(false)
      queryClient.invalidateQueries({ queryKey: ["logs", projectId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      await fetch(`/api/entries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", projectId] })
      setSelectedLog((current) => {
        if (!current) return null
        return {
          ...current,
          title: editTitle,
          content: editContent,
        }
      })
      setIsEditing(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/entries/${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", projectId] })
      setSelectedLog(null)
    },
  })

  const openLogDetails = (log: Entry) => {
    setSelectedLog(log)
    setEditTitle(log.title)
    setEditContent(log.content)
    setIsEditing(false)
  }

  const resetFields = () => {
    if (!selectedLog) return
    setEditTitle(selectedLog.title)
    setEditContent(selectedLog.content)
    setIsEditing(false)
  }

  if (isLoading) return <p>Loading logs...</p>

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Logs</h1>

        <Button onClick={() => setIsCreateOpen(true)}>New Log</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((log) => (
          <Card
            key={log.id}
            className="flex h-40 cursor-pointer flex-col transition hover:shadow-md"
            onClick={() => openLogDetails(log)}
          >
            <CardHeader>
              <CardTitle>{log.title}</CardTitle>
              <p className="text-sm text-gray-500">{getPreviewText(log.content)}</p>
            </CardHeader>

            <CardContent className="flex items-center justify-end">
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteMutation.mutate(log.id)
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
            <DialogTitle>Create Log</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
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
          </div>

          <DialogFooter>
            <Button onClick={() => createMutation.mutate()}>Add Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedLog)} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Heading</label>
                {isEditing ? (
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                ) : (
                  <div className="rounded border bg-muted/20 p-3 text-sm">{editTitle || "Untitled log"}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-medium">Description / README</label>
                  {!isEditing && (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-64"
                  />
                ) : (
                  <div className="min-h-64 whitespace-pre-wrap rounded border bg-muted/20 p-3 text-sm">
                    {editContent || "No README description yet."}
                  </div>
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
                          id: selectedLog.id,
                          title: editTitle,
                          content: editContent,
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