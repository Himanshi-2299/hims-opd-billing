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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  status: "active" | "inactive"
  userCount: number
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access with all permissions",
    permissions: ["All Permissions"],
    status: "active",
    userCount: 5
  },
  {
    id: "2",
    name: "Doctor",
    description: "Medical staff with patient care permissions",
    permissions: ["Patient Management", "Prescriptions", "Medical Records"],
    status: "active",
    userCount: 42
  },
  {
    id: "3",
    name: "Nurse",
    description: "Nursing staff with patient care support",
    permissions: ["Patient Care", "Vital Signs", "Medication Administration"],
    status: "active",
    userCount: 67
  },
  {
    id: "4",
    name: "Receptionist",
    description: "Front desk staff for patient registration",
    permissions: ["Patient Registration", "Appointments", "Basic Information"],
    status: "active",
    userCount: 12
  },
]

export const RolesMaster = forwardRef<{ handleAddNew: () => void }>((props, ref) => {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setRoles(roles.filter(r => r.id !== id))
  }

  const handleAddNew = () => {
    setEditingRole(null)
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
              {editingRole ? "Edit Role" : "Add New Role"}
            </DialogTitle>
            <DialogDescription>
              {editingRole 
                ? "Update role information and permissions" 
                : "Create a new role with specific permissions"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input id="name" placeholder="Enter role name" defaultValue={editingRole?.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Enter role description" defaultValue={editingRole?.description} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="permissions">Permissions</Label>
              <Input id="permissions" placeholder="Enter permissions (comma separated)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingRole ? "Update" : "Create"}
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
              placeholder="Search roles..."
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
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)'
                    }}>
                      {role.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--muted-foreground)'
                    }}>
                      {role.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 2).map((perm, idx) => (
                        <Badge key={idx} variant="secondary">
                          {perm}
                        </Badge>
                      ))}
                      {role.permissions.length > 2 && (
                        <Badge variant="secondary">
                          +{role.permissions.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--foreground)'
                    }}>
                      {role.userCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.status === "active" ? "default" : "secondary"}>
                      {role.status}
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
                        <DropdownMenuItem onClick={() => handleEdit(role)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(role.id)}
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