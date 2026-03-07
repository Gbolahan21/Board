import { useState, useEffect } from "react"

type Props = {
  isOpen: boolean
  onConfirm: (
    title: string,
    description: string,
    tags: string[],
    dueDate?: string
  ) => void
  onCancel: () => void
}

const CreateCardModal = ({ isOpen, onConfirm, onCancel }: Props) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [dueDate, setDueDate] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTitle("")
      setDescription("")
      setTags("")
      setDueDate("")
    }
  }, [isOpen]) // eslint-disable-next-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded w-96">

        <h2 className="text-xl font-bold mb-4">Create Card</h2>

        <input
          className="w-full mb-3 p-2 rounded bg-gray-700"
          placeholder="Card title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full mb-3 p-2 rounded bg-gray-700"
          placeholder="Description (Markdown supported)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 rounded bg-gray-700"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <input
          type="date"
          className="w-full mb-4 p-2 rounded bg-gray-700"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-600 rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onConfirm(
                title,
                description,
                tags.split(",").map((t) => t.trim()),
                dueDate || undefined
              )
            }
            className="px-3 py-1 bg-green-600 rounded cursor-pointer"
          >
            Create
          </button>

        </div>
      </div>
    </div>
  )
}

export default CreateCardModal