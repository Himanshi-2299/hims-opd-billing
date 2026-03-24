import { Tabs, TabsContent, TabsList, TabsTrigger } from "../app/components/ui/tabs"
import { Button } from "../app/components/ui/button"
import { Plus } from "lucide-react"
import { RolesMaster } from "../app/components/masters/RolesMaster"
import { DepartmentsMaster } from "../app/components/masters/DepartmentsMaster"
import { FacilitiesMaster } from "../app/components/masters/FacilitiesMaster"
import { UsersMaster } from "../app/components/masters/UsersMaster"
import { SequenceMaster } from "../app/components/masters/SequenceMaster"
import { useState, useRef } from "react"

export function MastersPage() {
  const [activeTab, setActiveTab] = useState("roles")
  const rolesRef = useRef<{ handleAddNew: () => void }>(null)
  const departmentsRef = useRef<{ handleAddNew: () => void }>(null)
  const facilitiesRef = useRef<{ handleAddNew: () => void }>(null)
  const usersRef = useRef<{ handleAddNew: () => void }>(null)
  const sequenceRef = useRef<{ handleAddNew: () => void }>(null)

  const handleAddClick = () => {
    switch(activeTab) {
      case "roles":
        rolesRef.current?.handleAddNew()
        break
      case "departments":
        departmentsRef.current?.handleAddNew()
        break
      case "facilities":
        facilitiesRef.current?.handleAddNew()
        break
      case "users":
        usersRef.current?.handleAddNew()
        break
      case "sequence":
        sequenceRef.current?.handleAddNew()
        break
    }
  }

  const getButtonLabel = () => {
    switch(activeTab) {
      case "roles":
        return "Add Role"
      case "departments":
        return "Add Department"
      case "facilities":
        return "Add Facility"
      case "users":
        return "Add User"
      case "sequence":
        return "Add Sequence"
      default:
        return "Add"
    }
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <Tabs value={activeTab} className="h-full flex flex-col" onValueChange={setActiveTab}>
        <div className="px-8 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h1 style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: 'var(--text-h3)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)'
            }}>
              Masters
            </h1>
            {activeTab !== "sequence" && (
              <Button onClick={handleAddClick}>
                <Plus className="w-4 h-4 mr-2" />
                {getButtonLabel()}
              </Button>
            )}
          </div>
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="sequence">Sequence</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto px-8 py-6">
          <TabsContent value="roles" className="h-full mt-0">
            <RolesMaster ref={rolesRef} />
          </TabsContent>
          <TabsContent value="departments" className="h-full mt-0">
            <DepartmentsMaster ref={departmentsRef} />
          </TabsContent>
          <TabsContent value="facilities" className="h-full mt-0">
            <FacilitiesMaster ref={facilitiesRef} />
          </TabsContent>
          <TabsContent value="users" className="h-full mt-0">
            <UsersMaster ref={usersRef} />
          </TabsContent>
          <TabsContent value="sequence" className="h-full mt-0">
            <SequenceMaster ref={sequenceRef} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}