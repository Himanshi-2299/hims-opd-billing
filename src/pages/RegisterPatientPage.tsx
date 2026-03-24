"use client";

import * as React from "react";
import { ChevronLeft, Calendar as CalendarIcon, Users, Hash, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Label } from "../app/components/ui/label";
import { Badge } from "../app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../app/components/ui/popover";
import { Calendar } from "../app/components/ui/calendar";
import { Separator } from "../app/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "../app/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../app/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../app/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { ICON_STROKE_WIDTH } from "../lib/constants";

type GenderType = "male" | "female" | "other";

type DepartmentConfig = {
  value: string;
  label: string;
  roomNumber: string;
  doctorValue: string;
  doctorLabel: string;
  consultationFee: number;
};

const DEPARTMENT_CONFIGS: DepartmentConfig[] = [
  {
    value: "cardiology",
    label: "Cardiology",
    roomNumber: "101",
    doctorValue: "dr-smith",
    doctorLabel: "Dr. Smith",
    consultationFee: 500,
  },
  {
    value: "neurology",
    label: "Neurology",
    roomNumber: "202",
    doctorValue: "dr-johnson",
    doctorLabel: "Dr. Johnson",
    consultationFee: 650,
  },
  {
    value: "orthopedics",
    label: "Orthopedics",
    roomNumber: "303",
    doctorValue: "dr-williams",
    doctorLabel: "Dr. Williams",
    consultationFee: 450,
  },
  {
    value: "pediatrics",
    label: "Pediatrics",
    roomNumber: "104",
    doctorValue: "dr-brown",
    doctorLabel: "Dr. Brown",
    consultationFee: 300,
  },
  {
    value: "general",
    label: "General Medicine",
    roomNumber: "105",
    doctorValue: "dr-smith",
    doctorLabel: "Dr. Smith",
    consultationFee: 250,
  },
];

const BILLING_SERVICE_OPTIONS = [
  "Registration Charge",
  "Consultation Charge",
  "Follow-up Consultation",
  "Procedure Charge",
  "Lab Test",
];

const DEFAULT_REGISTRATION_CHARGE = 100;

type ExistingPatient = {
  id: string;
  uhid: string;
  phoneNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: GenderType;
  dateOfBirth: string;
  addressLine1: string;
  district: string;
  state: string;
  pinCode: string;
  lastDepartment: string;
  lastDoctor: string;
  lastRoomNumber: string;
  lastVisitDate: string;
  followupPeriodDays: number;
};

const EXISTING_PATIENTS: ExistingPatient[] = [
  {
    id: "p1",
    uhid: "UHID-0000001",
    phoneNumber: "9876543210",
    firstName: "Ravi",
    middleName: "",
    lastName: "Sharma",
    gender: "male",
    dateOfBirth: "1992-06-18",
    addressLine1: "123 MG Road",
    district: "district1",
    state: "state1",
    pinCode: "560001",
    lastDepartment: "cardiology",
    lastDoctor: "dr-smith",
    lastRoomNumber: "101",
    lastVisitDate: "2026-03-15",
    followupPeriodDays: 7,
  },
  {
    id: "p2",
    uhid: "UHID-0000002",
    phoneNumber: "9123456780",
    firstName: "Anita",
    middleName: "",
    lastName: "Verma",
    gender: "female",
    dateOfBirth: "1988-11-03",
    addressLine1: "45 Lake View",
    district: "district2",
    state: "state2",
    pinCode: "400001",
    lastDepartment: "neurology",
    lastDoctor: "dr-johnson",
    lastRoomNumber: "202",
    lastVisitDate: "2026-02-20",
    followupPeriodDays: 7,
  },
];

const REGISTERED_PATIENTS_STORAGE_KEY = "hims_registered_patients";
const REGISTERED_VISITS_STORAGE_KEY = "hims_registered_visits";

type StoredVisit = {
  visitId: string;
  uhid: string;
  patientName: string;
  gender: "M" | "F";
  age: { years: number; months: number; days: number };
  visitType: string;
  doctor: string;
  visitCreated: string;
  status: "Registered";
  hasReport: boolean;
};

type StoredPatient = ExistingPatient;

type FinalizedVisitMeta = {
  visitId: string;
  uhid: string;
  patientName: string;
  doctorLabel: string;
  visitCreated: Date;
};

type BillingRow = {
  id: string;
  serviceName: string;
  serviceContext?: string;
  quantity: number;
  unitPrice: number;
  gstPercent: number;
  discount: number;
};

type PatientFormData = {
  phoneNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: GenderType;
  dateOfBirth: Date | undefined;
  years: string;
  months: string;
  days: string;
  addressLine1: string;
  district: string;
  state: string;
  pinCode: string;
  department: string;
  roomNumber: string;
  doctor: string;
  visitType: string;
};

