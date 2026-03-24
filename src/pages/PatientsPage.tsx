"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  FileText,
  Printer,
  Download,
  Columns,
  GripVertical,
  Lock,
  Unlock,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DateRange } from "react-day-picker";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Badge } from "../app/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../app/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select";
import { DateRangePicker } from "../app/components/ui/date-range-picker";
import { Card, CardContent } from "../app/components/ui/card";
import { Checkbox } from "../app/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../app/components/ui/dropdown-menu";
import { Separator } from "../app/components/ui/separator";
import { format } from "date-fns";
import { toast } from "sonner";
import { ICON_STROKE_WIDTH } from "../lib/constants";

type VisitStatus = "Registered" | "Consulted" | "Pre-Consultation" | "Cancelled";

type Visit = {
  visitId: string;
  uhid: string;
  patientName: string;
  gender: "M" | "F";
  age: { years: number; months: number; days: number };
  visitType: string;
  doctor: string;
  visitCreated: Date;
  status: VisitStatus;
  hasReport: boolean;
};

const REGISTERED_VISITS_STORAGE_KEY = "hims_registered_visits";

type ColumnConfig = {
  id: string;
  label: string;
  visible: boolean;
  locked: boolean;
  fixed: boolean;
};

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "srNo", label: "Sr. No.", visible: true, locked: false, fixed: true },
  { id: "visitId", label: "Visit ID", visible: true, locked: false, fixed: false },
  { id: "uhid", label: "UHID", visible: true, locked: false, fixed: false },
  { id: "patientName", label: "Patient Name", visible: true, locked: false, fixed: true },
  { id: "genderAge", label: "Gender/Age", visible: true, locked: false, fixed: false },
  { id: "visitType", label: "Visit Type", visible: false, locked: false, fixed: false },
  { id: "doctor", label: "Doctor", visible: true, locked: false, fixed: false },
  { id: "visitCreated", label: "Visit Date", visible: false, locked: false, fixed: false },
  { id: "status", label: "Status", visible: true, locked: false, fixed: false },
  { id: "report", label: "Report", visible: false, locked: false, fixed: false },
  { id: "actions", label: "Actions", visible: true, locked: false, fixed: true },
];

const MOCK_VISITS: Visit[] = [
  {
    visitId: "OP2603180007",
    uhid: "ITF-260318000001",
    patientName: "Ayush Wardhan",
    gender: "M",
    age: { years: 25, months: 3, days: 25 },
    visitType: "OPD",
    doctor: "Dr. Doctor User",
    visitCreated: new Date(2026, 2, 18),
    status: "Registered",
    hasReport: false,
  },
  {
    visitId: "OP2603180001",
    uhid: "ITF-260318000001",
    patientName: "Ayush Wardhan",
    gender: "M",
    age: { years: 25, months: 3, days: 25 },
    visitType: "OPD",
    doctor: "Dr. Doctor User",
    visitCreated: new Date(2026, 2, 18),
    status: "Consulted",
    hasReport: true,
  },
  {
    visitId: "OP2603180002",
    uhid: "ITF-260318000007",
    patientName: "Swapnil Patel",
    gender: "M",
    age: { years: 28, months: 6, days: 16 },
    visitType: "OPD",
    doctor: "Dr. Doctor User",
    visitCreated: new Date(2026, 2, 18),
    status: "Registered",
    hasReport: false,
  },
  {
    visitId: "OP2603180003",
    uhid: "ITF-260318000008",
    patientName: "Arpit Agnihotri",
    gender: "M",
    age: { years: 26, months: 11, days: 13 },
    visitType: "OPD",
    doctor: "Dr. Doctor User",
    visitCreated: new Date(2026, 2, 18),
    status: "Pre-Consultation",
    hasReport: false,
  },
  {
    visitId: "OP2603180004",
    uhid: "ITF-260318000009",
    patientName: "Rohit Yadav",
    gender: "M",
    age: { years: 24, months: 8, days: 17 },
    visitType: "OPD",
    doctor: "Dr. Doctor User",
    visitCreated: new Date(2026, 2, 18),
    status: "Registered",
    hasReport: false,
  },
  {
    visitId: "OP2603180005",
    uhid: "ITF-260318000010",
    patientName: "Rajat Kumar Singh",
    gender: "M",
    age: { years: 5, months: 5, days: 8 },
    visitType: "OPD",
    doctor: "Dr. Doctor User",
    visitCreated: new Date(2026, 2, 18),
    status: "Consulted",
    hasReport: true,
  },
  {
    visitId: "OP2603180006",
    uhid: "ITF-260318000011",
    patientName: "Savitri Devi",
    gender: "F",
    age: { years: 71, months: 2, days: 17 },
    visitType: "OPD",
    doctor: "Dr. Doctor User",
    visitCreated: new Date(2026, 2, 18),
    status: "Registered",
    hasReport: false,
  },
  {
    visitId: "OP2603180008",
    uhid: "ITF-260318000012",
    patientName: "Vishal Bais",
    gender: "M",
    age: { years: 25, months: 11, days: 7 },
    visitType: "OPD",
    doctor: "Dr. Doctor User",
    visitCreated: new Date(2026, 2, 18),
    status: "Registered",
    hasReport: false,
  },
];

