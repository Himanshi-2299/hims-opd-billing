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
import { Plus, Pencil, Trash2, Search, MoreVertical } from "lucide-react"
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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface Department {
  id: string
  code: string
  name: string
  description: string
  head: string
  location: string
  staffCount: number
  status: "active" | "inactive"
}

const mockDepartments: Department[] = [
  {
    id: "1",
    code: "ER",
    name: "Emergency (ER)",
    description: "Emergency and trauma care",
    head: "Dr. Sarah Johnson",
    location: "Building A, Floor 1",
    staffCount: 45,
    status: "active"
  },
  {
    id: "2",
    code: "IPD",
    name: "In-Patient (IPD)",
    description: "In-patient care and hospitalization",
    head: "Dr. Michael Chen",
    location: "Building A, Floor 3",
    staffCount: 35,
    status: "active"
  },
  {
    id: "3",
    code: "LAB",
    name: "Laboratory (LAB)",
    description: "Diagnostic and laboratory services",
    head: "Dr. Emily Rodriguez",
    location: "Building B, Floor 2",
    staffCount: 22,
    status: "active"
  },
  {
    id: "4",
    code: "PHARM",
    name: "Pharmacy (PHARM)",
    description: "Pharmaceutical services and medication dispensing",
    head: "Dr. James Wilson",
    location: "Building C, Floor 1",
    staffCount: 18,
    status: "active"
  },
]

export const DepartmentsMaster = forwardRef<{ handleAddNew: () => void }>((props, ref) => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id))
  }

  const handleAddNew = () => {
    setEditingDepartment(null)
    setIsDialogOpen(true)
  }

  useImperativeHandle(ref, () => ({
    handleAddNew
  }))

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--card)' }}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? "Edit Department" : "Add New Department"}
            </DialogTitle>
            <DialogDescription>
              {editingDepartment 
                ? "Update department information" 
                : "Create a new department"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Department Code</Label>
                <Input id="code" placeholder="e.g., ER" defaultValue={editingDepartment?.code} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Department Name</Label>
                <Input id="name" placeholder="e.g., Emergency (ER)" defaultValue={editingDepartment?.name} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Enter description" defaultValue={editingDepartment?.description} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="head">Department Head</Label>
              <Input id="head" placeholder="Select or enter name" defaultValue={editingDepartment?.head} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Building, Floor" defaultValue={editingDepartment?.location} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={editingDepartment?.status || "active"}>
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
              {editingDepartment ? "Update" : "Create"}
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
              placeholder="Search departments..."
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
                <TableHead>Code</TableHead>
                <TableHead>Department Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {dept.code}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)'
                    }}>
                      {dept.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--muted-foreground)'
                    }}>
                      {dept.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--foreground)'
                    }}>
                      {dept.head}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--muted-foreground)'
                    }}>
                      {dept.location}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--foreground)'
                    }}>
                      {dept.staffCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={dept.status === "active" ? "default" : "secondary"}>
                      {dept.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(dept)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(dept.id)}
                          style={{ color: 'var(--destructive)' }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
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