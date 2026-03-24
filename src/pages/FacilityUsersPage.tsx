"use client";

import * as React from "react";
import { ChevronDown, Plus, Search, Pencil, GripVertical, Lock, Unlock, Upload, ArrowLeft } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Switch } from "../app/components/ui/switch";
import { Checkbox } from "../app/components/ui/checkbox";
import { Separator } from "../app/components/ui/separator";
import { Badge } from "../app/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../app/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../app/components/ui/table";
import { toast } from "sonner";
import { useUsers } from "../contexts/UsersContext";

type FacilityUser = {
  id: string;
  active: boolean;
  employeeName: string;
  employeeId: string;
  phoneNumber: string;
  role: "FRONTDESK" | "DOCTOR" | "NURSE";
  username: string;
  department: string;
  departments?: string[]; // Array of all departments for this user
  hprId: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
};

type ColumnConfig = {
  id: string;
  label: string;
  visible: boolean;
  locked: boolean;
  fixed: boolean;
};

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "slNo", label: "Sl.No", visible: true, locked: false, fixed: true },
  { id: "active", label: "Active", visible: true, locked: false, fixed: false },
  { id: "employeeName", label: "Employee Name", visible: true, locked: false, fixed: true },
  { id: "employeeId", label: "Employee ID", visible: true, locked: false, fixed: false },
  { id: "phoneNumber", label: "Phone number", visible: true, locked: false, fixed: false },
  { id: "role", label: "Role", visible: true, locked: false, fixed: false },
  { id: "username", label: "Username", visible: true, locked: false, fixed: false },
  { id: "department", label: "Department", visible: true, locked: false, fixed: false },
  { id: "hprId", label: "HPR ID", visible: true, locked: false, fixed: false },
  { id: "createdBy", label: "Created By", visible: false, locked: false, fixed: false },
  { id: "createdAt", label: "Created at", visible: false, locked: false, fixed: false },
  { id: "lastModified", label: "Last Modified", visible: false, locked: false, fixed: false },
  { id: "actions", label: "Actions", visible: true, locked: false, fixed: true },
];

const FACILITIES = {
  "1": "Main Hospital",
  "2": "East Wing Clinic",
  "3": "North Diagnostic Center",
};

interface DraggableColumnItemProps {
  column: ColumnConfig;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  toggleColumn: (id: string) => void;
  toggleLock: (id: string) => void;
}

