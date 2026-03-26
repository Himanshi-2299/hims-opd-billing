import * as React from "react";
import { 
  ChevronDown, 
  GripVertical, 
  Lock, 
  Pencil, 
  Plus, 
  Search, 
  Unlock, 
  Upload 
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Switch } from "../app/components/ui/switch";
import { Checkbox } from "../app/components/ui/checkbox";
import { Separator } from "../app/components/ui/separator";
import { Badge } from "../app/components/ui/badge";
import { Label } from "../app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select";
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

type Facility = {
  id: string;
  active: boolean;
  facilityId: string;
  facilityName: string;
  emailId: string;
  address: string;
  facilityType: "private" | "government";
  registrationCharges: number;
  emergencyCharges: number;
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
};

type User = {
  id: string;
  facilityId: string;
  name: string;
  emailId: string;
  address: string;
  consultationCharges: number;
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
};

type UhidLetterKind = "numeric" | "alphanumeric" | "both";

type Sequence = {
  id: string;
  facilityName: string;
  tenantId: string;
  outpatientPrefix: string;
  inpatientPrefix: string;
  emergencyPrefix: string;
  status: "configured" | "inactive";
  configuredDate: string;
  configuredTime: string;
  uhidUseDefault?: boolean;
  uhidIncludeDate?: boolean;
  uhidIncludeLetters?: boolean;
  uhidLetterKind?: UhidLetterKind;
  uhidLetterCount?: number;
  uhidIncludePrefix?: boolean;
  uhidPrefix?: string;
  uhidIncludeTenantId?: boolean;
  uhidTenantIdSegment?: string;
};

function defaultUhidFormatString(tenantId: string): string {
  return `YYMMDD${tenantId}XXXXXXX`;
}

function buildUhidCustomPreview(params: {
  includeDate: boolean;
  includeLetters: boolean;
  letterKind: UhidLetterKind;
  letterCount: number;
  includePrefix: boolean;
  prefix: string;
  includeTenantId: boolean;
  tenantIdSegment: string;
}): string {
  const parts: string[] = [];
  if (params.includePrefix && params.prefix.trim()) {
    parts.push(params.prefix.trim());
  }
  if (params.includeDate) {
    parts.push("YYMMDD");
  }
  if (params.includeTenantId && params.tenantIdSegment.trim()) {
    parts.push(params.tenantIdSegment.trim());
  }
  if (params.includeLetters && params.letterCount > 0) {
    const n = Math.min(Math.max(1, Math.floor(params.letterCount)), 32);
    const placeholder =
      params.letterKind === "numeric"
        ? "X".repeat(n)
        : params.letterKind === "alphanumeric"
          ? "A".repeat(n)
          : "*".repeat(n);
    parts.push(placeholder);
  }
  return parts.length > 0 ? parts.join("-") : "";
}

function buildUhidExampleString(params: {
  useDefault: boolean;
  tenantId: string;
  includeDate: boolean;
  includeLetters: boolean;
  letterKind: UhidLetterKind;
  letterCount: number;
  includePrefix: boolean;
  prefix: string;
  includeTenantId: boolean;
  tenantIdSegment: string;
}): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const ymd = `${yy}${mm}${dd}`;
  const tenant = String(params.tenantId || "").padStart(5, "0");

  if (params.useDefault) {
    return `${ymd}${tenant}0000001`;
  }

  const parts: string[] = [];
  if (params.includePrefix && params.prefix.trim()) {
    parts.push(params.prefix.trim());
  }
  if (params.includeDate) {
    parts.push(ymd);
  }
  if (params.includeTenantId && params.tenantIdSegment.trim()) {
    parts.push(params.tenantIdSegment.trim());
  }
  if (params.includeLetters && params.letterCount > 0) {
    const n = Math.min(Math.max(1, Math.floor(params.letterCount)), 32);
    let seq = "";
    if (params.letterKind === "numeric") {
      seq = "1".padStart(n, "0");
    } else if (params.letterKind === "alphanumeric") {
      seq = ("A1".repeat(Math.ceil(n / 2))).slice(0, n);
    } else {
      seq = ("A1".repeat(Math.ceil(n / 2))).slice(0, n);
    }
    parts.push(seq);
  }
  return parts.length > 0 ? parts.join("-") : "—";
}

const FACILITIES: Facility[] = [
  {
    id: "1",
    active: true,
    facilityId: "FAC001",
    facilityName: "Main Hospital",
    emailId: "main@hospital.com",
    address: "123 Medical Center Dr, New York, NY 10001",
    facilityType: "private",
    registrationCharges: 100,
    emergencyCharges: 50,
    createdBy: "John Doe",
    createdAt: "15-JAN-25, 09:30 AM",
    lastModifiedBy: "Jane Smith",
    lastModifiedAt: "20-FEB-25, 02:15 PM",
  },
  {
    id: "2",
    active: true,
    facilityId: "FAC002",
    facilityName: "East Wing Clinic",
    emailId: "eastwing@hospital.com",
    address: "456 Healthcare Ave, Brooklyn, NY 11201",
    facilityType: "private",
    registrationCharges: 75,
    emergencyCharges: 30,
    createdBy: "Sarah Johnson",
    createdAt: "10-FEB-25, 11:00 AM",
    lastModifiedBy: "Sarah Johnson",
    lastModifiedAt: "18-FEB-25, 04:30 PM",
  },
  {
    id: "3",
    active: false,
    facilityId: "FAC003",
    facilityName: "North Diagnostic Center",
    emailId: "north@diagnostics.com",
    address: "789 Wellness Blvd, Queens, NY 11375",
    facilityType: "government",
    registrationCharges: 50,
    emergencyCharges: 20,
    createdBy: "Michael Chen",
    createdAt: "05-FEB-25, 10:15 AM",
    lastModifiedBy: "Michael Chen",
    lastModifiedAt: "10-FEB-25, 03:45 PM",
  },
  {
    id: "4",
    active: true,
    facilityId: "FAC004",
    facilityName: "South Emergency Unit",
    emailId: "emergency@hospital.com",
    address: "321 Emergency Ln, Manhattan, NY 10002",
    facilityType: "private",
    registrationCharges: 120,
    emergencyCharges: 60,
    createdBy: "Emily Rodriguez",
    createdAt: "01-MAR-25, 08:00 AM",
    lastModifiedBy: "Emily Rodriguez",
    lastModifiedAt: "12-MAR-25, 01:20 PM",
  },
  {
    id: "5",
    active: true,
    facilityId: "FAC005",
    facilityName: "West Pediatric Center",
    emailId: "pediatrics@hospital.com",
    address: "567 Children's Way, Bronx, NY 10451",
    facilityType: "private",
    registrationCharges: 80,
    emergencyCharges: 40,
    createdBy: "David Kim",
    createdAt: "12-FEB-25, 02:30 PM",
    lastModifiedBy: "Lisa Wong",
    lastModifiedAt: "25-FEB-25, 11:10 AM",
  },
];

