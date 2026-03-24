"use client";

import * as React from "react";
import { Search, Eye, Download } from "lucide-react";
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

type HistoricalRecord = {
  id: string;
  visitId: string;
  uhid: string;
  patientName: string;
  visitType: "Outpatient" | "Inpatient" | "Emergency";
  visitDate: string;
  doctor: string;
  diagnosis: string;
  status: "completed" | "ongoing" | "cancelled";
};

const HISTORICAL_RECORDS: HistoricalRecord[] = [
  {
    id: "1",
    visitId: "OP-250318-00001-0000001",
    uhid: "2503160000010000001",
    patientName: "John Smith",
    visitType: "Outpatient",
    visitDate: "18-MAR-25, 10:30 AM",
    doctor: "Dr. Sarah Williams",
    diagnosis: "Hypertension",
    status: "completed",
  },
  {
    id: "2",
    visitId: "OP-250317-00001-0000002",
    uhid: "2503160000010000002",
    patientName: "Sarah Johnson",
    visitType: "Outpatient",
    visitDate: "17-MAR-25, 02:15 PM",
    doctor: "Dr. Michael Brown",
    diagnosis: "Diabetes Type 2",
    status: "completed",
  },
  {
    id: "3",
    visitId: "ER-250316-00001-0000001",
    uhid: "2503160000010000003",
    patientName: "Michael Chen",
    visitType: "Emergency",
    visitDate: "16-MAR-25, 09:45 AM",
    doctor: "Dr. Emily Davis",
    diagnosis: "Chest Pain",
    status: "completed",
  },
  {
    id: "4",
    visitId: "IP-250315-00001-0000001",
    uhid: "2503160000010000004",
    patientName: "Emily Rodriguez",
    visitType: "Inpatient",
    visitDate: "15-MAR-25, 04:20 PM",
    doctor: "Dr. James Wilson",
    diagnosis: "Appendicitis",
    status: "ongoing",
  },
  {
    id: "5",
    visitId: "OP-250314-00001-0000003",
    uhid: "2503160000010000005",
    patientName: "David Kim",
    visitType: "Outpatient",
    visitDate: "14-MAR-25, 11:00 AM",
    doctor: "Dr. Sarah Williams",
    diagnosis: "Fever and Flu",
    status: "completed",
  },
];

export function HistoricalRecordPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredRecords = React.useMemo(() => {
    if (!searchQuery) return HISTORICAL_RECORDS;

    return HISTORICAL_RECORDS.filter(
      (record) =>
        record.visitId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getStatusBadge = (status: HistoricalRecord["status"]) => {
    const config = {
      completed: {
        variant: "default" as const,
        className: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400",
        label: "COMPLETED",
      },
      ongoing: {
        variant: "secondary" as const,
        className: "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400",
        label: "ONGOING",
      },
      cancelled: {
        variant: "destructive" as const,
        className: "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
        label: "CANCELLED",
      },
    };

    const statusConfig = config[status];

    return (
      <Badge
        variant={statusConfig.variant}
        className={statusConfig.className}
        style={{ fontSize: "var(--text-xs)" }}
      >
        {statusConfig.label}
      </Badge>
    );
  };

  const getVisitTypeBadge = (visitType: HistoricalRecord["visitType"]) => {
    const config = {
      Outpatient: { variant: "outline" as const },
      Inpatient: { variant: "secondary" as const },
      Emergency: { variant: "destructive" as const, className: "bg-red-500/10 text-red-700 border-red-500/20" },
    };

    const typeConfig = config[visitType];

    return (
      <Badge
        variant={typeConfig.variant}
        className={typeConfig.className}
        style={{ fontSize: "var(--text-xs)" }}
      >
        {visitType.toUpperCase()}
      </Badge>
    );
  };

  return (
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
          Historical Records
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by Visit ID, UHID, patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border border-border"
            style={{ fontSize: "var(--text-base)" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]" style={{ fontSize: "var(--text-sm)" }}>
                Sr. No.
              </TableHead>
              <TableHead style={{ fontSize: "var(--text-sm)" }}>Visit ID</TableHead>
              <TableHead style={{ fontSize: "var(--text-sm)" }}>UHID</TableHead>
              <TableHead style={{ fontSize: "var(--text-sm)" }}>Patient Name</TableHead>
              <TableHead style={{ fontSize: "var(--text-sm)" }}>Visit Type</TableHead>
              <TableHead style={{ fontSize: "var(--text-sm)" }}>Visit Date</TableHead>
              <TableHead style={{ fontSize: "var(--text-sm)" }}>Doctor</TableHead>
              <TableHead style={{ fontSize: "var(--text-sm)" }}>Diagnosis</TableHead>
              <TableHead style={{ fontSize: "var(--text-sm)" }}>Status</TableHead>
              <TableHead className="w-[120px]" style={{ fontSize: "var(--text-sm)" }}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record, index) => (
              <TableRow key={record.id}>
                <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
                  {index + 1}
                </TableCell>
                <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
                  {record.visitId}
                </TableCell>
                <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
                  {record.uhid}
                </TableCell>
                <TableCell style={{ fontSize: "var(--text-base)" }}>
                  {record.patientName}
                </TableCell>
                <TableCell>{getVisitTypeBadge(record.visitType)}</TableCell>
                <TableCell className="font-mono" style={{ fontSize: "var(--text-base)" }}>
                  {record.visitDate}
                </TableCell>
                <TableCell style={{ fontSize: "var(--text-base)" }}>
                  {record.doctor}
                </TableCell>
                <TableCell style={{ fontSize: "var(--text-base)" }}>
                  {record.diagnosis}
                </TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                    >
                      <Eye className="size-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                    >
                      <Download className="size-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
          Showing {filteredRecords.length} of {HISTORICAL_RECORDS.length} records
        </p>
      </div>
    </div>
  );
}

export default HistoricalRecordPage;
