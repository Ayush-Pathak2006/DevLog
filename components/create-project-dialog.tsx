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

const defaultReadmeText = `## Overview
Briefly describe what this project does.

## Goals
- Goal 1
- Goal 2

## Next Steps
- [ ] Add first milestone`

export default function CreateProjectDialog() {

  const queryClient = useQueryClient()

  const [name, setName] = useState("")
  const [description, setDescription] = useState(defaultReadmeText)
  const [open, setOpen] = useState(false)

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
      setDescription(defaultReadmeText)
      setOpen(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger>
        <Button>New Project</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl p-4 sm:p-6">

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
            className="min-h-52"
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