// Users data moved to UsersContext

const SEQUENCES: Sequence[] = [
  {
    id: "1",
    facilityName: "Main Hospital",
    tenantId: "00001",
    outpatientPrefix: "OP",
    inpatientPrefix: "IP",
    emergencyPrefix: "EM",
    status: "configured",
    configuredDate: "15-JAN-25",
    configuredTime: "09:30 AM",
  },
  {
    id: "2",
    facilityName: "East Wing Clinic",
    tenantId: "00002",
    outpatientPrefix: "OP",
    inpatientPrefix: "IP",
    emergencyPrefix: "EM",
    status: "configured",
    configuredDate: "10-FEB-25",
    configuredTime: "11:00 AM",
  },
  {
    id: "3",
    facilityName: "North Diagnostic Center",
    tenantId: "00003",
    outpatientPrefix: "OP",
    inpatientPrefix: "IP",
    emergencyPrefix: "EM",
    status: "inactive",
    configuredDate: "05-FEB-25",
    configuredTime: "10:15 AM",
  },
  {
    id: "4",
    facilityName: "South Emergency Unit",
    tenantId: "00004",
    outpatientPrefix: "OP",
    inpatientPrefix: "IP",
    emergencyPrefix: "EM",
    status: "configured",
    configuredDate: "01-MAR-25",
    configuredTime: "08:00 AM",
  },
  {
    id: "5",
    facilityName: "West Pediatric Center",
    tenantId: "00005",
    outpatientPrefix: "OP",
    inpatientPrefix: "IP",
    emergencyPrefix: "EM",
    status: "configured",
    configuredDate: "12-FEB-25",
    configuredTime: "02:30 PM",
  },
];

type ColumnConfig = {
  id: string;
  label: string;
  visible: boolean;
  locked: boolean;
  fixed: boolean;
};

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "srNo", label: "Sr. No.", visible: true, locked: false, fixed: true },
  { id: "active", label: "Active", visible: true, locked: true, fixed: false },
  { id: "facilityId", label: "Facility ID", visible: true, locked: true, fixed: false },
  { id: "facilityName", label: "Facility Name", visible: true, locked: true, fixed: false },
  { id: "facilityType", label: "Facility Type", visible: true, locked: true, fixed: false },
  { id: "emailId", label: "Email ID", visible: true, locked: true, fixed: false },
  { id: "registrationCharges", label: "Registration Charges", visible: true, locked: true, fixed: false },
  { id: "emergencyCharges", label: "Emergency Charges", visible: true, locked: true, fixed: false },
  { id: "createdBy", label: "Created By", visible: false, locked: false, fixed: false },
  { id: "createdAt", label: "Created At", visible: false, locked: false, fixed: false },
  { id: "lastModifiedBy", label: "Last Modified By", visible: false, locked: false, fixed: false },
  { id: "lastModifiedAt", label: "Last Modified At", visible: false, locked: false, fixed: false },
  { id: "address", label: "Address", visible: true, locked: true, fixed: false },
  { id: "actions", label: "Actions", visible: true, locked: false, fixed: true },
];

const DEFAULT_USER_COLUMNS: ColumnConfig[] = [
  { id: "srNo", label: "Sr. No.", visible: true, locked: false, fixed: true },
  { id: "facilityId", label: "Facility ID", visible: true, locked: true, fixed: false },
  { id: "name", label: "Name", visible: true, locked: true, fixed: true },
  { id: "emailId", label: "Email ID", visible: true, locked: true, fixed: false },
  { id: "address", label: "Address", visible: true, locked: true, fixed: false },
  { id: "createdBy", label: "Created By", visible: false, locked: false, fixed: false },
  { id: "createdAt", label: "Created At", visible: false, locked: false, fixed: false },
  { id: "lastModifiedBy", label: "Last Modified By", visible: false, locked: false, fixed: false },
  { id: "lastModifiedAt", label: "Last Modified At", visible: false, locked: false, fixed: false },
  { id: "actions", label: "Actions", visible: true, locked: false, fixed: true },
];

const DEFAULT_SEQUENCE_COLUMNS: ColumnConfig[] = [
  { id: "srNo", label: "Sr. No.", visible: true, locked: false, fixed: true },
  { id: "facilityName", label: "Facility Name", visible: true, locked: true, fixed: false },
  { id: "tenantId", label: "Tenant ID", visible: true, locked: true, fixed: false },
  { id: "outpatientPrefix", label: "Outpatient Prefix", visible: true, locked: true, fixed: false },
  { id: "inpatientPrefix", label: "Inpatient Prefix", visible: true, locked: true, fixed: false },
  { id: "emergencyPrefix", label: "Emergency Prefix", visible: true, locked: true, fixed: false },
  { id: "status", label: "Status", visible: true, locked: true, fixed: false },
  { id: "configuredDate", label: "Configured Date", visible: true, locked: true, fixed: false },
  { id: "configuredTime", label: "Configured Time", visible: true, locked: true, fixed: false },
  { id: "actions", label: "Actions", visible: true, locked: false, fixed: true },
];

interface DraggableColumnItemProps {
  column: ColumnConfig;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  toggleColumn: (id: string) => void;
  toggleLock: (id: string) => void;
}

