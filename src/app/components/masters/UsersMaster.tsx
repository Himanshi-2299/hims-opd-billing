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
import { Plus, Pencil, Trash2, Search, Mail, Phone, MoreVertical } from "lucide-react"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
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

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  facility: string
  status: "active" | "inactive" | "suspended"
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@hospital.com",
    phone: "+1 (555) 111-2222",
    role: "Doctor",
    department: "Emergency (ER)",
    facility: "Main Hospital Campus",
    status: "active"
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@hospital.com",
    phone: "+1 (555) 222-3333",
    role: "Doctor",
    department: "In-Patient (IPD)",
    facility: "Main Hospital Campus",
    status: "active"
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@hospital.com",
    phone: "+1 (555) 333-4444",
    role: "Nurse",
    department: "Emergency (ER)",
    facility: "Main Hospital Campus",
    status: "active"
  },
  {
    id: "4",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@hospital.com",
    phone: "+1 (555) 444-5555",
    role: "Receptionist",
    department: "Laboratory (LAB)",
    facility: "Downtown Clinic",
    status: "active"
  },
  {
    id: "5",
    firstName: "Lisa",
    lastName: "Thompson",
    email: "lisa.thompson@hospital.com",
    phone: "+1 (555) 555-6666",
    role: "Administrator",
    department: "Pharmacy (PHARM)",
    facility: "Main Hospital Campus",
    status: "active"
  },
]

export const UsersMaster = forwardRef<{ handleAddNew: () => void }>((props, ref) => {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const handleAddNew = () => {
    setEditingUser(null)
    setIsDialogOpen(true)
  }

  useImperativeHandle(ref, () => ({
    handleAddNew
  }))

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--card)' }}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Update user information" 
                : "Create a new user account"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" defaultValue={editingUser?.firstName} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" defaultValue={editingUser?.lastName} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" defaultValue={editingUser?.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" defaultValue={editingUser?.phone} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={editingUser?.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select defaultValue={editingUser?.department}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emergency (ER)">Emergency (ER)</SelectItem>
                    <SelectItem value="In-Patient (IPD)">In-Patient (IPD)</SelectItem>
                    <SelectItem value="Laboratory (LAB)">Laboratory (LAB)</SelectItem>
                    <SelectItem value="Pharmacy (PHARM)">Pharmacy (PHARM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="facility">Facility</Label>
                <Select defaultValue={editingUser?.facility}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Hospital Campus">Main Hospital Campus</SelectItem>
                    <SelectItem value="Downtown Clinic">Downtown Clinic</SelectItem>
                    <SelectItem value="Central Laboratory">Central Laboratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={editingUser?.status || "active"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingUser ? "Update" : "Create"}
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
              placeholder="Search users..."
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
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback style={{ 
                          backgroundColor: 'var(--primary)',
                          color: 'var(--primary-foreground)',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'var(--text-label)',
                          fontWeight: 'var(--font-weight-medium)'
                        }}>
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--foreground)'
                        }}>
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
                        <span style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'var(--text-label)',
                          color: 'var(--foreground)'
                        }}>
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
                        <span style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'var(--text-label)',
                          color: 'var(--muted-foreground)'
                        }}>
                          {user.phone}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--foreground)'
                    }}>
                      {user.department}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--muted-foreground)'
                    }}>
                      {user.facility}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(user.status)}>
                      {user.status}
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
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(user.id)}
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