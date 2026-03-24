"use client";

import * as React from "react";
import { ChevronDown, Download, Search } from "lucide-react";
import { Input } from "../app/components/ui/input";
import { Button } from "../app/components/ui/button";
import { Checkbox } from "../app/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../app/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../app/components/ui/dropdown-menu";
import { Separator } from "../app/components/ui/separator";
import { ICON_STROKE_WIDTH } from "../lib/constants";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "../app/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select";
import { useRole } from "../contexts/RoleContext";

type BillingRecord = {
  facilityName: string;
  uhid: string;
  visitId: string;
  patientFullName: string;
  phoneNo: string;
  doctorName: string;
  doctorDepartment: string;
  registrationCharge: number;
  registrationChargeTax: number;
  opConsultationCharge: number;
  opConsultationChargeTax: number;
  dateTime: string;
  billNo: string;
  transactionId: string;
  paymentType: "Cash" | "UPI" | "Card";
  paymentStatus: "Paid" | "Pending" | "Failed";
  collectedByUserName: string;
  collectedByEmployeeId: string;
  discountRowLevel: number;
  discountBillLevel: number;
};

type ColumnConfig = {
  id: string;
  label: string;
  visible: boolean;
};

type ExportColumn = {
  label: string;
  value: (record: BillingRecord, index: number) => string | number;
};

const BILLING_HISTORY_DATA: BillingRecord[] = [
  {
    facilityName: "Main Hospital",
    uhid: "ITF-260321000101",
    visitId: "OP2603210901",
    patientFullName: "Ravi Sharma",
    phoneNo: "9876543210",
    doctorName: "Dr Manish Awasthi",
    doctorDepartment: "General Department",
    registrationCharge: 100,
    registrationChargeTax: 15,
    opConsultationCharge: 500,
    opConsultationChargeTax: 75,
    dateTime: "21-03-2026 09:21 AM",
    billNo: "BIL-260321-001",
    transactionId: "UPI260321901",
    paymentType: "UPI",
    paymentStatus: "Paid",
    collectedByUserName: "Misha Dobriyal",
    collectedByEmployeeId: "EMP-1024",
    discountRowLevel: 0,
    discountBillLevel: 0,
  },
  {
    facilityName: "East Wing Clinic",
    uhid: "ITF-260321000102",
    visitId: "OP2603210914",
    patientFullName: "Anita Verma",
    phoneNo: "9123456780",
    doctorName: "Dr Manish Awasthi",
    doctorDepartment: "General Department",
    registrationCharge: 0,
    registrationChargeTax: 0,
    opConsultationCharge: 500,
    opConsultationChargeTax: 75,
    dateTime: "21-03-2026 09:43 AM",
    billNo: "BIL-260321-002",
    transactionId: "CARD260321221",
    paymentType: "Card",
    paymentStatus: "Paid",
    collectedByUserName: "Misha Dobriyal",
    collectedByEmployeeId: "EMP-1024",
    discountRowLevel: 575,
    discountBillLevel: 0,
  },
];

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "srNo", label: "Sr. No.", visible: true },
  { id: "facility", label: "Facility", visible: true },
  { id: "billNo", label: "Bill No.", visible: true },
  { id: "dateTime", label: "Date & Time", visible: true },
  { id: "patientAndPhone", label: "Patient", visible: true },
  { id: "doctor", label: "Doctor", visible: true },
  { id: "department", label: "Department", visible: true },
  { id: "netBillAmount", label: "Net Bill Amt", visible: true },
  { id: "paymentType", label: "Payment Type", visible: true },
  { id: "totalDiscount", label: "Total Discount", visible: true },
  { id: "collectedBy", label: "Collected By", visible: true },
  { id: "uhid", label: "UHID", visible: false },
  { id: "visitId", label: "Visit ID", visible: false },
  { id: "registrationCharge", label: "Registration Charge", visible: false },
  { id: "registrationChargeTax", label: "Registration Charge Tax", visible: false },
  { id: "opConsultationCharge", label: "OP Consultation Charge", visible: false },
  { id: "opConsultationChargeTax", label: "OP Consultation Charge Tax", visible: false },
  { id: "transactionId", label: "Transaction ID", visible: false },
  // Removed payment status from main view per request
  { id: "collectedByUserName", label: "User Name", visible: false },
  { id: "collectedByEmployeeId", label: "Employee ID", visible: false },
  { id: "discountRowLevel", label: "Discount (Row Level)", visible: false },
  { id: "discountBillLevel", label: "Discount (Bill Level)", visible: false },
];