export function RegisterPatientPage() {
  const navigate = useNavigate();
  const [selectedExistingPatient, setSelectedExistingPatient] = React.useState<ExistingPatient | null>(null);
  const [simulateExpiredFollowup, setSimulateExpiredFollowup] = React.useState(false);
  const [billingModalOpen, setBillingModalOpen] = React.useState(false);
  const [opdSlipModalOpen, setOpdSlipModalOpen] = React.useState(false);
  const [paymentMode, setPaymentMode] = React.useState("cash");
  const [paymentAmount, setPaymentAmount] = React.useState("");
  const [billLevelDiscount, setBillLevelDiscount] = React.useState("0");
  const [transactionId, setTransactionId] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [latestFinalizedVisit, setLatestFinalizedVisit] = React.useState<FinalizedVisitMeta | null>(null);
  const [billingRows, setBillingRows] = React.useState<BillingRow[]>([]);

  const [formData, setFormData] = React.useState<PatientFormData>({
    phoneNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "male",
    dateOfBirth: undefined,
    years: "",
    months: "",
    days: "",
    addressLine1: "",
    district: "",
    state: "",
    pinCode: "",
    department: "",
    roomNumber: "",
    doctor: "",
    visitType: "",
  });

  // Calculate age from date of birth
  const calculateAge = (dob: Date) => {
    const today = new Date();
    const birthDate = new Date(dob);
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months, days };
  };

  const handleDateOfBirthChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
    
    if (date) {
      const age = calculateAge(date);
      setFormData((prev) => ({
        ...prev,
        years: age.years.toString(),
        months: age.months.toString(),
        days: age.days.toString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        years: "",
        months: "",
        days: "",
      }));
    }
  };

  const isFormValid = React.useMemo(() => {
    return (
      formData.phoneNumber &&
      formData.firstName &&
      formData.gender &&
      formData.addressLine1 &&
      formData.district &&
      formData.state &&
      formData.department &&
      formData.doctor &&
      formData.visitType
    );
  }, [formData]);

  const selectedDepartmentConfig = React.useMemo(
    () => DEPARTMENT_CONFIGS.find((config) => config.value === formData.department),
    [formData.department]
  );

  const [storedExistingPatients, setStoredExistingPatients] = React.useState<StoredPatient[]>([]);
  const [storedVisits, setStoredVisits] = React.useState<StoredVisit[]>([]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const patientsRaw = window.localStorage.getItem(REGISTERED_PATIENTS_STORAGE_KEY);
      const visitsRaw = window.localStorage.getItem(REGISTERED_VISITS_STORAGE_KEY);
      setStoredExistingPatients(patientsRaw ? (JSON.parse(patientsRaw) as StoredPatient[]) : []);
      setStoredVisits(visitsRaw ? (JSON.parse(visitsRaw) as StoredVisit[]) : []);
    } catch {
      setStoredExistingPatients([]);
      setStoredVisits([]);
    }
  }, []);

  const allExistingPatients = React.useMemo(() => {
    const merged = [...EXISTING_PATIENTS];
    storedExistingPatients.forEach((patient) => {
      if (!merged.some((item) => item.phoneNumber === patient.phoneNumber)) {
        merged.push(patient);
      }
    });
    return merged;
  }, [storedExistingPatients]);

  const matchedPatients = React.useMemo(() => {
    if (!formData.phoneNumber) {
      return [];
    }
    return allExistingPatients.filter((patient) =>
      patient.phoneNumber.startsWith(formData.phoneNumber)
    );
  }, [allExistingPatients, formData.phoneNumber]);

  const isWithinFollowupPeriod = (patient: ExistingPatient) => {
    const lastVisitDate = new Date(patient.lastVisitDate);
    const expiryDate = new Date(lastVisitDate);
    expiryDate.setDate(expiryDate.getDate() + patient.followupPeriodDays);
    return new Date() <= expiryDate;
  };

  const isFollowupWithinPeriod = React.useMemo(
    () => (selectedExistingPatient ? isWithinFollowupPeriod(selectedExistingPatient) : false),
    [selectedExistingPatient]
  );
  const effectiveFollowupWithinPeriod = selectedExistingPatient
    ? isFollowupWithinPeriod && !simulateExpiredFollowup
    : false;

  const followupExpiryDate = React.useMemo(() => {
    if (!selectedExistingPatient) {
      return null;
    }
    const lastVisitDate = new Date(selectedExistingPatient.lastVisitDate);
    const expiryDate = new Date(lastVisitDate);
    expiryDate.setDate(expiryDate.getDate() + selectedExistingPatient.followupPeriodDays);
    return expiryDate;
  }, [selectedExistingPatient]);

  const currentConsultationFee = React.useMemo(() => {
    if (!selectedDepartmentConfig) {
      return 0;
    }
    return effectiveFollowupWithinPeriod ? 0 : selectedDepartmentConfig.consultationFee;
  }, [effectiveFollowupWithinPeriod, selectedDepartmentConfig]);

  const totalBilledAmount = React.useMemo(
    () =>
      billingRows.reduce((sum, row) => {
        const taxable = row.quantity * row.unitPrice;
        const gstAmount = Math.round((taxable * row.gstPercent) / 100);
        return sum + taxable + gstAmount;
      }, 0),
    [billingRows]
  );
  const totalGstAmount = React.useMemo(
    () =>
      billingRows.reduce((sum, row) => {
        const taxable = row.quantity * row.unitPrice;
        return sum + Math.round((taxable * row.gstPercent) / 100);
      }, 0),
    [billingRows]
  );
  const discountAmount = React.useMemo(
    () => billingRows.reduce((sum, row) => sum + row.discount, 0),
    [billingRows]
  );
  const billDiscountAmount = React.useMemo(
    () => Number(billLevelDiscount || "0"),
    [billLevelDiscount]
  );
  const totalDiscountAmount = React.useMemo(
    () => discountAmount + billDiscountAmount,
    [discountAmount, billDiscountAmount]
  );
  const finalBillAmount = React.useMemo(
    () => Math.max(totalBilledAmount - totalDiscountAmount, 0),
    [totalBilledAmount, totalDiscountAmount]
  );
  const receivedAmount = React.useMemo(() => Number(paymentAmount || "0"), [paymentAmount]);
  const balanceAmount = React.useMemo(
    () => Math.max(finalBillAmount - receivedAmount, 0),
    [finalBillAmount, receivedAmount]
  );
  const isBillingFormValid = React.useMemo(() => {
    const paidAmount = Number(paymentAmount || "0");
    const hasValidAmount = paymentAmount.trim() !== "" && paidAmount === finalBillAmount;
    const needsTransaction = paymentMode !== "cash";
    const hasTransaction = !needsTransaction || transactionId.trim() !== "";
    const needsCard = paymentMode === "card";
    const hasValidCard = !needsCard || cardNumber.replace(/\D/g, "").length >= 12;
    return hasValidAmount && hasTransaction && hasValidCard;
  }, [paymentAmount, finalBillAmount, paymentMode, transactionId, cardNumber]);

  React.useEffect(() => {
    if (!selectedExistingPatient) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      visitType: effectiveFollowupWithinPeriod ? "free-followup" : "new",
    }));
  }, [effectiveFollowupWithinPeriod, selectedExistingPatient]);

  React.useEffect(() => {
    // Build default rows based on patient type and follow-up
    const consultationPrice = selectedDepartmentConfig?.consultationFee ?? 0;
    const isNewUhid = !selectedExistingPatient; // new UHID when no selected existing patient
    const doctorName = selectedDepartmentConfig?.doctorLabel ?? "Doctor";
    const deptName = selectedDepartmentConfig?.label ?? "Department";

    const consultationRow: BillingRow = {
      id: "row-consult",
      serviceName: "Consultation Charge",
      serviceContext: `${doctorName}, ${deptName}`,
      quantity: 1,
      unitPrice: consultationPrice,
      gstPercent: 15,
      discount: effectiveFollowupWithinPeriod
        ? consultationPrice + Math.round((consultationPrice * 15) / 100)
        : 0,
    };

    const registrationRow: BillingRow = {
      id: "row-reg",
      serviceName: "Registration Charge",
      serviceContext: undefined,
      quantity: 1,
      unitPrice: DEFAULT_REGISTRATION_CHARGE,
      gstPercent: 15,
      discount: 0,
    };

    if (isNewUhid) {
      setBillingRows([registrationRow, consultationRow]);
    } else {
      setBillingRows([consultationRow]);
    }
  }, [effectiveFollowupWithinPeriod, selectedDepartmentConfig]);

  const updateBillingRow = (
    id: string,
    field: keyof Omit<BillingRow, "id">,
    value: string | number
  ) => {
    setBillingRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleServiceChange = (rowId: string, serviceName: string) => {
    const consultationPrice = selectedDepartmentConfig?.consultationFee ?? 0;
    const doctorName = selectedDepartmentConfig?.doctorLabel ?? "Doctor";
    const deptName = selectedDepartmentConfig?.label ?? "Department";

    setBillingRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) {
          return row;
        }

        if (serviceName === "Registration Charge") {
          return {
            ...row,
            serviceName,
            serviceContext: undefined,
            unitPrice: DEFAULT_REGISTRATION_CHARGE,
            gstPercent: 15,
            discount: 0,
          };
        }

        if (serviceName === "Consultation Charge" || serviceName === "Follow-up Consultation") {
          return {
            ...row,
            serviceName,
            serviceContext: `${doctorName}, ${deptName}`,
            unitPrice: consultationPrice,
            gstPercent: 15,
            discount: effectiveFollowupWithinPeriod
              ? consultationPrice + Math.round((consultationPrice * 15) / 100)
              : 0,
          };
        }

        return {
          ...row,
          serviceName,
          serviceContext: undefined,
          unitPrice: 0,
          gstPercent: 0,
          discount: 0,
        };
      })
    );
  };

  const addBillingRow = () => {
    setBillingRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        serviceName: "Additional Service",
        serviceContext: undefined,
        quantity: 1,
        unitPrice: 0,
        gstPercent: 0,
        discount: 0,
      },
    ]);
  };

  const removeBillingRow = (id: string) => {
    setBillingRows((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((row) => row.id !== id);
    });
  };

  const handleExistingPatientSelect = (patient: ExistingPatient) => {
    const latestVisitForPhone = storedVisits.find((visit) => {
      const byUhid = patient.uhid && visit.uhid === patient.uhid;
      const byName =
        `${patient.firstName} ${patient.middleName} ${patient.lastName}`.replace(/\s+/g, " ").trim() ===
        visit.patientName;
      return byUhid || byName;
    });

    const previousDepartment = patient.lastDepartment;
    const departmentConfig = DEPARTMENT_CONFIGS.find((department) => department.value === previousDepartment);
    const previousDoctorValue =
      DEPARTMENT_CONFIGS.find((department) => department.doctorLabel === latestVisitForPhone?.doctor)?.doctorValue ??
      patient.lastDoctor ??
      departmentConfig?.doctorValue ??
      "";
    const previousVisitType = isWithinFollowupPeriod(patient) ? "free-followup" : "new";
    const dobDate = new Date(patient.dateOfBirth);
    const age = calculateAge(dobDate);
    const withinFollowupPeriod = isWithinFollowupPeriod(patient);

    setSelectedExistingPatient(patient);
    setFormData((prev) => ({
      ...prev,
      phoneNumber: patient.phoneNumber,
      firstName: patient.firstName,
      middleName: patient.middleName,
      lastName: patient.lastName,
      gender: patient.gender,
      dateOfBirth: dobDate,
      years: age.years.toString(),
      months: age.months.toString(),
      days: age.days.toString(),
      addressLine1: patient.addressLine1,
      district: patient.district,
      state: patient.state,
      pinCode: patient.pinCode,
      department: previousDepartment,
      roomNumber: patient.lastRoomNumber || departmentConfig?.roomNumber || "",
      doctor: previousDoctorValue,
      visitType: previousVisitType,
    }));
  };

  const finalizeVisitRegistration = () => {
    const fullName = [formData.firstName, formData.middleName, formData.lastName]
      .filter(Boolean)
      .join(" ");
    const doctorLabel =
      DEPARTMENT_CONFIGS.find((department) => department.doctorValue === formData.doctor)?.doctorLabel ??
      formData.doctor;
    const now = new Date();
    const datePart = format(now, "yyMMdd");
    const generatedUhid = `ITF-${datePart}${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`;
    const generatedVisitId = `OP${datePart}${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;

    if (typeof window !== "undefined") {
      const visitPayload: StoredVisit = {
        visitId: generatedVisitId,
        uhid: generatedUhid,
        patientName: fullName,
        gender: formData.gender === "female" ? "F" : "M",
        age: {
          years: Number(formData.years || "0"),
          months: Number(formData.months || "0"),
          days: Number(formData.days || "0"),
        },
        visitType: formData.visitType.toUpperCase(),
        doctor: doctorLabel,
        visitCreated: now.toISOString(),
        status: "Registered",
        hasReport: false,
      };

      const existingVisitsRaw = window.localStorage.getItem(REGISTERED_VISITS_STORAGE_KEY);
      const existingVisits: StoredVisit[] = existingVisitsRaw ? JSON.parse(existingVisitsRaw) : [];
      window.localStorage.setItem(
        REGISTERED_VISITS_STORAGE_KEY,
        JSON.stringify([visitPayload, ...existingVisits])
      );

      const patientPayload: ExistingPatient = {
        id: `stored-${Date.now()}`,
        uhid: generatedUhid,
        phoneNumber: formData.phoneNumber,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().slice(0, 10) : "2000-01-01",
        addressLine1: formData.addressLine1,
        district: formData.district,
        state: formData.state,
        pinCode: formData.pinCode,
        lastDepartment: formData.department,
        lastDoctor: formData.doctor,
        lastRoomNumber: formData.roomNumber,
        lastVisitDate: now.toISOString().slice(0, 10),
        followupPeriodDays: 7,
      };

      const existingPatientsRaw = window.localStorage.getItem(REGISTERED_PATIENTS_STORAGE_KEY);
      const existingPatients: ExistingPatient[] = existingPatientsRaw ? JSON.parse(existingPatientsRaw) : [];
      const filteredPatients = existingPatients.filter(
        (patient) => patient.phoneNumber !== patientPayload.phoneNumber
      );
      window.localStorage.setItem(
        REGISTERED_PATIENTS_STORAGE_KEY,
        JSON.stringify([patientPayload, ...filteredPatients])
      );
    }
    return {
      visitId: generatedVisitId,
      uhid: generatedUhid,
      patientName: fullName,
      doctorLabel,
      visitCreated: now,
    } satisfies FinalizedVisitMeta;
  };

  const handleCreateVisit = () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setPaymentMode("cash");
    setPaymentAmount(String(finalBillAmount));
    setBillLevelDiscount("0");
    setTransactionId("");
    setCardNumber("");
    setBillingModalOpen(true);
  };

  const handleCollectPaymentAndContinue = () => {
    const paidAmount = Number(paymentAmount || "0");
    const isOnlineMode = paymentMode === "upi" || paymentMode === "card";
    if (isOnlineMode && !transactionId.trim()) {
      toast.error("Transaction ID is required for online payments");
      return;
    }
    if (paymentMode === "card" && cardNumber.replace(/\D/g, "").length < 12) {
      toast.error("Please enter a valid card number");
      return;
    }
    if (paidAmount !== finalBillAmount) {
      toast.error("Payment amount must be exactly equal to total balance");
      return;
    }

    const finalizedVisit = finalizeVisitRegistration();
    setLatestFinalizedVisit(finalizedVisit);
    setBillingModalOpen(false);
    setOpdSlipModalOpen(true);
    toast.success("Billing successful. Payment received and OPD slip generated.", {
      duration: 5000,
    });
  };

  const handleRegisterAnotherPatient = () => {
    setOpdSlipModalOpen(false);
    setLatestFinalizedVisit(null);
    handleClear();
  };

  const handleClear = () => {
    setSelectedExistingPatient(null);
    setFormData({
      phoneNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "male",
      dateOfBirth: undefined,
      years: "",
      months: "",
      days: "",
      addressLine1: "",
      district: "",
      state: "",
      pinCode: "",
      department: "",
      roomNumber: "",
      doctor: "",
      visitType: "",
    });
    toast.success("Form cleared");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border pb-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/patients")}
              className="size-8"
            >
              <ChevronLeft className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
              <span className="sr-only">Back</span>
            </Button>
            <h1
              className="font-semibold"
              style={{
                fontSize: "var(--text-h4)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              Registration
            </h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => toast.info("Patient Queue feature coming soon")}
              style={{ fontSize: "var(--text-sm)" }}
            >
              <Users className="mr-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
              Patient Queue
            </Button>
            <Button 
              variant="outline" 
              onClick={() => toast.info("Token feature coming soon")}
              style={{ fontSize: "var(--text-sm)" }}
            >
              <Hash className="mr-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
              Token
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" onClick={handleClear} style={{ fontSize: "var(--text-sm)" }}>
              Clear
            </Button>
            <Button onClick={handleCreateVisit} disabled={!isFormValid} style={{ fontSize: "var(--text-sm)" }}>
              Create Visit
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="opd" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="opd" style={{ fontSize: "var(--text-sm)" }}>
              OPD
            </TabsTrigger>
          </TabsList>
        </Tabs>

      </div>

      {/* Main Content - Form and Stats */}
      <div className="flex gap-6">
        {/* Left Column - Form */}
        <div className="flex-1 space-y-6 max-w-5xl">
          {/* Phone Number with ABHA */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" style={{ fontSize: "var(--text-sm)" }}>
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-muted-foreground" style={{ fontSize: "var(--text-xs)" }}>
                    Temporary test control
                  </p>
                  <Button
                    type="button"
                    variant={simulateExpiredFollowup ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSimulateExpiredFollowup((prev) => !prev)}
                    style={{ fontSize: "var(--text-xs)" }}
                  >
                    {simulateExpiredFollowup ? "Simulating Expired" : "Simulate Expired Follow-up"}
                  </Button>
                </div>
                <Input
                  id="phoneNumber"
                  placeholder="Enter 10-digit number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setSelectedExistingPatient(null);
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: value,
                      visitType: prev.department ? "new" : "",
                    }));
                  }}
                  className="border border-border font-mono"
                  style={{ fontSize: "var(--text-base)" }}
                  maxLength={10}
                />
                {matchedPatients.length > 0 && !selectedExistingPatient && (
                  <div className="border rounded-md bg-background p-2 space-y-2">
                    {matchedPatients.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-sm border border-border hover:bg-accent transition-colors"
                        onClick={() => handleExistingPatientSelect(patient)}
                      >
                        <p style={{ fontSize: "var(--text-sm)" }} className="font-medium">
                          {patient.phoneNumber}
                        </p>
                        <p style={{ fontSize: "var(--text-sm)" }} className="text-muted-foreground">
                          {[patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" ")} {" "}
                          • {DEPARTMENT_CONFIGS.find((d) => d.value === patient.lastDepartment)?.label ?? patient.lastDepartment}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Create ABHA
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Verify ABHA
                </Button>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-4">
            <h2
              className="font-semibold text-muted-foreground"
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              Patient Details
            </h2>

            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" style={{ fontSize: "var(--text-sm)" }}>
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className="border border-border"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName" style={{ fontSize: "var(--text-sm)" }}>
                    Middle Name
                  </Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, middleName: e.target.value }))
                    }
                    className="border border-border"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" style={{ fontSize: "var(--text-sm)" }}>
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className="border border-border"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
              </div>

              {/* Gender and Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ fontSize: "var(--text-sm)" }}>
                    Gender <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.gender === "male" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setFormData((prev) => ({ ...prev, gender: "male" }))}
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      Male
                    </Button>
                    <Button
                      type="button"
                      variant={formData.gender === "female" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setFormData((prev) => ({ ...prev, gender: "female" }))}
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      Female
                    </Button>
                    <Button
                      type="button"
                      variant={formData.gender === "other" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setFormData((prev) => ({ ...prev, gender: "other" }))}
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      Other
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label style={{ fontSize: "var(--text-sm)" }}>Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-border bg-input-background"
                        style={{ fontSize: "var(--text-base)" }}
                      >
                        {formData.dateOfBirth ? (
                          <span className="font-mono">
                            {format(formData.dateOfBirth, "dd-MMM-yy")}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">dd-mmm-yyyy</span>
                        )}
                        <CalendarIcon className="ml-auto size-4" strokeWidth={ICON_STROKE_WIDTH} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background text-foreground" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={handleDateOfBirthChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Age Breakdown */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="years" style={{ fontSize: "var(--text-sm)" }}>
                    Years <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="years"
                    placeholder="0-125"
                    value={formData.years}
                    readOnly
                    className="bg-muted text-muted-foreground font-mono"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="months" style={{ fontSize: "var(--text-sm)" }}>
                    Months
                  </Label>
                  <Input
                    id="months"
                    placeholder="0-11"
                    value={formData.months}
                    readOnly
                    className="bg-muted text-muted-foreground font-mono"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="days" style={{ fontSize: "var(--text-sm)" }}>
                    Days
                  </Label>
                  <Input
                    id="days"
                    placeholder="0-30"
                    value={formData.days}
                    readOnly
                    className="bg-muted text-muted-foreground font-mono"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3
                  className="text-muted-foreground"
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  Address
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1" style={{ fontSize: "var(--text-sm)" }}>
                    Address Line 1 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))
                    }
                    className="border border-border"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state" style={{ fontSize: "var(--text-sm)" }}>
                      State <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, state: value }))
                      }
                    >
                      <SelectTrigger className="border-border bg-input-background">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="bg-background text-foreground">
                        <SelectItem value="state1">State 1</SelectItem>
                        <SelectItem value="state2">State 2</SelectItem>
                        <SelectItem value="state3">State 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district" style={{ fontSize: "var(--text-sm)" }}>
                      District <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, district: value }))
                      }
                    >
                      <SelectTrigger className="border-border bg-input-background">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent className="bg-background text-foreground">
                        <SelectItem value="district1">District 1</SelectItem>
                        <SelectItem value="district2">District 2</SelectItem>
                        <SelectItem value="district3">District 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pinCode" style={{ fontSize: "var(--text-sm)" }}>
                    PIN Code
                  </Label>
                  <Input
                    id="pinCode"
                    placeholder="Enter 6-digit PIN code"
                    value={formData.pinCode}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, pinCode: e.target.value }))
                    }
                    className="border border-border font-mono"
                    style={{ fontSize: "var(--text-base)" }}
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="space-y-4">
            <h2
              className="font-semibold text-muted-foreground"
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              Visit Details
            </h2>

            {selectedExistingPatient && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "var(--text-sm)" }}>Previous Department:</span>
                  <Badge
                    variant="outline"
                    className={
                      effectiveFollowupWithinPeriod
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground"
                    }
                  >
                    {DEPARTMENT_CONFIGS.find(
                      (department) => department.value === selectedExistingPatient.lastDepartment
                    )?.label ?? selectedExistingPatient.lastDepartment}
                    {effectiveFollowupWithinPeriod ? " (Follow-up Active)" : " (Follow-up Expired)"}
                  </Badge>
                </div>
                <p
                  className={effectiveFollowupWithinPeriod ? "text-primary" : "text-muted-foreground"}
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {effectiveFollowupWithinPeriod
                    ? "Patient is within follow-up period. Consultation fee is waived."
                    : `Follow-up expired${
                        followupExpiryDate ? ` on ${format(followupExpiryDate, "dd-MMM-yy")}` : ""
                      }. Consultation fee is applicable.`}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" style={{ fontSize: "var(--text-sm)" }}>
                  Department <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => {
                    const selectedConfig = DEPARTMENT_CONFIGS.find((config) => config.value === value);
                    if (selectedConfig) {
                      setFormData((prev) => ({
                        ...prev,
                        department: value,
                        roomNumber: selectedConfig.roomNumber,
                        doctor: selectedConfig.doctorValue,
                        visitType: "new",
                      }));
                      return;
                    }
                    setFormData((prev) => ({ ...prev, department: value }));
                  }}
                >
                  <SelectTrigger className="border-border bg-input-background">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    {DEPARTMENT_CONFIGS.map((department) => (
                      <SelectItem key={department.value} value={department.value}>
                        {department.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber" style={{ fontSize: "var(--text-sm)" }}>
                  Room Number
                </Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, roomNumber: e.target.value }))
                  }
                  className="border border-border font-mono"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor" style={{ fontSize: "var(--text-sm)" }}>
                  Doctor <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.doctor}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, doctor: value }))
                  }
                >
                  <SelectTrigger className="border-border bg-input-background">
                    <SelectValue placeholder="Select Doctor" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                    <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                    <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                    <SelectItem value="dr-brown">Dr. Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitType" style={{ fontSize: "var(--text-sm)" }}>
                  Visit Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.visitType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, visitType: value }))
                  }
                  disabled
                >
                  <SelectTrigger className="border-border bg-input-background">
                    <SelectValue placeholder="Select Visit Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="free-followup">Free Follow-up</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="routine">Routine Checkup</SelectItem>
                  </SelectContent>
                </Select>
                {selectedDepartmentConfig && (
                  <p className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
                    Consultation Charge: ₹{currentConsultationFee}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Separator */}
        <Separator orientation="vertical" className="h-auto" />

        {/* Right Column - Statistics Panel */}
        <div className="w-80 shrink-0">
          <Card className="h-full border-t-0 border-r-0">
            <CardHeader>
              <CardTitle
                style={{
                  fontSize: "var(--text-h4)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                Today's Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Total Visits */}
              <div className="border border-border rounded-md bg-background p-4 flex items-center justify-between">
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--text-base)" }}
                >
                  Total Visits
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    fontSize: "var(--text-h3)",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  8
                </span>
              </div>

              {/* New Patient Registrations */}
              <div className="border border-border rounded-md bg-background p-4 flex items-center justify-between">
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--text-base)" }}
                >
                  New Patient Registrations
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    fontSize: "var(--text-h3)",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  7
                </span>
              </div>

              {/* Follow Up Patient Registrations */}
              <div className="border border-border rounded-md bg-background p-4 flex items-center justify-between">
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--text-base)" }}
                >
                  Follow Up Patient Registrations
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    fontSize: "var(--text-h3)",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  1
                </span>
              </div>

              {/* Doctor Pending Consultations */}
              <div className="border border-border rounded-md bg-background p-4 flex items-center justify-between">
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--text-base)" }}
                >
                  Doctor Pending Consultations
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    fontSize: "var(--text-h3)",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  3
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={billingModalOpen} onOpenChange={setBillingModalOpen}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] flex flex-col" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "var(--text-h4)" }}>Billing</DialogTitle>
          </DialogHeader>
          <div className="-mx-6 border-b border-border" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start overflow-y-auto pr-1">
            <div className="lg:col-span-2 space-y-4">
              <p className="font-medium text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
                Medical Services and Charges
              </p>
              <div className="border rounded-md">
              <div
                className="grid grid-cols-12 gap-2 border-b px-3 py-2 text-muted-foreground"
                style={{ fontSize: "var(--text-sm)" }}
              >
                <span className="col-span-1">Sr. No.</span>
                <span className="col-span-4">Service Name</span>
                <span className="col-span-1 text-right">Qty</span>
                <span className="col-span-2 text-right">Unit Price</span>
                <span className="col-span-1 text-right">GST%</span>
                <span className="col-span-1 text-right">Discount</span>
                <span className="col-span-1 text-right">Total Price</span>
                <span className="col-span-1 text-center">Action</span>
              </div>
              {billingRows.map((row, index) => {
                const taxable = row.quantity * row.unitPrice;
                const rowGst = Math.round((taxable * row.gstPercent) / 100);
                const rowTotal = Math.max(taxable + rowGst - row.discount, 0);
                return (
                  <div key={row.id} className="grid grid-cols-12 gap-2 px-3 py-2 border-t" style={{ fontSize: "var(--text-sm)" }}>
                    <span className="col-span-1 pt-2">{index + 1}</span>
                    <div className="col-span-4 border border-border bg-input-background rounded-md overflow-hidden">
                      <Select
                        value={row.serviceName}
                        onValueChange={(value) => handleServiceChange(row.id, value)}
                      >
                        <SelectTrigger className="h-9 border-0 rounded-none bg-transparent">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent className="bg-background text-foreground">
                          {BILLING_SERVICE_OPTIONS
                            .filter((service) =>
                              selectedExistingPatient ? service !== "Registration Charge" : true
                            )
                            .map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {row.serviceContext && (
                        <p className="px-3 pb-2 text-muted-foreground" style={{ fontSize: "var(--text-xs)" }}>
                          {row.serviceContext}
                        </p>
                      )}
                    </div>
                    <Input
                      className="col-span-1 h-9 text-right font-mono border border-border bg-input-background"
                      value={row.quantity}
                      onChange={(e) => updateBillingRow(row.id, "quantity", Number(e.target.value.replace(/[^\d]/g, "") || "0"))}
                    />
                    <Input
                      className="col-span-2 h-9 text-right font-mono border border-border bg-input-background"
                      value={row.unitPrice}
                      onChange={(e) => updateBillingRow(row.id, "unitPrice", Number(e.target.value.replace(/[^\d]/g, "") || "0"))}
                    />
                    <Input
                      className="col-span-1 h-9 text-right font-mono border border-border bg-input-background"
                      value={row.gstPercent}
                      onChange={(e) => updateBillingRow(row.id, "gstPercent", Number(e.target.value.replace(/[^\d]/g, "") || "0"))}
                    />
                    <Input
                      className="col-span-1 h-9 text-right font-mono border border-border bg-input-background"
                      value={row.discount}
                      onChange={(e) => updateBillingRow(row.id, "discount", Number(e.target.value.replace(/[^\d]/g, "") || "0"))}
                    />
                    <span className="col-span-1 pt-2 text-right font-mono">Rs {rowTotal}</span>
                    <div className="col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBillingRow(row.id)}
                        disabled={billingRows.length <= 1}
                        className="h-8 w-8"
                        title="Remove row"
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
              <div className="px-3 py-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={addBillingRow} style={{ fontSize: "var(--text-sm)" }}>
                  Add Another Row
                </Button>
              </div>
              </div>

            </div>

            <div className="space-y-4 lg:border-l lg:pl-4">
              <div className="border rounded-md p-4 space-y-2">
                <p className="font-medium text-muted-foreground mb-2" style={{ fontSize: "var(--text-sm)" }}>
                  Billing Summary
                </p>
                <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                  <span className="text-muted-foreground">Total Billed Amount</span>
                  <span className="font-mono">Rs {totalBilledAmount}</span>
                </div>
                <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                  <span className="text-muted-foreground">Item Level Discount</span>
                  <span className="font-mono">Rs {discountAmount}</span>
                </div>
                <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                  <span className="text-muted-foreground">Bill Level Discount</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-muted-foreground">Rs</span>
                    <Input
                      value={billLevelDiscount}
                      onChange={(e) => setBillLevelDiscount(e.target.value.replace(/[^\d]/g, ""))}
                      className="h-9 w-32 text-right font-mono border border-border bg-input-background"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                  <span className="text-muted-foreground">GST Amount</span>
                  <span className="font-mono">Rs {totalGstAmount}</span>
                </div>
                <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                  <span className="text-muted-foreground">Final Amount</span>
                  <span className="font-mono font-semibold">Rs {finalBillAmount}</span>
                </div>
                <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                  <span className="text-muted-foreground">Received Amount</span>
                  <span className="font-mono">Rs {receivedAmount}</span>
                </div>
                <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                  <span className="text-muted-foreground">Total Balance</span>
                  <span className={`font-mono font-semibold ${balanceAmount > 0 ? "text-destructive" : ""}`}>
                    Rs {balanceAmount}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-muted-foreground mb-2" style={{ fontSize: "var(--text-sm)" }}>
                  Payment Details
                </p>
                <Label style={{ fontSize: "var(--text-sm)" }}>
                  Payment Mode <span className="text-destructive">*</span>
                </Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger className="border-border bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentAmount" style={{ fontSize: "var(--text-sm)" }}>
                  Payment Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value.replace(/[^\d]/g, ""))}
                  className="border border-border font-mono"
                />
              </div>
              {paymentMode === "upi" && (
                <div className="border rounded-md p-4 text-center bg-background">
                  <div className="mx-auto h-28 w-28 border border-border rounded-md bg-white p-2">
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${(i % 3 === 0 || i % 5 === 0 || i % 7 === 0) ? "bg-slate-700" : "bg-slate-200"} h-3 w-3`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-muted-foreground" style={{ fontSize: "var(--text-xs)" }}>
                    Scan to pay with UPI
                  </p>
                </div>
              )}
              {paymentMode !== "cash" && (
                <div className="space-y-2">
                  <Label htmlFor="transactionId" style={{ fontSize: "var(--text-sm)" }}>
                    Transaction ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="border border-border font-mono"
                    placeholder="Enter transaction reference"
                  />
                </div>
              )}
              {paymentMode === "card" && (
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" style={{ fontSize: "var(--text-sm)" }}>
                    Card Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cardNumber"
                    type="password"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^\d]/g, "").slice(0, 16))}
                    className="border border-border font-mono"
                    placeholder="Enter card number"
                  />
                  <p className="text-muted-foreground font-mono" style={{ fontSize: "var(--text-xs)" }}>
                    Card: **** **** **** {cardNumber.slice(-4).padStart(4, "*")}
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBillingModalOpen(false)} style={{ fontSize: "var(--text-sm)" }}>
              Cancel
            </Button>
            <Button
              onClick={handleCollectPaymentAndContinue}
              disabled={!isBillingFormValid}
              style={{ fontSize: "var(--text-sm)" }}
            >
              Collect Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={opdSlipModalOpen} onOpenChange={setOpdSlipModalOpen}>
        <DialogContent className="sm:max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "var(--text-h4)" }}>OPD Slip Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 border rounded-md p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold" style={{ fontSize: "var(--text-base)" }}>Patient Visit Slip</p>
              <Badge variant="outline" className="font-mono">
                {latestFinalizedVisit?.visitId ?? "-"}
              </Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3" style={{ fontSize: "var(--text-sm)" }}>
              <p><span className="text-muted-foreground">Name:</span> {latestFinalizedVisit?.patientName ?? "-"}</p>
              <p><span className="text-muted-foreground">UHID:</span> {latestFinalizedVisit?.uhid ?? "-"}</p>
              <p><span className="text-muted-foreground">Department:</span> {selectedDepartmentConfig?.label ?? "-"}</p>
              <p><span className="text-muted-foreground">Doctor:</span> {latestFinalizedVisit?.doctorLabel ?? "-"}</p>
              <p><span className="text-muted-foreground">Visit Type:</span> {formData.visitType.toUpperCase()}</p>
              <p><span className="text-muted-foreground">Date:</span> {latestFinalizedVisit ? format(latestFinalizedVisit.visitCreated, "dd-MMM-yy, hh:mm a") : "-"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.print();
                }
              }}
              style={{ fontSize: "var(--text-sm)" }}
            >
              Print Slip
            </Button>
            <Button variant="outline" onClick={handleRegisterAnotherPatient} style={{ fontSize: "var(--text-sm)" }}>
              Register New Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RegisterPatientPage;