function DraggableColumnItem({
  column,
  index,
  moveColumn,
  toggleColumn,
  toggleLock,
}: {
  column: ColumnConfig;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  toggleColumn: (id: string) => void;
  toggleLock: (id: string) => void;
}) {
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

  const ref = React.useRef<HTMLDivElement>(null);
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between px-3 py-2 rounded-sm transition-colors ${
        !column.fixed && !column.locked ? "hover:bg-accent cursor-move" : "cursor-default"
      } ${isDragging ? "opacity-50" : ""} ${isOver ? "bg-accent/50" : ""}`}
    >
      <div className="flex items-center gap-2">
        {!column.fixed && !column.locked && (
          <GripVertical className="size-4 text-muted-foreground" />
        )}
        {(column.fixed || column.locked) && <div className="w-4" />}
        <Checkbox
          checked={column.visible}
          disabled={column.locked || column.fixed}
          onCheckedChange={() => toggleColumn(column.id)}
        />
        <span
          className={column.locked || column.fixed ? "text-muted-foreground" : ""}
          style={{ fontSize: "var(--text-sm)" }}
        >
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
          {column.locked ? (
            <Lock className="size-3" />
          ) : (
            <Unlock className="size-3" />
          )}
        </Button>
      )}
      {column.fixed && <div className="w-6" />}
    </div>
  );
}

export function PatientsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(2026, 2, 18),
    to: new Date(2026, 2, 18),
  });
  const [doctorFilter, setDoctorFilter] = React.useState("");
  const [genderFilter, setGenderFilter] = React.useState("");
  const [ageGroupFilter, setAgeGroupFilter] = React.useState("");
  const [visitTypeFilter, setVisitTypeFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [columns, setColumns] = React.useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [storedVisits, setStoredVisits] = React.useState<Visit[]>([]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const raw = window.localStorage.getItem(REGISTERED_VISITS_STORAGE_KEY);
    if (!raw) {
      setStoredVisits([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Array<Omit<Visit, "visitCreated"> & { visitCreated: string }>;
      setStoredVisits(
        parsed.map((visit) => ({
          ...visit,
          visitCreated: new Date(visit.visitCreated),
        }))
      );
    } catch {
      setStoredVisits([]);
    }
  }, []);

  const visits = React.useMemo(() => [...storedVisits, ...MOCK_VISITS], [storedVisits]);

  const visibleColumns = React.useMemo(
    () => columns.filter((col) => col.visible),
    [columns]
  );

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === id && !col.locked && !col.fixed) {
          return { ...col, visible: !col.visible };
        }
        return col;
      })
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

  const resetColumns = () => {
    setColumns([...DEFAULT_COLUMNS]);
    toast.success("Column configuration reset to default");
  };

  const getStatusBadgeConfig = (status: VisitStatus) => {
    switch (status) {
      case "Registered":
        return {
          variant: "default" as const,
          className:
            "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400",
        };
      case "Consulted":
        return {
          variant: "default" as const,
          className:
            "bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-500/20 dark:text-green-400",
        };
      case "Pre-Consultation":
        return {
          variant: "secondary" as const,
          className:
            "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400",
        };
      case "Cancelled":
        return {
          variant: "destructive" as const,
          className:
            "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
        };
    }
  };

  const formatAge = (age: { years: number; months: number; days: number }) => {
    if (age.years > 1) {
      return `${age.years} Y`;
    }
    return `${age.years} Years ${age.months} Months ${age.days} Days`;
  };

  const renderCell = (columnId: string, visit: Visit, index: number) => {
    switch (columnId) {
      case "srNo":
        return (
          <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {index + 1}
          </TableCell>
        );
      case "visitId":
        return (
          <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {visit.visitId}
          </TableCell>
        );
      case "uhid":
        return (
          <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {visit.uhid}
          </TableCell>
        );
      case "patientName":
        return (
          <TableCell>
            <button
              onClick={() => navigate(`/patients/${visit.visitId}`)}
              className="text-primary hover:underline"
              style={{ fontSize: "var(--text-base)" }}
            >
              {visit.patientName}
            </button>
          </TableCell>
        );
      case "genderAge":
        return (
          <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {visit.gender}, {formatAge(visit.age)}
          </TableCell>
        );
      case "visitType":
        return (
          <TableCell style={{ fontSize: "var(--text-base)" }}>
            {visit.visitType}
          </TableCell>
        );
      case "doctor":
        return (
          <TableCell style={{ fontSize: "var(--text-base)" }}>
            {visit.doctor}
          </TableCell>
        );
      case "visitCreated":
        return (
          <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {format(visit.visitCreated, "dd-MMM-yy")}
          </TableCell>
        );
      case "status":
        const statusConfig = getStatusBadgeConfig(visit.status);
        return (
          <TableCell>
            <Badge
              variant={statusConfig.variant}
              className={statusConfig.className}
              style={{ fontSize: "var(--text-xs)" }}
            >
              {visit.status}
            </Badge>
          </TableCell>
        );
      case "report":
        return (
          <TableCell>
            {visit.hasReport ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.info("Print report functionality coming soon")}
                style={{ fontSize: "var(--text-sm)" }}
              >
                <Printer className="mr-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
                Print
              </Button>
            ) : (
              <span className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
                —
              </span>
            )}
          </TableCell>
        );
      case "actions":
        return (
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" style={{ fontSize: "var(--text-sm)" }}>
                  Actions
                  <ChevronDown className="ml-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background text-foreground">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    disabled={!visit.hasReport}
                    className={!visit.hasReport ? "text-muted-foreground opacity-60 cursor-not-allowed" : ""}
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    <Printer className="mr-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
                    {visit.hasReport ? "Print Report" : "Print Report (Unavailable)"}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-background text-foreground">
                    <DropdownMenuItem
                      onClick={() => toast.info("Printing Diagnostic Report...")}
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      Diagnostic Report Record
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toast.info("Printing OP Consultation Note...")}
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      OP Consultation Note
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toast.info("Printing Prescription Record...")}
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      Prescription Record
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toast.info("Printing Immunization Record...")}
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      Immunization Record
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem
                  onClick={() => toast.info("Reprint bill receipt functionality coming soon")}
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  <FileText className="mr-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
                  Reprint Bill Receipt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        );
      default:
        return null;
    }
  };

  const renderHeader = (columnId: string) => {
    switch (columnId) {
      case "srNo":
        return (
          <TableHead className="w-[80px]" style={{ fontSize: "var(--text-sm)" }}>
            Sr. No.
          </TableHead>
        );
      case "genderAge":
      case "visitCreated":
        return (
          <TableHead className="font-mono" style={{ fontSize: "var(--text-sm)" }}>
            {columns.find((col) => col.id === columnId)?.label}
          </TableHead>
        );
      default:
        return (
          <TableHead style={{ fontSize: "var(--text-sm)" }}>
            {columns.find((col) => col.id === columnId)?.label}
          </TableHead>
        );
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1
            className="font-semibold"
            style={{
              fontSize: "var(--text-h4)",
              fontWeight: "var(--font-weight-semibold)",
            }}
          >
            Patients
          </h1>
          <Button size="default" onClick={() => navigate("/register-patient")}>
            <Plus className="mr-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
            Register Patient
          </Button>
        </div>

        {/* Statistics Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex flex-col gap-1">
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Total Visits
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    fontSize: "var(--text-h2)",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  0
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex flex-col gap-1">
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Doctor Pending Reviews
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    fontSize: "var(--text-h2)",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  0
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex flex-col gap-1">
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Cancelled
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    fontSize: "var(--text-h2)",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  0
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex flex-col gap-1">
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Doctor Reviewed
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    fontSize: "var(--text-h2)",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  0
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Picker */}
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />

          {/* Search Input */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Name/UHID/Phone/Visit ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-border"
              style={{ fontSize: "var(--text-sm)" }}
            />
          </div>

          {/* Doctor Filter */}
          <Select value={doctorFilter} onValueChange={setDoctorFilter}>
            <SelectTrigger className="w-[160px] border-border bg-input-background">
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground">
              <SelectItem value="all">All Doctors</SelectItem>
              <SelectItem value="dr-user">Dr. Doctor User</SelectItem>
            </SelectContent>
          </Select>

          {/* Gender Filter */}
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-[140px] border-border bg-input-background">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
            </SelectContent>
          </Select>

          {/* Age Group Filter */}
          <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
            <SelectTrigger className="w-[160px] border-border bg-input-background">
              <SelectValue placeholder="Age Group" />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground">
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="0-18">0-18 Years</SelectItem>
              <SelectItem value="19-40">19-40 Years</SelectItem>
              <SelectItem value="41-60">41-60 Years</SelectItem>
              <SelectItem value="60+">60+ Years</SelectItem>
            </SelectContent>
          </Select>

          {/* Visit Type Filter */}
          <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
            <SelectTrigger className="w-[160px] border-border bg-input-background">
              <SelectValue placeholder="Visit Type" />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="OPD">OPD</SelectItem>
              <SelectItem value="IPD">IPD</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] border-border bg-input-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Registered">Registered</SelectItem>
              <SelectItem value="Consulted">Consulted</SelectItem>
              <SelectItem value="Pre-Consultation">Pre-Consultation</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Export and Column Customization */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => toast.info("Export functionality coming soon")}
              style={{ fontSize: "var(--text-sm)" }}
            >
              <Download className="mr-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" style={{ fontSize: "var(--text-sm)" }}>
                  <Columns className="mr-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
                  Columns
                  <ChevronDown className="ml-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
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
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => (
                  <React.Fragment key={column.id}>
                    {renderHeader(column.id)}
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit, index) => (
                <TableRow key={visit.visitId}>
                  {visibleColumns.map((column) => (
                    <React.Fragment key={column.id}>
                      {renderCell(column.id, visit, index)}
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Info */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
            Showing {visits.length} of {visits.length} visits
          </p>
        </div>
      </div>
    </DndProvider>
  );
}

export default PatientsPage;