const EXPORT_COLUMNS: ExportColumn[] = [
  { label: "Sr. No.", value: (_record, index) => index + 1 },
  { label: "Facility", value: (record) => record.facilityName },
  { label: "Bill No.", value: (record) => record.billNo },
  { label: "Date & Time", value: (record) => record.dateTime },
  { label: "Patient Name", value: (record) => record.patientFullName },
  { label: "Phone No.", value: (record) => record.phoneNo },
  { label: "Doctor", value: (record) => record.doctorName },
  { label: "Department", value: (record) => record.doctorDepartment },
  {
    label: "Net Bill Amt",
    value: (record) =>
      record.registrationCharge +
      record.registrationChargeTax +
      record.opConsultationCharge +
      record.opConsultationChargeTax -
      (record.discountRowLevel + record.discountBillLevel),
  },
  { label: "Payment Type", value: (record) => record.paymentType },
  { label: "Payment Status", value: (record) => record.paymentStatus },
  {
    label: "Total Discount",
    value: (record) => record.discountRowLevel + record.discountBillLevel,
  },
  { label: "Collected By User Name", value: (record) => record.collectedByUserName },
  { label: "Collected By Employee ID", value: (record) => record.collectedByEmployeeId },
  { label: "UHID", value: (record) => record.uhid },
  { label: "Visit ID", value: (record) => record.visitId },
  { label: "Registration Charge", value: (record) => record.registrationCharge },
  { label: "Registration Charge Tax", value: (record) => record.registrationChargeTax },
  { label: "OP Consultation Charge", value: (record) => record.opConsultationCharge },
  { label: "OP Consultation Charge Tax", value: (record) => record.opConsultationChargeTax },
  { label: "Transaction ID", value: (record) => record.transactionId },
  { label: "Discount (Row Level)", value: (record) => record.discountRowLevel },
  { label: "Discount (Bill Level)", value: (record) => record.discountBillLevel },
];