const DraggableColumnItem: React.FC<DraggableColumnItemProps> = ({
  column,
  index,
  moveColumn,
  toggleColumn,
  toggleLock,
}) => {
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
        !column.locked && !column.fixed ? "hover:bg-accent cursor-move" : "cursor-default"
      } ${isDragging ? "opacity-50" : ""} ${isOver && !column.fixed ? "bg-accent/50" : ""}`}
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
          {column.locked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
        </Button>
      )}
    </div>
  );
};

export function CustomerManagementPage() {
  const navigate = useNavigate();
  const { users } = useUsers();
  const [activeTab, setActiveTab] = React.useState<"roles" | "departments" | "facilities" | "users" | "sequence">(() => {
    // Initialize from URL hash if present
    const hash = window.location.hash.replace("#", "");
    if (["roles", "departments", "facilities", "users", "sequence"].includes(hash)) {
      return hash as "roles" | "departments" | "facilities" | "users" | "sequence";
    }
    return "facilities";
  });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [facilities, setFacilities] = React.useState<Facility[]>(FACILITIES);
  const [columns, setColumns] = React.useState<ColumnConfig[]>(DEFAULT_COLUMNS);

  const [userColumns, setUserColumns] = React.useState<ColumnConfig[]>(DEFAULT_USER_COLUMNS);
  const [userSearchQuery, setUserSearchQuery] = React.useState("");

  const [sequences, setSequences] = React.useState<Sequence[]>(SEQUENCES);
  const [sequenceColumns, setSequenceColumns] = React.useState<ColumnConfig[]>(DEFAULT_SEQUENCE_COLUMNS);
  const [sequenceSearchQuery, setSequenceSearchQuery] = React.useState("");

  // Edit Sequence Modal State
  const [editSequenceModalOpen, setEditSequenceModalOpen] = React.useState(false);
  const [editingSequence, setEditingSequence] = React.useState<Sequence | null>(null);
  const [uhidPrefixError, setUhidPrefixError] = React.useState("");
  const [sequenceFormData, setSequenceFormData] = React.useState({
    facilityName: "",
    tenantId: "",
    uhidUseDefault: true,
    uhidIncludeDate: false,
    uhidIncludeLetters: false,
    uhidLetterKind: "numeric" as UhidLetterKind,
    uhidLetterCount: 7,
    uhidIncludePrefix: false,
    uhidPrefix: "",
    uhidIncludeTenantId: false,
    uhidTenantIdSegment: "",
    billNoPrefix: "",
    billNoFormat: "",
    visitConfigs: [
      { slNo: 1, visitType: "Outpatient (OP)", prefix: "OP", format: "OPYYMMDDDXXXX", active: true },
      { slNo: 2, visitType: "Inpatient (IP)", prefix: "IP", format: "", active: false },
      { slNo: 3, visitType: "Emergency (ER)", prefix: "ER", format: "", active: false },
    ],
  });

  // Update URL hash when tab changes
  React.useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // For Users tab, we show facilities (the list of facilities whose users can be managed)
  const usersFacilities = facilities;

  const toggleColumn = (id: string) => {
    if (activeTab === "facilities") {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === id && !col.locked && !col.fixed ? { ...col, visible: !col.visible } : col
        )
      );
    } else if (activeTab === "users") {
      setUserColumns((prev) =>
        prev.map((col) =>
          col.id === id && !col.locked && !col.fixed ? { ...col, visible: !col.visible } : col
        )
      );
    } else if (activeTab === "sequence") {
      setSequenceColumns((prev) =>
        prev.map((col) =>
          col.id === id && !col.locked && !col.fixed ? { ...col, visible: !col.visible } : col
        )
      );
    }
  };

  const toggleLock = (id: string) => {
    if (activeTab === "facilities") {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === id && !col.fixed) {
            return { ...col, locked: !col.locked };
          }
          return col;
        })
      );
    } else if (activeTab === "users") {
      setUserColumns((prev) =>
        prev.map((col) => {
          if (col.id === id && !col.fixed) {
            return { ...col, locked: !col.locked };
          }
          return col;
        })
      );
    } else if (activeTab === "sequence") {
      setSequenceColumns((prev) =>
        prev.map((col) => {
          if (col.id === id && !col.fixed) {
            return { ...col, locked: !col.locked };
          }
          return col;
        })
      );
    }
  };

  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    if (activeTab === "facilities") {
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
    } else if (activeTab === "users") {
      setUserColumns((prev) => {
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
    } else if (activeTab === "sequence") {
      setSequenceColumns((prev) => {
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
    }
  };

  const resetColumns = () => {
    if (activeTab === "facilities") {
      setColumns([...DEFAULT_COLUMNS]);
      toast.success("Column configuration reset to default");
    } else if (activeTab === "users") {
      setUserColumns([...DEFAULT_USER_COLUMNS]);
      toast.success("Column configuration reset to default");
    } else if (activeTab === "sequence") {
      setSequenceColumns([...DEFAULT_SEQUENCE_COLUMNS]);
      toast.success("Column configuration reset to default");
    }
  };

  const handleAddNew = () => {
    switch (activeTab) {
      case "facilities":
        navigate("/facilities/add");
        break;
      case "roles":
        // TODO: Add role functionality
        toast.info("Add Role functionality coming soon");
        break;
      case "departments":
        // TODO: Add department functionality
        toast.info("Add Department functionality coming soon");
        break;
      case "users":
        // TODO: Add user functionality
        toast.info("Add User functionality coming soon");
        break;
      default:
        break;
    }
  };

  const toggleFacilityActive = (id: string) => {
    setFacilities((prev) =>
      prev.map((facility) =>
        facility.id === id ? { ...facility, active: !facility.active } : facility
      )
    );
  };

  const filteredFacilities = React.useMemo(() => {
    let filtered = facilities;

    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.facilityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.emailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [facilities, searchQuery]);

  const filteredUsers = React.useMemo(() => {
    let filtered = usersFacilities;

    if (userSearchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.facilityId.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
          f.facilityName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
          f.emailId.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
          f.address.toLowerCase().includes(userSearchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [usersFacilities, userSearchQuery]);

  const filteredSequences = React.useMemo(() => {
    let filtered = sequences;

    if (sequenceSearchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.facilityName.toLowerCase().includes(sequenceSearchQuery.toLowerCase()) ||
          f.tenantId.toLowerCase().includes(sequenceSearchQuery.toLowerCase()) ||
          f.outpatientPrefix.toLowerCase().includes(sequenceSearchQuery.toLowerCase()) ||
          f.inpatientPrefix.toLowerCase().includes(sequenceSearchQuery.toLowerCase()) ||
          f.emergencyPrefix.toLowerCase().includes(sequenceSearchQuery.toLowerCase()) ||
          f.status.toLowerCase().includes(sequenceSearchQuery.toLowerCase()) ||
          f.configuredDate.toLowerCase().includes(sequenceSearchQuery.toLowerCase()) ||
          f.configuredTime.toLowerCase().includes(sequenceSearchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [sequences, sequenceSearchQuery]);

  const visibleColumns = columns.filter((col) => col.visible);
  const visibleUserColumns = userColumns.filter((col) => col.visible);
  const visibleSequenceColumns = sequenceColumns.filter((col) => col.visible);

  const renderCell = (facility: Facility, columnId: string, index: number) => {
    switch (columnId) {
      case "srNo":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {index + 1}
          </TableCell>
        );
      case "active":
        return (
          <TableCell key={columnId}>
            <Switch
              checked={facility.active}
              onCheckedChange={() => toggleFacilityActive(facility.id)}
            />
          </TableCell>
        );
      case "facilityId":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {facility.facilityId}
          </TableCell>
        );
      case "facilityName":
        return (
          <TableCell key={columnId} style={{ fontSize: "var(--text-base)" }}>
            {facility.facilityName}
          </TableCell>
        );
      case "facilityType":
        return (
          <TableCell key={columnId}>
            <Badge 
              variant="outline"
              className={
                facility.facilityType === "government"
                  ? "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400"
                  : "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-300"
              }
              style={{ fontSize: "var(--text-xs)" }}
            >
              {facility.facilityType === "government" ? "Government" : "Private"}
            </Badge>
          </TableCell>
        );
      case "emailId":
        return (
          <TableCell key={columnId} className="text-muted-foreground" style={{ fontSize: "var(--text-base)" }}>
            {facility.emailId}
          </TableCell>
        );
      case "registrationCharges":
        return (
          <TableCell key={columnId} className="text-right font-mono" style={{ fontSize: "var(--text-base)" }}>
            {facility.registrationCharges.toFixed(2)}
          </TableCell>
        );
      case "emergencyCharges":
        return (
          <TableCell key={columnId} className="text-right font-mono" style={{ fontSize: "var(--text-base)" }}>
            {facility.emergencyCharges.toFixed(2)}
          </TableCell>
        );
      case "createdBy":
        return (
          <TableCell key={columnId} style={{ fontSize: "var(--text-base)" }}>
            {facility.createdBy}
          </TableCell>
        );
      case "createdAt":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {facility.createdAt}
          </TableCell>
        );
      case "lastModifiedBy":
        return (
          <TableCell key={columnId} style={{ fontSize: "var(--text-base)" }}>
            {facility.lastModifiedBy}
          </TableCell>
        );
      case "lastModifiedAt":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {facility.lastModifiedAt}
          </TableCell>
        );
      case "address":
        return (
          <TableCell key={columnId} className="max-w-[150px] group relative" style={{ fontSize: "var(--text-base)" }}>
            <div className="truncate">
              {facility.address}
            </div>
            <div className="absolute left-0 top-0 invisible group-hover:visible bg-background border shadow-lg p-2 rounded-md z-10 max-w-xs whitespace-normal" style={{ fontSize: "var(--text-base)" }}>
              {facility.address}
            </div>
          </TableCell>
        );
      case "actions":
        return (
          <TableCell key={columnId} className="sticky right-0 bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8 relative z-20"
              onClick={() => {
                console.log("Edit clicked for facility:", facility.id);
                navigate(`/facilities/edit/${facility.id}`);
              }}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </TableCell>
        );
      default:
        return <TableCell key={columnId} />;
    }
  };

  const renderUserCell = (facility: Facility, columnId: string, index: number) => {
    switch (columnId) {
      case "srNo":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {index + 1}
          </TableCell>
        );
      case "facilityId":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {facility.facilityId}
          </TableCell>
        );
      case "name":
        return (
          <TableCell key={columnId} style={{ fontSize: "var(--text-base)" }}>
            {facility.facilityName}
          </TableCell>
        );
      case "emailId":
        return (
          <TableCell key={columnId} className="text-muted-foreground" style={{ fontSize: "var(--text-base)" }}>
            {facility.emailId}
          </TableCell>
        );
      case "address":
        return (
          <TableCell key={columnId} className="max-w-[150px] group relative" style={{ fontSize: "var(--text-base)" }}>
            <div className="truncate">
              {facility.address}
            </div>
            <div className="absolute left-0 top-0 invisible group-hover:visible bg-background border shadow-lg p-2 rounded-md z-10 max-w-xs whitespace-normal" style={{ fontSize: "var(--text-base)" }}>
              {facility.address}
            </div>
          </TableCell>
        );
      case "createdBy":
        return (
          <TableCell key={columnId} style={{ fontSize: "var(--text-base)" }}>
            {facility.createdBy}
          </TableCell>
        );
      case "createdAt":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {facility.createdAt}
          </TableCell>
        );
      case "lastModifiedBy":
        return (
          <TableCell key={columnId} style={{ fontSize: "var(--text-base)" }}>
            {facility.lastModifiedBy}
          </TableCell>
        );
      case "lastModifiedAt":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {facility.lastModifiedAt}
          </TableCell>
        );
      case "actions":
        return (
          <TableCell key={columnId} className="sticky right-0 bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8 relative z-20"
              onClick={() => {
                console.log("Manage users for facility:", facility.id);
                navigate(`/masters/facilities/${facility.id}/users`);
              }}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Manage Users</span>
            </Button>
          </TableCell>
        );
      default:
        return <TableCell key={columnId} />;
    }
  };

  const renderSequenceCell = (sequence: Sequence, columnId: string, index: number) => {
    switch (columnId) {
      case "srNo":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {index + 1}
          </TableCell>
        );
      case "facilityName":
        return (
          <TableCell key={columnId} style={{ fontSize: "var(--text-base)" }}>
            {sequence.facilityName}
          </TableCell>
        );
      case "tenantId":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {sequence.tenantId}
          </TableCell>
        );
      case "outpatientPrefix":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {sequence.outpatientPrefix || "-"}
          </TableCell>
        );
      case "inpatientPrefix":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {sequence.inpatientPrefix}
          </TableCell>
        );
      case "emergencyPrefix":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {sequence.emergencyPrefix}
          </TableCell>
        );
      case "status":
        return (
          <TableCell key={columnId}>
            <Badge 
              variant={sequence.status === "configured" ? "default" : "destructive"}
              className={
                sequence.status === "configured" 
                  ? "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400" 
                  : "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/20 dark:text-red-400"
              }
              style={{ fontSize: "var(--text-xs)" }}
            >
              {sequence.status.toUpperCase()}
            </Badge>
          </TableCell>
        );
      case "configuredDate":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {sequence.configuredDate}
          </TableCell>
        );
      case "configuredTime":
        return (
          <TableCell key={columnId} className="font-mono" style={{ fontSize: "var(--text-base)" }}>
            {sequence.configuredTime}
          </TableCell>
        );
      case "actions":
        return (
          <TableCell key={columnId} className="sticky right-0 bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8 relative z-20"
              onClick={() => {
                setEditingSequence(sequence);
                setUhidPrefixError("");
                setSequenceFormData({
                  facilityName: sequence.facilityName,
                  tenantId: sequence.tenantId,
                  uhidUseDefault: sequence.uhidUseDefault ?? true,
                  uhidIncludeDate: sequence.uhidIncludeDate ?? false,
                  uhidIncludeLetters: sequence.uhidIncludeLetters ?? false,
                  uhidLetterKind: sequence.uhidLetterKind ?? "numeric",
                  uhidLetterCount: sequence.uhidLetterCount ?? 7,
                  uhidIncludePrefix: sequence.uhidIncludePrefix ?? false,
                  uhidPrefix: sequence.uhidPrefix ?? "",
                  uhidIncludeTenantId: sequence.uhidIncludeTenantId ?? false,
                  uhidTenantIdSegment: sequence.uhidTenantIdSegment ?? sequence.tenantId,
                  billNoPrefix: /^[A-Z]{3}/.test(sequence.outpatientPrefix || "")
                    ? sequence.outpatientPrefix
                    : "BIL",
                  billNoFormat: `${/^[A-Z]{3}/.test(sequence.outpatientPrefix || "")
                    ? sequence.outpatientPrefix
                    : "BIL"}YYMMDDXXXXXXX`,
                  visitConfigs: [
                    { slNo: 1, visitType: "Outpatient (OP)", prefix: sequence.outpatientPrefix, format: sequence.outpatientPrefix ? `${sequence.outpatientPrefix}YYMMDDDXXXX` : "", active: !!sequence.outpatientPrefix },
                    { slNo: 2, visitType: "Inpatient (IP)", prefix: sequence.inpatientPrefix, format: sequence.inpatientPrefix ? `${sequence.inpatientPrefix}YYMMDDDXXXX` : "", active: !!sequence.inpatientPrefix },
                    { slNo: 3, visitType: "Emergency (ER)", prefix: sequence.emergencyPrefix, format: sequence.emergencyPrefix ? `${sequence.emergencyPrefix}YYMMDDDXXXX` : "", active: !!sequence.emergencyPrefix },
                  ],
                });
                setEditSequenceModalOpen(true);
              }}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </TableCell>
        );
      default:
        return <TableCell key={columnId} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-semibold" style={{ fontSize: "var(--text-h4)", fontWeight: "var(--font-weight-semibold)" }}>
            Masters
          </h1>
          <div className="flex items-center gap-2">
            {activeTab === "facilities" && (
              <Button variant="outline" size="default">
                <Upload className="mr-2 size-4" />
                Bulk Upload
              </Button>
            )}
            {activeTab !== "sequence" && (
              <Button size="default" onClick={handleAddNew}>
                <Plus className="mr-2 size-4" />
                {activeTab === "roles" && "Add Role"}
                {activeTab === "departments" && "Add Department"}
                {activeTab === "facilities" && "Add Facility"}
                {activeTab === "users" && "Add User"}
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b">
          <button
            onClick={() => setActiveTab("roles")}
            className="relative pb-3 px-1 transition-colors"
            style={{ fontSize: "var(--text-base)" }}
          >
            <span className={activeTab === "roles" ? "text-foreground" : "text-muted-foreground"}>
              Roles
            </span>
            {activeTab === "roles" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("departments")}
            className="relative pb-3 px-1 transition-colors"
            style={{ fontSize: "var(--text-base)" }}
          >
            <span className={activeTab === "departments" ? "text-foreground" : "text-muted-foreground"}>
              Departments
            </span>
            {activeTab === "departments" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("facilities")}
            className="relative pb-3 px-1 transition-colors"
            style={{ fontSize: "var(--text-base)" }}
          >
            <span className={activeTab === "facilities" ? "text-foreground" : "text-muted-foreground"}>
              Facilities
            </span>
            {activeTab === "facilities" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className="relative pb-3 px-1 transition-colors"
            style={{ fontSize: "var(--text-base)" }}
          >
            <span className={activeTab === "users" ? "text-foreground" : "text-muted-foreground"}>
              Users
            </span>
            {activeTab === "users" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("sequence")}
            className="relative pb-3 px-1 transition-colors"
            style={{ fontSize: "var(--text-base)" }}
          >
            <span className={activeTab === "sequence" ? "text-foreground" : "text-muted-foreground"}>
              Sequence
            </span>
            {activeTab === "sequence" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Facilities Tab Content */}
        {activeTab === "facilities" && (
          <>
            {/* Filters Bar */}
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Search */}
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search facilities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border border-border"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
              </div>

              {/* Right side - Actions and Columns */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <span style={{ fontSize: "var(--text-base)" }}>Columns</span>
                      <ChevronDown className="size-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 z-50">
                    <div className="p-2 space-y-1">
                      {columns.filter((col) => !col.fixed).map((column, index) => (
                        <DraggableColumnItem
                          key={column.id}
                          column={column}
                          index={columns.indexOf(column)}
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
                        className={`${column.id === "srNo" ? "w-[80px]" : column.id === "active" ? "w-[80px]" : column.id === "actions" ? "w-[80px] sticky right-0 bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]" : ""}`}
                        style={{ fontSize: "var(--text-sm)" }}
                      >
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.map((facility, index) => (
                    <TableRow key={facility.id}>
                      {visibleColumns.map((column) =>
                        renderCell(facility, column.id, index)
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {/* Users Tab Content */}
        {activeTab === "users" && (
          <>
            {/* Filters Bar */}
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Search */}
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-9 border border-border"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
              </div>

              {/* Right side - Actions and Columns */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <span style={{ fontSize: "var(--text-base)" }}>Columns</span>
                      <ChevronDown className="size-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 z-50">
                    <div className="p-2 space-y-1">
                      {userColumns.filter((col) => !col.fixed).map((column, index) => (
                        <DraggableColumnItem
                          key={column.id}
                          column={column}
                          index={userColumns.indexOf(column)}
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
                    {visibleUserColumns.map((column) => (
                      <TableHead
                        key={column.id}
                        className={`${column.id === "srNo" ? "w-[80px]" : column.id === "actions" ? "w-[80px] sticky right-0 bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]" : ""}`}
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
                      {visibleUserColumns.map((column) =>
                        renderUserCell(user, column.id, index)
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {/* Sequence Tab Content */}
        {activeTab === "sequence" && (
          <>
            {/* Filters Bar */}
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Search */}
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sequences..."
                    value={sequenceSearchQuery}
                    onChange={(e) => setSequenceSearchQuery(e.target.value)}
                    className="pl-9 border border-border"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
              </div>

              {/* Right side - Actions and Columns */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <span style={{ fontSize: "var(--text-base)" }}>Columns</span>
                      <ChevronDown className="size-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 z-50">
                    <div className="p-2 space-y-1">
                      {sequenceColumns.filter((col) => !col.fixed).map((column, index) => (
                        <DraggableColumnItem
                          key={column.id}
                          column={column}
                          index={sequenceColumns.indexOf(column)}
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
                    {visibleSequenceColumns.map((column) => (
                      <TableHead
                        key={column.id}
                        className={`${column.id === "srNo" ? "w-[80px]" : column.id === "actions" ? "w-[80px] sticky right-0 bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]" : ""}`}
                        style={{ fontSize: "var(--text-sm)" }}
                      >
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSequences.map((sequence, index) => (
                    <TableRow key={sequence.id}>
                      {visibleSequenceColumns.map((column) =>
                        renderSequenceCell(sequence, column.id, index)
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== "facilities" && activeTab !== "users" && activeTab !== "sequence" && (
          <div className="flex items-center justify-center h-64 border rounded-md bg-muted/10">
            <p className="text-muted-foreground" style={{ fontSize: "var(--text-base)" }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content coming soon...
            </p>
          </div>
        )}

        {/* Edit Sequence Modal */}
        <Dialog open={editSequenceModalOpen} onOpenChange={setEditSequenceModalOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: "var(--text-h4)", fontWeight: "var(--font-weight-semibold)" }}>
                Edit Sequence Configuration
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Facility Name & Tenant ID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facilityName" style={{ fontSize: "var(--text-base)" }}>
                    Facility Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="facilityName"
                    value={sequenceFormData.facilityName}
                    readOnly
                    className="bg-muted text-muted-foreground"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenantId" style={{ fontSize: "var(--text-base)" }}>
                    Tenant ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="tenantId"
                    value={sequenceFormData.tenantId}
                    readOnly
                    className="bg-muted text-muted-foreground font-mono"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
              </div>

              {/* UHID Configuration */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-medium" style={{ fontSize: "var(--text-base)" }}>
                    Unique Health ID (UHID) Configuration
                  </h3>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="uhid-default-toggle"
                      checked={sequenceFormData.uhidUseDefault}
                      onCheckedChange={(checked) => {
                        setUhidPrefixError("");
                        setSequenceFormData((prev) => ({
                          ...prev,
                          uhidUseDefault: checked,
                          ...(checked
                            ? {}
                            : {
                                uhidTenantIdSegment:
                                  prev.uhidTenantIdSegment.trim() || prev.tenantId,
                              }),
                        }));
                      }}
                    />
                    <Label
                      htmlFor="uhid-default-toggle"
                      className="cursor-pointer font-normal text-foreground"
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      Default UHID
                    </Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="uhidFormatDisplay" style={{ fontSize: "var(--text-base)" }}>
                      UHID format pattern
                    </Label>
                    <Input
                      id="uhidFormatDisplay"
                      value={
                        sequenceFormData.uhidUseDefault
                          ? defaultUhidFormatString(sequenceFormData.tenantId)
                          : buildUhidCustomPreview({
                              includeDate: sequenceFormData.uhidIncludeDate,
                              includeLetters: sequenceFormData.uhidIncludeLetters,
                              letterKind: sequenceFormData.uhidLetterKind,
                              letterCount: sequenceFormData.uhidLetterCount,
                              includePrefix: sequenceFormData.uhidIncludePrefix,
                              prefix: sequenceFormData.uhidPrefix,
                              includeTenantId: sequenceFormData.uhidIncludeTenantId,
                              tenantIdSegment: sequenceFormData.uhidTenantIdSegment,
                            }) || "—"
                      }
                      readOnly
                      className="w-full bg-muted text-muted-foreground font-mono border border-border"
                      style={{ fontSize: "var(--text-base)" }}
                    />
                    <p className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
                      e.g.,{" "}
                      {buildUhidExampleString({
                        useDefault: sequenceFormData.uhidUseDefault,
                        tenantId: sequenceFormData.tenantId,
                        includeDate: sequenceFormData.uhidIncludeDate,
                        includeLetters: sequenceFormData.uhidIncludeLetters,
                        letterKind: sequenceFormData.uhidLetterKind,
                        letterCount: sequenceFormData.uhidLetterCount,
                        includePrefix: sequenceFormData.uhidIncludePrefix,
                        prefix: sequenceFormData.uhidPrefix,
                        includeTenantId: sequenceFormData.uhidIncludeTenantId,
                        tenantIdSegment: sequenceFormData.uhidTenantIdSegment,
                      })}
                    </p>
                  </div>
                </div>

                {!sequenceFormData.uhidUseDefault && (
                  <div className="rounded-md border border-border p-4 space-y-4 bg-muted/30">
                    <p className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
                      Choose which parts to include in the UHID and fill in the values below.
                    </p>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="uhid-opt-date"
                        checked={sequenceFormData.uhidIncludeDate}
                        onCheckedChange={(checked) =>
                          setSequenceFormData((prev) => ({
                            ...prev,
                            uhidIncludeDate: checked === true,
                          }))
                        }
                      />
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="uhid-opt-date" className="cursor-pointer" style={{ fontSize: "var(--text-base)" }}>
                          Date
                        </Label>
                        <p className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
                          Adds a <span className="font-mono">YYMMDD</span> segment (year, month, day).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="uhid-opt-letters"
                        checked={sequenceFormData.uhidIncludeLetters}
                        onCheckedChange={(checked) =>
                          setSequenceFormData((prev) => ({
                            ...prev,
                            uhidIncludeLetters: checked === true,
                          }))
                        }
                      />
                      <div className="space-y-3 flex-1 min-w-0">
                        <Label htmlFor="uhid-opt-letters" className="cursor-pointer" style={{ fontSize: "var(--text-base)" }}>
                          Allowed characters
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label style={{ fontSize: "var(--text-sm)" }}>Character type</Label>
                            <Select
                              value={sequenceFormData.uhidLetterKind}
                              onValueChange={(v: UhidLetterKind) =>
                                setSequenceFormData((prev) => ({ ...prev, uhidLetterKind: v }))
                              }
                              disabled={!sequenceFormData.uhidIncludeLetters}
                            >
                              <SelectTrigger className="border border-border" style={{ fontSize: "var(--text-base)" }}>
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="numeric">Numeric</SelectItem>
                                <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                                <SelectItem value="both">Both (mixed)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="uhid-letter-count" style={{ fontSize: "var(--text-sm)" }}>
                              Count
                            </Label>
                            <Input
                              id="uhid-letter-count"
                              type="number"
                              min={1}
                              max={32}
                              value={sequenceFormData.uhidLetterCount}
                              disabled={!sequenceFormData.uhidIncludeLetters}
                              onChange={(e) => {
                                const raw = parseInt(e.target.value, 10);
                                const n = Number.isFinite(raw) ? Math.min(32, Math.max(1, raw)) : 1;
                                setSequenceFormData((prev) => ({ ...prev, uhidLetterCount: n }));
                              }}
                              className="border border-border font-mono"
                              style={{ fontSize: "var(--text-base)" }}
                            />
                          </div>
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: "var(--text-xs)" }}>
                          Pattern uses{" "}
                          <span className="font-mono">X</span> for numeric,{" "}
                          <span className="font-mono">A</span> for alphanumeric,{" "}
                          <span className="font-mono">*</span> for mixed.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="uhid-opt-prefix"
                        checked={sequenceFormData.uhidIncludePrefix}
                        onCheckedChange={(checked) =>
                          setSequenceFormData((prev) => {
                            const enabled = checked === true;
                            if (!enabled) {
                              setUhidPrefixError("");
                            }
                            return {
                              ...prev,
                              uhidIncludePrefix: enabled,
                            };
                          })
                        }
                      />
                      <div className="space-y-2 flex-1 min-w-0">
                        <Label htmlFor="uhid-prefix-input" className="cursor-pointer" style={{ fontSize: "var(--text-base)" }}>
                          Prefix
                        </Label>
                        <Input
                          id="uhid-prefix-input"
                          value={sequenceFormData.uhidPrefix}
                          disabled={!sequenceFormData.uhidIncludePrefix}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/[^A-Z]/gi, "").toUpperCase();
                            const exceeded = cleaned.length > 3;
                            setUhidPrefixError(exceeded ? "Prefix cannot exceed 3 uppercase letters." : "");
                            setSequenceFormData((prev) => ({
                              ...prev,
                              uhidPrefix: cleaned.slice(0, 3),
                            }));
                          }}
                          placeholder="e.g., HSP"
                          className="border border-border font-mono max-w-md"
                          style={{ fontSize: "var(--text-base)" }}
                        />
                        {sequenceFormData.uhidIncludePrefix && uhidPrefixError && (
                          <p className="text-destructive" style={{ fontSize: "var(--text-xs)" }}>
                            {uhidPrefixError}
                          </p>
                        )}
                        {sequenceFormData.uhidIncludePrefix && !uhidPrefixError && (
                          <p className="text-muted-foreground" style={{ fontSize: "var(--text-xs)" }}>
                            Use exactly 3 uppercase letters.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="uhid-opt-tenant"
                        checked={sequenceFormData.uhidIncludeTenantId}
                        onCheckedChange={(checked) =>
                          setSequenceFormData((prev) => ({
                            ...prev,
                            uhidIncludeTenantId: checked === true,
                            uhidTenantIdSegment:
                              checked === true && !prev.uhidTenantIdSegment.trim()
                                ? prev.tenantId
                                : prev.uhidTenantIdSegment,
                          }))
                        }
                      />
                      <div className="space-y-2 flex-1 min-w-0">
                        <Label htmlFor="uhid-tenant-segment" className="cursor-pointer" style={{ fontSize: "var(--text-base)" }}>
                          Tenant ID
                        </Label>
                        <Input
                          id="uhid-tenant-segment"
                          value={sequenceFormData.uhidTenantIdSegment}
                          disabled={!sequenceFormData.uhidIncludeTenantId}
                          onChange={(e) =>
                            setSequenceFormData((prev) => ({
                              ...prev,
                              uhidTenantIdSegment: e.target.value.slice(0, 32),
                            }))
                          }
                          placeholder="Tenant identifier in UHID"
                          className="border border-border font-mono max-w-md"
                          style={{ fontSize: "var(--text-base)" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bill No Configuration */}
              <div className="space-y-4">
                <h3 className="font-medium" style={{ fontSize: "var(--text-base)" }}>
                  OPD Bill No. Configuration
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billNoPrefix" style={{ fontSize: "var(--text-base)" }}>
                      Prefix
                    </Label>
                    <Input
                      id="billNoPrefix"
                      value={sequenceFormData.billNoPrefix}
                      onChange={(e) => {
                        const prefix = e.target.value.replace(/[^A-Z]/gi, "").toUpperCase().slice(0, 3);
                        setSequenceFormData((prev) => ({
                          ...prev,
                          billNoPrefix: prefix,
                          billNoFormat: prefix ? `${prefix}YYMMDDXXXXXXX` : "",
                        }));
                      }}
                      placeholder="BIL"
                      className="font-mono border border-border"
                      style={{ fontSize: "var(--text-base)" }}
                    />
                    <p className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
                      3 letters, uppercase. Format: YYMMDDXXXXXXX
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billNoFormat" style={{ fontSize: "var(--text-base)" }}>
                      Bill No Format
                    </Label>
                    <Input
                      id="billNoFormat"
                      value={sequenceFormData.billNoFormat}
                      readOnly
                      className="bg-muted text-muted-foreground font-mono border border-border"
                      style={{ fontSize: "var(--text-base)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Visit ID Configuration */}
              <div className="space-y-4">
                <h3 className="font-medium" style={{ fontSize: "var(--text-base)" }}>
                  Visit ID Configuration
                </h3>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]" style={{ fontSize: "var(--text-sm)" }}>
                          SL. NO
                        </TableHead>
                        <TableHead style={{ fontSize: "var(--text-sm)" }}>
                          VISIT TYPE
                        </TableHead>
                        <TableHead style={{ fontSize: "var(--text-sm)" }}>
                          PREFIX
                        </TableHead>
                        <TableHead style={{ fontSize: "var(--text-sm)" }}>
                          FORMAT
                        </TableHead>
                        <TableHead className="w-[80px]" style={{ fontSize: "var(--text-sm)" }}>
                          ACTIVE
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sequenceFormData.visitConfigs.map((config, index) => (
                        <TableRow key={config.slNo}>
                          <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
                            {config.slNo}
                          </TableCell>
                          <TableCell style={{ fontSize: "var(--text-base)" }}>
                            {config.visitType}
                          </TableCell>
                          <TableCell>
                            <Input
                              value={config.prefix}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^A-Z]/g, '').toUpperCase().slice(0, 2);
                                setSequenceFormData((prev) => {
                                  const newVisitConfigs = [...prev.visitConfigs];
                                  newVisitConfigs[index] = {
                                    ...newVisitConfigs[index],
                                    prefix: value,
                                    format: value.length === 2 ? `${value}-YYMMDD-TTTTT-XXXXXXX` : "",
                                  };
                                  return { ...prev, visitConfigs: newVisitConfigs };
                                });
                              }}
                              maxLength={2}
                              placeholder="OP"
                              className="font-mono w-20 border border-border"
                              style={{ fontSize: "var(--text-base)" }}
                            />
                          </TableCell>
                          <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
                            {config.format || "-"}
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={config.active}
                              onCheckedChange={(checked) => {
                                setSequenceFormData((prev) => {
                                  const newVisitConfigs = [...prev.visitConfigs];
                                  newVisitConfigs[index] = {
                                    ...newVisitConfigs[index],
                                    active: checked as boolean,
                                  };
                                  return { ...prev, visitConfigs: newVisitConfigs };
                                });
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setEditSequenceModalOpen(false);
                  setEditingSequence(null);
                  setUhidPrefixError("");
                }}
                style={{ fontSize: "var(--text-base)" }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingSequence) {
                    // Update the sequence in the state
                    setSequences((prev) =>
                      prev.map((seq) =>
                        seq.id === editingSequence.id
                          ? {
                              ...seq,
                              tenantId: sequenceFormData.tenantId,
                              uhidUseDefault: sequenceFormData.uhidUseDefault,
                              uhidIncludeDate: sequenceFormData.uhidIncludeDate,
                              uhidIncludeLetters: sequenceFormData.uhidIncludeLetters,
                              uhidLetterKind: sequenceFormData.uhidLetterKind,
                              uhidLetterCount: sequenceFormData.uhidLetterCount,
                              uhidIncludePrefix: sequenceFormData.uhidIncludePrefix,
                              uhidPrefix: sequenceFormData.uhidPrefix,
                              uhidIncludeTenantId: sequenceFormData.uhidIncludeTenantId,
                              uhidTenantIdSegment: sequenceFormData.uhidTenantIdSegment,
                              outpatientPrefix: sequenceFormData.visitConfigs[0].active
                                ? sequenceFormData.visitConfigs[0].prefix
                                : "",
                              inpatientPrefix: sequenceFormData.visitConfigs[1].active
                                ? sequenceFormData.visitConfigs[1].prefix
                                : "",
                              emergencyPrefix: sequenceFormData.visitConfigs[2].active
                                ? sequenceFormData.visitConfigs[2].prefix
                                : "",
                            }
                          : seq
                      )
                    );
                    toast.success("Sequence configuration updated successfully");
                    setEditSequenceModalOpen(false);
                    setEditingSequence(null);
                    setUhidPrefixError("");
                  }
                }}
                disabled={
                  !sequenceFormData.visitConfigs.some(config => config.active && config.prefix.length === 2) ||
                  (!sequenceFormData.uhidUseDefault &&
                    sequenceFormData.uhidIncludePrefix &&
                    sequenceFormData.uhidPrefix.length !== 3)
                }
                style={{ fontSize: "var(--text-base)" }}
              >
                Save Configuration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}