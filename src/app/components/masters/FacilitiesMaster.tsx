import { useState } from "react"
import { forwardRef, useImperativeHandle } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
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
import { Plus, Pencil, Trash2, Search, MapPin, MoreVertical } from "lucide-react"
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
import { useFacilities } from "../../../contexts/FacilitiesContext"

interface Facility {
  id: string
  code: string
  name: string
  type: "hospital" | "clinic" | "laboratory" | "pharmacy"
  address: string
  city: string
  phone: string
  capacity: number
  status: "active" | "inactive"
}

const mockFacilities: Facility[] = [
  {
    id: "1",
    code: "HQ01",
    name: "Main Hospital Campus",
    type: "hospital",
    address: "123 Medical Center Drive",
    city: "New York",
    phone: "+1 (555) 123-4567",
    capacity: 500,
    status: "active"
  },
  {
    id: "2",
    code: "CL01",
    name: "Downtown Clinic",
    type: "clinic",
    address: "456 Healthcare Avenue",
    city: "New York",
    phone: "+1 (555) 234-5678",
    capacity: 50,
    status: "active"
  },
  {
    id: "3",
    code: "LAB01",
    name: "Central Laboratory",
    type: "laboratory",
    address: "789 Research Boulevard",
    city: "New York",
    phone: "+1 (555) 345-6789",
    capacity: 20,
    status: "active"
  },
  {
    id: "4",
    code: "PH01",
    name: "Hospital Pharmacy",
    type: "pharmacy",
    address: "123 Medical Center Drive",
    city: "New York",
    phone: "+1 (555) 456-7890",
    capacity: 10,
    status: "active"
  },
]

export const FacilitiesMaster = forwardRef<{ handleAddNew: () => void }>((props, ref) => {
  const { facilities, deleteFacility } = useFacilities()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState<any>(null)

  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (facilityId: string) => {
    // Navigate to edit page
    navigate(`/facilities/edit/${facilityId}`)
  }

  const handleDelete = (id: string) => {
    deleteFacility(id)
  }

  const handleAddNew = () => {
    // Navigate to add facility page
    navigate('/facilities/add')
  }

  useImperativeHandle(ref, () => ({
    handleAddNew
  }))

  const getFacilityTypeColor = (type: string) => {
    switch (type) {
      case "hospital":
        return "default"
      case "clinic":
        return "secondary"
      case "laboratory":
        return "outline"
      case "pharmacy":
        return "outline"
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
              {editingFacility ? "Edit Facility" : "Add New Facility"}
            </DialogTitle>
            <DialogDescription>
              {editingFacility 
                ? "Update facility information" 
                : "Create a new facility"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Facility Code</Label>
                <Input id="code" placeholder="e.g., HQ01" defaultValue={editingFacility?.code} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Facility Name</Label>
                <Input id="name" placeholder="Enter facility name" defaultValue={editingFacility?.name} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={editingFacility?.type || "hospital"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input 
                  id="capacity" 
                  type="number" 
                  placeholder="Enter capacity" 
                  defaultValue={editingFacility?.capacity} 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Enter address" defaultValue={editingFacility?.address} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Enter city" defaultValue={editingFacility?.city} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" defaultValue={editingFacility?.phone} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={editingFacility?.status || "active"}>
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
              {editingFacility ? "Update" : "Create"}
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
              placeholder="Search facilities..."
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
                <TableHead>Facility Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFacilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {facility.code}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)'
                    }}>
                      {facility.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getFacilityTypeColor(facility.type)}>
                      {facility.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                      <div>
                        <div style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'var(--text-base)',
                          color: 'var(--foreground)'
                        }}>
                          {facility.address}
                        </div>
                        <div style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'var(--text-label)',
                          color: 'var(--muted-foreground)'
                        }}>
                          {facility.city}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--foreground)'
                    }}>
                      {facility.phone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-base)',
                      color: 'var(--foreground)'
                    }}>
                      {facility.capacity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={facility.status === "active" ? "default" : "secondary"}>
                      {facility.status}
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
                        <DropdownMenuItem onClick={() => handleEdit(facility.id)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(facility.id)}
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