export default function BillingHistoryPage() {
  const { currentRole } = useRole();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [columns, setColumns] = React.useState<ColumnConfig[]>(
    DEFAULT_COLUMNS.map((column) =>
      column.id === "facility" && currentRole !== "superadmin"
        ? { ...column, visible: false }
        : column
    )
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [selectedDoctors, setSelectedDoctors] = React.useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = React.useState<string[]>([]);

  const visibleColumns = React.useMemo(
    () => columns.filter((column) => column.visible),
    [columns]
  );

  const parseDdMmYyyyTime = (value: string): Date | null => {
    // expects "dd-mm-yyyy hh:mm AM/PM"
    const match = value.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    const [, dd, mm, yyyy, hh, min, ampm] = match;
    let hour = parseInt(hh, 10);
    if (/pm/i.test(ampm) && hour < 12) hour += 12;
    if (/am/i.test(ampm) && hour === 12) hour = 0;
    const date = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10), hour, parseInt(min, 10));
    return isNaN(date.getTime()) ? null : date;
    };

  const filteredRecords = React.useMemo(() => {
    if (!searchQuery.trim()) {
      // Still apply date range even without search text
      return BILLING_HISTORY_DATA.filter((record) => {
        if (
          currentRole === "superadmin" &&
          selectedFacilities.length > 0 &&
          !selectedFacilities.includes(record.facilityName)
        ) return false;
        if (selectedDoctors.length > 0 && !selectedDoctors.includes(record.doctorName)) return false;
        if (selectedDepartments.length > 0 && !selectedDepartments.includes(record.doctorDepartment)) return false;
        if (!dateRange?.from && !dateRange?.to) return true;
        const dt = parseDdMmYyyyTime(record.dateTime);
        if (!dt) return true;
        if (dateRange?.from && dt < dateRange.from) return false;
        if (dateRange?.to) {
          const end = new Date(dateRange.to);
          end.setHours(23, 59, 59, 999);
          if (dt > end) return false;
        }
        return true;
      });
    }
    const q = searchQuery.toLowerCase();
    return BILLING_HISTORY_DATA.filter((record) => {
      const textMatch =
        record.facilityName.toLowerCase().includes(q) ||
        record.uhid.toLowerCase().includes(q) ||
        record.visitId.toLowerCase().includes(q) ||
        record.patientFullName.toLowerCase().includes(q) ||
        record.phoneNo.toLowerCase().includes(q) ||
        record.billNo.toLowerCase().includes(q) ||
        record.transactionId.toLowerCase().includes(q);
      if (!textMatch) return false;
      if (
        currentRole === "superadmin" &&
        selectedFacilities.length > 0 &&
        !selectedFacilities.includes(record.facilityName)
      ) return false;
      if (selectedDoctors.length > 0 && !selectedDoctors.includes(record.doctorName)) return false;
      if (selectedDepartments.length > 0 && !selectedDepartments.includes(record.doctorDepartment)) return false;
      if (!dateRange?.from && !dateRange?.to) return true;
      const dt = parseDdMmYyyyTime(record.dateTime);
      if (!dt) return true;
      if (dateRange?.from && dt < dateRange.from) return false;
      if (dateRange?.to) {
        const end = new Date(dateRange.to);
        end.setHours(23, 59, 59, 999);
        if (dt > end) return false;
      }
      return true;
    });
  }, [searchQuery, dateRange, selectedDoctors, selectedDepartments, selectedFacilities, currentRole]);

  const doctorOptions = React.useMemo(
    () => Array.from(new Set(BILLING_HISTORY_DATA.map((record) => record.doctorName))),
    []
  );
  const departmentOptions = React.useMemo(
    () => Array.from(new Set(BILLING_HISTORY_DATA.map((record) => record.doctorDepartment))),
    []
  );
  const facilityOptions = React.useMemo(
    () => Array.from(new Set(BILLING_HISTORY_DATA.map((record) => record.facilityName))),
    []
  );

  const toggleDoctor = (doctor: string) => {
    setSelectedDoctors((prev) =>
      prev.includes(doctor) ? prev.filter((d) => d !== doctor) : [...prev, doctor]
    );
  };

  const toggleDepartment = (department: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(department) ? prev.filter((d) => d !== department) : [...prev, department]
    );
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === id ? { ...column, visible: !column.visible } : column
      )
    );
  };

  const toCsvCell = (value: string | number) => {
    const stringValue = String(value ?? "");
    const escaped = stringValue.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const handleExport = () => {
    const headerRow = EXPORT_COLUMNS.map((column) => toCsvCell(column.label)).join(",");
    const dataRows = filteredRecords.map((record, index) =>
      EXPORT_COLUMNS.map((column) => toCsvCell(column.value(record, index))).join(",")
    );
    const csv = [headerRow, ...dataRows].join("\n");

    // UTF-8 BOM helps Excel correctly decode content across locales.
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    link.href = url;
    link.download = `collections-export-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const renderCell = (columnId: string, record: BillingRecord, index: number) => {
    const totalDiscount = record.discountRowLevel + record.discountBillLevel;
    const grossAmount =
      record.registrationCharge +
      record.registrationChargeTax +
      record.opConsultationCharge +
      record.opConsultationChargeTax;
    const netBillAmount = grossAmount - totalDiscount;

    switch (columnId) {
      case "srNo":
        return <TableCell className="font-mono">{index + 1}</TableCell>;
      case "facility":
        return <TableCell>{record.facilityName}</TableCell>;
      case "billNo":
        return <TableCell className="font-mono text-primary font-semibold">{record.billNo}</TableCell>;
      case "dateTime":
        return <TableCell className="font-mono">{record.dateTime}</TableCell>;
      case "uhid":
        return <TableCell className="font-mono">{record.uhid}</TableCell>;
      case "visitId":
        return <TableCell className="font-mono">{record.visitId}</TableCell>;
      case "patientAndPhone":
        return (
          <TableCell>
            <div>{record.patientFullName}</div>
            <div className="text-muted-foreground font-mono">{record.phoneNo}</div>
          </TableCell>
        );
      case "doctor":
        return <TableCell>{record.doctorName}</TableCell>;
      case "department":
        return <TableCell>{record.doctorDepartment}</TableCell>;
      case "netBillAmount":
        return <TableCell className="text-right font-mono">{netBillAmount}</TableCell>;
      case "paymentType":
        return <TableCell>{record.paymentType}</TableCell>;
      case "totalDiscount":
        return <TableCell className="text-right font-mono">{totalDiscount}</TableCell>;
      case "collectedBy":
        return (
          <TableCell>
            <div>{record.collectedByUserName}</div>
            <div className="text-muted-foreground font-mono">{record.collectedByEmployeeId}</div>
          </TableCell>
        );
      case "registrationCharge":
        return <TableCell className="text-right font-mono">{record.registrationCharge}</TableCell>;
      case "registrationChargeTax":
        return <TableCell className="text-right font-mono">{record.registrationChargeTax}</TableCell>;
      case "opConsultationCharge":
        return <TableCell className="text-right font-mono">{record.opConsultationCharge}</TableCell>;
      case "opConsultationChargeTax":
        return <TableCell className="text-right font-mono">{record.opConsultationChargeTax}</TableCell>;
      case "transactionId":
        return <TableCell className="font-mono">{record.transactionId}</TableCell>;
      case "paymentStatus":
        return <TableCell>{record.paymentStatus}</TableCell>;
      case "collectedByUserName":
        return <TableCell>{record.collectedByUserName}</TableCell>;
      case "collectedByEmployeeId":
        return <TableCell className="font-mono">{record.collectedByEmployeeId}</TableCell>;
      case "discountRowLevel":
        return <TableCell className="text-right font-mono">{record.discountRowLevel}</TableCell>;
      case "discountBillLevel":
        return <TableCell className="text-right font-mono">{record.discountBillLevel}</TableCell>;
      default:
        return <TableCell />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1
          className="font-semibold"
          style={{
            fontSize: "var(--text-h4)",
            fontWeight: "var(--font-weight-semibold)",
          }}
        >
          Collections
        </h1>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          <div className="relative w-full min-w-0 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search UHID, Visit ID, Name, Phone, Bill No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-border"
              style={{ fontSize: "var(--text-sm)" }}
            />
          </div>
          {currentRole === "superadmin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-56 justify-between" style={{ fontSize: "var(--text-sm)" }}>
                  {selectedFacilities.length > 0
                    ? `Facilities (${selectedFacilities.length})`
                    : "Facilities"}
                  <ChevronDown className="ml-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background text-foreground">
                {facilityOptions.map((facility) => (
                  <DropdownMenuItem key={facility} onSelect={(e) => e.preventDefault()} className="gap-2">
                    <Checkbox
                      checked={selectedFacilities.includes(facility)}
                      onCheckedChange={() => toggleFacility(facility)}
                    />
                    <span style={{ fontSize: "var(--text-sm)" }}>{facility}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-52 justify-between" style={{ fontSize: "var(--text-sm)" }}>
                {selectedDoctors.length > 0 ? `Doctors (${selectedDoctors.length})` : "Doctors"}
                <ChevronDown className="ml-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background text-foreground">
              {doctorOptions.map((doctor) => (
                <DropdownMenuItem key={doctor} onSelect={(e) => e.preventDefault()} className="gap-2">
                  <Checkbox checked={selectedDoctors.includes(doctor)} onCheckedChange={() => toggleDoctor(doctor)} />
                  <span style={{ fontSize: "var(--text-sm)" }}>{doctor}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-56 justify-between" style={{ fontSize: "var(--text-sm)" }}>
                {selectedDepartments.length > 0
                  ? `Departments (${selectedDepartments.length})`
                  : "Departments"}
                <ChevronDown className="ml-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background text-foreground">
              {departmentOptions.map((department) => (
                <DropdownMenuItem key={department} onSelect={(e) => e.preventDefault()} className="gap-2">
                  <Checkbox
                    checked={selectedDepartments.includes(department)}
                    onCheckedChange={() => toggleDepartment(department)}
                  />
                  <span style={{ fontSize: "var(--text-sm)" }}>{department}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleExport}
            style={{ fontSize: "var(--text-sm)" }}
          >
            <Download className="mr-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" style={{ fontSize: "var(--text-sm)" }}>
                Columns
                <ChevronDown className="ml-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="p-2 space-y-1">
                {columns.map((column) => (
                  <label
                    key={column.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer"
                  >
                    <Checkbox
                      checked={column.visible}
                      onCheckedChange={() => toggleColumn(column.id)}
                    />
                    <span style={{ fontSize: "var(--text-sm)" }}>{column.label}</span>
                  </label>
                ))}
              </div>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() =>
                    setColumns(
                      DEFAULT_COLUMNS.map((column) =>
                        column.id === "facility" && currentRole !== "superadmin"
                          ? { ...column, visible: false }
                          : column
                      )
                    )
                  }
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Reset to Default
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column.id} style={{ fontSize: "var(--text-sm)" }}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record, index) => (
              <TableRow key={`${record.billNo}-${record.visitId}`}>
                {visibleColumns.map((column) => (
                  <React.Fragment key={column.id}>
                    {renderCell(column.id, record, index)}
                  </React.Fragment>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

