"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreateProjectDialog() {

  const queryClient = useQueryClient()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const mutation = useMutation({
    mutationFn: async () => {

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          status: "BUILDING"
        })
      })

      return res.json()
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      setName("")
      setDescription("")
    }
  })

  return (
    <Dialog>

      <DialogTrigger>
        <Button>New Project</Button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">

          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            onClick={() => mutation.mutate()}
          >
            Create
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  )
}