function DraggableColumnItem({ column, index, moveColumn, toggleColumn, toggleLock }: DraggableColumnItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { index },
    canDrag: !column.locked && !column.fixed,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COLUMN",
    canDrop: () => !column.fixed,
    hover: (item: { index: number }) => {
      if (item.index !== index && !column.fixed) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={(node) => {
        if (!column.fixed) {
          drag(drop(node));
        }
      }}
      className={`flex items-center justify-between px-3 py-2 hover:bg-accent rounded-sm transition-colors ${
        isDragging ? "opacity-50" : ""
      } ${isOver ? "bg-accent/50" : ""} ${!column.locked && !column.fixed ? "cursor-move" : "cursor-default"}`}
    >
      <div className="flex items-center gap-2">
        {!column.locked && !column.fixed ? (
          <GripVertical className="size-4 text-muted-foreground" />
        ) : (
          <div className="size-4" />
        )}
        <Checkbox
          checked={column.visible}
          onCheckedChange={() => toggleColumn(column.id)}
          disabled={column.locked || column.fixed}
          style={{ fontSize: "var(--text-sm)" }}
        />
        <span className={column.locked || column.fixed ? "text-muted-foreground" : ""} style={{ fontSize: "var(--text-sm)" }}>
          {column.label}
        </span>
      </div>
      {!column.fixed && (
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={() => toggleLock(column.id)}
        >
          {column.locked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
        </Button>
      )}
      {column.fixed && <div className="size-6" />}
    </div>
  );
}

export default function FacilityUsersPage() {
  const navigate = useNavigate();
  const { facilityId } = useParams<{ facilityId: string }>();
  const { users: allUsers } = useUsers();
  const [columns, setColumns] = React.useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [createdByFilter, setCreatedByFilter] = React.useState<string>("all");

  const facilityName = facilityId ? FACILITIES[facilityId as keyof typeof FACILITIES] : "";
  
  // Map users from context to facility users format
  const users = React.useMemo(() => {
    return allUsers
      .filter((user) => user.facilityId === facilityId)
      .map((user) => ({
        id: user.id,
        active: true,
        employeeName: user.fullName,
        employeeId: user.employeeId,
        phoneNumber: user.mobileNumber,
        role: user.role as "FRONTDESK" | "DOCTOR" | "NURSE",
        username: user.username,
        department: user.departments && user.departments.length > 0 ? user.departments[0] : "-",
        departments: user.departments || [],
        hprId: user.hprId || "-",
        createdBy: user.createdBy,
        createdAt: user.createdAt,
        lastModified: user.lastModifiedBy,
      }));
  }, [allUsers, facilityId]);

  const visibleColumns = columns.filter((col) => col.visible);

  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    setColumns((prev) => {
      const newColumns = [...prev];
      const draggedColumn = newColumns[dragIndex];
      const targetColumn = newColumns[hoverIndex];

      if (draggedColumn.fixed || targetColumn.fixed) {
        return prev;
      }

      const [movedColumn] = newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, movedColumn);
      return newColumns;
    });
  };

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id && !col.locked && !col.fixed ? { ...col, visible: !col.visible } : col))
    );
  };

  const toggleLock = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === id && !col.fixed) {
          return { ...col, locked: !col.locked };
        }
        return col;
      })
    );
  };

  const resetColumns = () => {
    setColumns([...DEFAULT_COLUMNS]);
    toast.success("Column configuration reset to default");
  };

  const handleBack = () => {
    navigate("/masters");
  };

  const handleAddUser = () => {
    navigate(`/masters/facilities/${facilityId}/users/add`);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/masters/facilities/${facilityId}/users/edit/${userId}`);
  };

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "DOCTOR":
        return "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400";
      case "NURSE":
        return "bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-500/20 dark:text-green-400";
      case "FRONTDESK":
        return "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400";
      default:
        return "";
    }
  };

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesCreatedBy = createdByFilter === "all" || user.createdBy === createdByFilter;

      return matchesSearch && matchesDepartment && matchesRole && matchesCreatedBy;
    });
  }, [users, searchQuery, departmentFilter, roleFilter, createdByFilter]);

  const departments = Array.from(new Set(users.map((u) => u.department)));
  const roles = Array.from(new Set(users.map((u) => u.role)));
  const creators = Array.from(new Set(users.map((u) => u.createdBy)));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-6 space-y-4">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Back">
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex-1">
            <h1 style={{ fontSize: "var(--text-h4)", fontWeight: "var(--font-weight-semibold)" }}>
              User Management
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
              {facilityName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Bulk Upload */}
            <Button variant="outline" className="gap-2">
              <Upload className="size-4" />
              <span style={{ fontSize: "var(--text-sm)" }}>Bulk Upload</span>
            </Button>

            {/* Add New User */}
            <Button className="gap-2" onClick={handleAddUser}>
              <Plus className="size-4" />
              <span style={{ fontSize: "var(--text-sm)" }}>Add New User</span>
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by User Name/ Employee ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border border-border"
                style={{ fontSize: "var(--text-sm)" }}
              />
            </div>

            {/* Department Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span style={{ fontSize: "var(--text-sm)" }}>Department</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setDepartmentFilter("all")}>
                  All Departments
                </DropdownMenuItem>
                {departments.map((dept) => (
                  <DropdownMenuItem key={dept} onClick={() => setDepartmentFilter(dept)}>
                    {dept}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Role Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span style={{ fontSize: "var(--text-sm)" }}>Role</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
                {roles.map((role) => (
                  <DropdownMenuItem key={role} onClick={() => setRoleFilter(role)}>
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Created By Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span style={{ fontSize: "var(--text-sm)" }}>Created By</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setCreatedByFilter("all")}>All</DropdownMenuItem>
                {creators.map((creator) => (
                  <DropdownMenuItem key={creator} onClick={() => setCreatedByFilter(creator)}>
                    {creator}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span style={{ fontSize: "var(--text-sm)" }}>Columns</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-2 space-y-1">
                  {columns.map((column, index) => (
                    <DraggableColumnItem
                      key={column.id}
                      column={column}
                      index={index}
                      moveColumn={moveColumn}
                      toggleColumn={toggleColumn}
                      toggleLock={toggleLock}
                    />
                  ))}
                </div>
                <Separator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={resetColumns}
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    Reset to Default
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md overflow-auto relative">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={`${
                      column.id === "phoneNumber" ||
                      column.id === "createdAt"
                        ? "text-right"
                        : column.id === "actions"
                        ? "text-center sticky right-0 bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.id}>
                  {visibleColumns.map((column) => {
                    if (column.id === "slNo") {
                      return (
                        <TableCell key={column.id} style={{ fontSize: "var(--text-base)" }}>
                          {index + 1}
                        </TableCell>
                      );
                    }
                    if (column.id === "active") {
                      return (
                        <TableCell key={column.id}>
                          <Switch checked={user.active} />
                        </TableCell>
                      );
                    }
                    if (column.id === "employeeName") {
                      return (
                        <TableCell key={column.id} style={{ fontSize: "var(--text-base)" }}>
                          {user.employeeName}
                        </TableCell>
                      );
                    }
                    if (column.id === "employeeId") {
                      return (
                        <TableCell key={column.id} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
                          {user.employeeId}
                        </TableCell>
                      );
                    }
                    if (column.id === "phoneNumber") {
                      return (
                        <TableCell key={column.id} className="text-right font-mono" style={{ fontSize: "var(--text-base)" }}>
                          {user.phoneNumber}
                        </TableCell>
                      );
                    }
                    if (column.id === "role") {
                      return (
                        <TableCell key={column.id}>
                          <Badge variant="default" className={getRoleBadgeStyles(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                      );
                    }
                    if (column.id === "username") {
                      return (
                        <TableCell key={column.id} style={{ fontSize: "var(--text-base)" }}>
                          {user.username}
                        </TableCell>
                      );
                    }
                    if (column.id === "department") {
                      const depts = user.departments || [];
                      const departmentNames = depts.length > 0 ? depts.join(", ") : "-";
                      return (
                        <TableCell key={column.id} style={{ fontSize: "var(--text-base)" }}>
                          {departmentNames}
                        </TableCell>
                      );
                    }
                    if (column.id === "hprId") {
                      return (
                        <TableCell key={column.id} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
                          {user.hprId || "-"}
                        </TableCell>
                      );
                    }
                    if (column.id === "createdBy") {
                      return (
                        <TableCell key={column.id} style={{ fontSize: "var(--text-base)" }}>
                          {user.createdBy}
                        </TableCell>
                      );
                    }
                    if (column.id === "createdAt") {
                      return (
                        <TableCell key={column.id} className="text-right font-mono" style={{ fontSize: "var(--text-base)" }}>
                          {user.createdAt}
                        </TableCell>
                      );
                    }
                    if (column.id === "lastModified") {
                      return (
                        <TableCell key={column.id} style={{ fontSize: "var(--text-base)" }}>
                          {user.lastModified}
                        </TableCell>
                      );
                    }
                    if (column.id === "actions") {
                      return (
                        <TableCell key={column.id} className="text-center sticky right-0 bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
                          <Button variant="ghost" size="icon" aria-label="Edit User" className="relative z-20" onClick={() => handleEditUser(user.id)}>
                            <Pencil className="size-4" />
                          </Button>
                        </TableCell>
                      );
                    }
                    return null;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
            Showing 1-{filteredUsers.length} of {filteredUsers.length}
          </p>
        </div>
      </div>
    </DndProvider>
  );
}