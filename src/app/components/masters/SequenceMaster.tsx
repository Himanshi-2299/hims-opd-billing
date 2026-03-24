import { useState } from "react"
import { forwardRef, useImperativeHandle } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Plus, Pencil, Trash2, Search, RefreshCw, MoreVertical } from "lucide-react"
import { Badge } from "../ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface Sequence {
  id: string
  name: string
  prefix: string
  description: string
  currentValue: number
  startValue: number
  increment: number
  format: string
  example: string
  status: "active" | "inactive"
}

const mockSequences: Sequence[] = [
  {
    id: "1",
    name: "Patient ID",
    prefix: "PAT",
    description: "Unique identifier for patients",
    currentValue: 10523,
    startValue: 10000,
    increment: 1,
    format: "PAT-XXXXXX",
    example: "PAT-010523",
    status: "active"
  },
  {
    id: "2",
    name: "Appointment ID",
    prefix: "APT",
    description: "Unique identifier for appointments",
    currentValue: 25678,
    startValue: 20000,
    increment: 1,
    format: "APT-XXXXXX",
    example: "APT-025678",
    status: "active"
  },
  {
    id: "3",
    name: "Invoice ID",
    prefix: "INV",
    description: "Unique identifier for invoices",
    currentValue: 34521,
    startValue: 30000,
    increment: 1,
    format: "INV-XXXXXX",
    example: "INV-034521",
    status: "active"
  },
  {
    id: "4",
    name: "Lab Test ID",
    prefix: "LAB",
    description: "Unique identifier for laboratory tests",
    currentValue: 8765,
    startValue: 5000,
    increment: 1,
    format: "LAB-XXXXXX",
    example: "LAB-008765",
    status: "active"
  },
  {
    id: "5",
    name: "Prescription ID",
    prefix: "RX",
    description: "Unique identifier for prescriptions",
    currentValue: 15432,
    startValue: 10000,
    increment: 1,
    format: "RX-XXXXXX",
    example: "RX-015432",
    status: "active"
  },
]

export const SequenceMaster = forwardRef<{ handleAddNew: () => void }>((props, ref) => {
  const [sequences, setSequences] = useState<Sequence[]>(mockSequences)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSequence, setEditingSequence] = useState<Sequence | null>(null)

  const filteredSequences = sequences.filter(seq =>
    seq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seq.prefix.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seq.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (sequence: Sequence) => {
    setEditingSequence(sequence)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setSequences(sequences.filter(s => s.id !== id))
  }

  const handleAddNew = () => {
    setEditingSequence(null)
    setIsDialogOpen(true)
  }

  useImperativeHandle(ref, () => ({
    handleAddNew
  }))

  const handleReset = (id: string) => {
    setSequences(sequences.map(seq => 
      seq.id === id 
        ? { ...seq, currentValue: seq.startValue }
        : seq
    ))
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--card)' }}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSequence ? "Edit Sequence" : "Add New Sequence"}
            </DialogTitle>
            <DialogDescription>
              {editingSequence 
                ? "Update sequence configuration" 
                : "Create a new sequence for auto-generated IDs"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Sequence Name</Label>
                <Input id="name" placeholder="e.g., Patient ID" defaultValue={editingSequence?.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prefix">Prefix</Label>
                <Input id="prefix" placeholder="e.g., PAT" defaultValue={editingSequence?.prefix} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Enter description" defaultValue={editingSequence?.description} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startValue">Start Value</Label>
                <Input 
                  id="startValue" 
                  type="number" 
                  placeholder="10000" 
                  defaultValue={editingSequence?.startValue} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentValue">Current Value</Label>
                <Input 
                  id="currentValue" 
                  type="number" 
                  placeholder="10523" 
                  defaultValue={editingSequence?.currentValue} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="increment">Increment</Label>
                <Input 
                  id="increment" 
                  type="number" 
                  placeholder="1" 
                  defaultValue={editingSequence?.increment} 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="format">Format Pattern</Label>
              <Input 
                id="format" 
                placeholder="e.g., PAT-XXXXXX" 
                defaultValue={editingSequence?.format} 
              />
              <p style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: 'var(--text-label)',
                color: 'var(--muted-foreground)'
              }}>
                Use X for numeric placeholders. Example: PAT-XXXXXX generates PAT-010523
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={editingSequence?.status || "active"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingSequence ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search Bar */}
      <div className="px-6 pt-6 pb-4">
        <div className="max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
            <Input
              placeholder="Search sequences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                paddingLeft: '2.5rem',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div style={{ 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          backgroundColor: 'var(--background)'
        }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sequence Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Example</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSequences.map((seq) => (
                <TableRow key={seq.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {seq.prefix}
                      </Badge>
                      <span style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--foreground)'
                      }}>
                        {seq.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--muted-foreground)'
                    }}>
                      {seq.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <code style={{ 
                      fontFamily: 'monospace',
                      fontSize: 'var(--text-label)',
                      backgroundColor: 'var(--muted)',
                      color: 'var(--foreground)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      {seq.format}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--primary)'
                    }}>
                      {seq.example}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)'
                    }}>
                      {seq.currentValue.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-label)',
                      color: 'var(--muted-foreground)'
                    }}>
                      {seq.startValue.toLocaleString()} - {seq.currentValue.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={seq.status === "active" ? "default" : "secondary"}>
                      {seq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleReset(seq.id)}
                          title="Reset to start value"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(seq)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(seq.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" style={{ color: 'var(--destructive)' }} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
})