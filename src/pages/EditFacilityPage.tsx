"use client";

// Edit Facility Page - Updated with shared state management
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Label } from "../app/components/ui/label";
import { MultiSelectBadge } from "../app/components/ui/multi-select-badge";
import { RadioGroup, RadioGroupItem } from "../app/components/ui/radio-group";
import { useFacilities } from "../contexts/FacilitiesContext";
import { toast } from "sonner";

// Available departments for selection
const AVAILABLE_DEPARTMENTS = [
  { id: "general_medicine", label: "General Medicine" },
  { id: "surgery", label: "Surgery" },
  { id: "pediatrics", label: "Pediatrics" },
  { id: "cardiology", label: "Cardiology" },
  { id: "orthopedics", label: "Orthopedics" },
  { id: "neurology", label: "Neurology" },
  { id: "dermatology", label: "Dermatology" },
  { id: "gynecology", label: "Gynecology" },
  { id: "ent", label: "ENT" },
  { id: "ophthalmology", label: "Ophthalmology" },
];

// Available roles for selection
const AVAILABLE_ROLES = [
  { id: "admin", label: "Administrator" },
  { id: "doc12", label: "Doctor" },
  { id: "nurse", label: "Nurse" },
  { id: "frogs", label: "Receptionist" },
];

type FacilityFormData = {
  facilityId: string;
  facilityName: string;
  facilityEmail: string;
  departments: string[];
  roles: string[];
  phoneCountryCode: string;
  phoneNumber: string;
  addressLine1: string;
  pincode: string;
  locality: string;
  block: string;
  district: string;
  state: string;
  registrationCharges: string;
  emergencyCharges: string;
  facilityType: "private" | "government";
  followUpDays: string;
  followUpVisits: string;
};

type ValidationErrors = {
  registrationCharges?: string;
  emergencyCharges?: string;
  followUpDays?: string;
  followUpVisits?: string;
  phoneNumber?: string;
  pincode?: string;
};

export function EditFacilityPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getFacilityById, updateFacility } = useFacilities();

  // Load facility data from context
  const facilityData = id ? getFacilityById(id) : null;

  const initialData: FacilityFormData = facilityData
    ? {
        facilityId: facilityData.facilityId,
        facilityName: facilityData.facilityName,
        facilityEmail: facilityData.facilityEmail,
        departments: facilityData.departments,
        roles: facilityData.roles,
        phoneCountryCode: facilityData.phoneCountryCode,
        phoneNumber: facilityData.phoneNumber,
        addressLine1: facilityData.addressLine1,
        pincode: facilityData.pincode,
        locality: facilityData.locality,
        block: facilityData.block,
        district: facilityData.district,
        state: facilityData.state,
        registrationCharges: facilityData.registrationCharges,
        emergencyCharges: facilityData.emergencyCharges,
        facilityType: facilityData.facilityType,
        followUpDays: facilityData.followUpDays,
        followUpVisits: facilityData.followUpVisits,
      }
    : {
        facilityId: "UNKNOWN",
        facilityName: "",
        facilityEmail: "",
        departments: [],
        roles: [],
        phoneCountryCode: "+91",
        phoneNumber: "",
        addressLine1: "",
        pincode: "",
        locality: "",
        block: "",
        district: "",
        state: "",
        registrationCharges: "0",
        emergencyCharges: "0",
        facilityType: "private",
        followUpDays: "7",
        followUpVisits: "0",
      };

  const [formData, setFormData] = React.useState<FacilityFormData>(initialData);
  const [errors, setErrors] = React.useState<ValidationErrors>({});

  const handleBack = () => {
    navigate(-1);
  };

  const handleDepartmentsChange = (departments: string[]) => {
    setFormData((prev) => ({ ...prev, departments }));
  };

  const handleRolesChange = (roles: string[]) => {
    setFormData((prev) => ({ ...prev, roles }));
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // Validate registration charges
    if (!/^\d+$/.test(formData.registrationCharges)) {
      newErrors.registrationCharges = "Registration charges must be a number.";
    } else {
      const charges = parseInt(formData.registrationCharges, 10);
      if (charges < 0 || charges > 2000) {
        newErrors.registrationCharges = "Registration charges must be between 0 and 2000.";
      }
    }

    // Validate emergency charges
    if (!/^\d+$/.test(formData.emergencyCharges)) {
      newErrors.emergencyCharges = "Emergency charges must be a number.";
    } else {
      const charges = parseInt(formData.emergencyCharges, 10);
      if (charges < 0 || charges > 2000) {
        newErrors.emergencyCharges = "Emergency charges must be between 0 and 2000.";
      }
    }

    // Validate follow-up days
    if (!/^\d+$/.test(formData.followUpDays)) {
      newErrors.followUpDays = "Follow-up days must be a number.";
    } else {
      const days = parseInt(formData.followUpDays, 10);
      if (days < 0 || days > 40) {
        newErrors.followUpDays = "Follow-up days must be between 0 and 40.";
      }
    }

    // Validate follow-up visits
    if (!/^\d+$/.test(formData.followUpVisits)) {
      newErrors.followUpVisits = "Follow-up visits must be a number.";
    } else {
      const visits = parseInt(formData.followUpVisits, 10);
      if (visits < 0 || visits > 3) {
        newErrors.followUpVisits = "Follow-up visits must be between 0 and 3.";
      }
    }

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }

    // Validate pincode
    if (!/^\d+$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be a number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneNumberChange = (value: string) => {
    // Only allow digits, max 10
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phoneNumber: digitsOnly }));
    
    // Clear error when user reaches 10 digits
    if (digitsOnly.length === 10) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    } else if (digitsOnly.length > 0) {
      setErrors((prev) => ({ ...prev, phoneNumber: "Phone number must be exactly 10 digits." }));
    } else {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  };

  const handleRegistrationChargesChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    
    // Don't allow values greater than 2000
    if (digitsOnly === "") {
      setFormData((prev) => ({ ...prev, registrationCharges: "" }));
      setErrors((prev) => ({ ...prev, registrationCharges: undefined }));
      return;
    }
    
    const charges = parseInt(digitsOnly, 10);
    if (charges <= 2000) {
      setFormData((prev) => ({ ...prev, registrationCharges: digitsOnly }));
      setErrors((prev) => ({ ...prev, registrationCharges: undefined }));
    }
    // If > 2000, don't update the value (prevent input)
  };

  const handleEmergencyChargesChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    
    // Don't allow values greater than 2000
    if (digitsOnly === "") {
      setFormData((prev) => ({ ...prev, emergencyCharges: "" }));
      setErrors((prev) => ({ ...prev, emergencyCharges: undefined }));
      return;
    }
    
    const charges = parseInt(digitsOnly, 10);
    if (charges <= 2000) {
      setFormData((prev) => ({ ...prev, emergencyCharges: digitsOnly }));
      setErrors((prev) => ({ ...prev, emergencyCharges: undefined }));
    }
    // If > 2000, don't update the value (prevent input)
  };

  const handleFollowUpDaysChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    
    if (digitsOnly === "") {
      setFormData((prev) => ({ ...prev, followUpDays: "0" }));
      setErrors((prev) => ({ ...prev, followUpDays: undefined }));
      return;
    }
    
    const numValue = parseInt(digitsOnly, 10);
    if (numValue >= 0 && numValue <= 40) {
      setFormData((prev) => ({ ...prev, followUpDays: numValue.toString() }));
      setErrors((prev) => ({ ...prev, followUpDays: undefined }));
    }
    // If outside range, don't update the value (prevent input)
  };

  const handleFollowUpVisitsChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    
    if (digitsOnly === "") {
      setFormData((prev) => ({ ...prev, followUpVisits: "0" }));
      setErrors((prev) => ({ ...prev, followUpVisits: undefined }));
      return;
    }
    
    const numValue = parseInt(digitsOnly, 10);
    if (numValue >= 0 && numValue <= 3) {
      setFormData((prev) => ({ ...prev, followUpVisits: numValue.toString() }));
      setErrors((prev) => ({ ...prev, followUpVisits: undefined }));
    }
    // If outside range, don't update the value (prevent input)
  };

  const handlePincodeChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, pincode: digitsOnly }));
    setErrors((prev) => ({ ...prev, pincode: undefined }));
  };

  const handleUpdateFacility = () => {
    if (validateForm() && id) {
      // Update facility in context
      updateFacility(id, formData);
      toast.success("Facility updated successfully!");
      // Navigate back after successful update
      setTimeout(() => {
        navigate(-1);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page Header with Back Button and Actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            aria-label="Go back"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <h1
            className="font-semibold"
            style={{
              fontSize: "var(--text-h4)",
              fontWeight: "var(--font-weight-semibold)",
            }}
          >
            Edit Facility
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button onClick={handleUpdateFacility}>
            Update Facility
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. Facility Details */}
          <div className="space-y-4">
            <h2
              className="font-semibold"
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              1. Facility Details
            </h2>

            {/* Row 1: Facility ID, Facility Name, Facility Email */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facilityId" style={{ fontSize: "var(--text-sm)" }}>
                  Facility ID
                </Label>
                <Input
                  id="facilityId"
                  value={formData.facilityId}
                  readOnly
                  className="bg-muted text-muted-foreground"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facilityName" style={{ fontSize: "var(--text-sm)" }}>
                  Facility Name
                </Label>
                <Input
                  id="facilityName"
                  value={formData.facilityName}
                  readOnly
                  className="bg-muted text-muted-foreground"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facilityEmail" style={{ fontSize: "var(--text-sm)" }}>
                  Facility Email ID
                </Label>
                <Input
                  id="facilityEmail"
                  type="email"
                  value={formData.facilityEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, facilityEmail: e.target.value }))}
                  className="border border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>
            </div>

            {/* Row 2: Department */}
            <div className="space-y-2">
              <Label style={{ fontSize: "var(--text-sm)" }}>
                Department
              </Label>
              <MultiSelectBadge
                options={AVAILABLE_DEPARTMENTS}
                selected={formData.departments}
                onChange={handleDepartmentsChange}
                placeholder="Select departments..."
              />
            </div>

            {/* Row 3: Role */}
            <div className="space-y-2">
              <Label style={{ fontSize: "var(--text-sm)" }}>
                Role
              </Label>
              <MultiSelectBadge
                options={AVAILABLE_ROLES}
                selected={formData.roles}
                onChange={handleRolesChange}
                placeholder="Select roles..."
              />
            </div>

            {/* Row 4: Phone Number */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" style={{ fontSize: "var(--text-sm)" }}>
                  Phone Number
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phoneCountryCode: e.target.value }))}
                    className="border border-border font-mono w-20"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                    className="border border-border font-mono flex-1"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500" style={{ fontSize: "var(--text-xs)" }}>{errors.phoneNumber}</p>}
              </div>
            </div>
          </div>

          {/* 2. Facility Address */}
          <div className="space-y-4">
            <h2
              className="font-semibold"
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              2. Facility Address
            </h2>

            {/* Row 1: Address Line 1, Pincode, Locality */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1" style={{ fontSize: "var(--text-sm)" }}>
                  Address Line 1
                </Label>
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))}
                  className="border border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode" style={{ fontSize: "var(--text-sm)" }}>
                  Pincode
                </Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className="border border-border font-mono"
                  style={{ fontSize: "var(--text-base)" }}
                />
                {errors.pincode && <p className="text-red-500" style={{ fontSize: "var(--text-xs)" }}>{errors.pincode}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locality" style={{ fontSize: "var(--text-sm)" }}>
                  Locality
                </Label>
                <Input
                  id="locality"
                  value={formData.locality}
                  readOnly
                  className="bg-muted text-muted-foreground"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>
            </div>

            {/* Row 2: Block, District, State */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="block" style={{ fontSize: "var(--text-sm)" }}>
                  Block
                </Label>
                <Input
                  id="block"
                  value={formData.block}
                  readOnly
                  className="bg-muted text-muted-foreground"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district" style={{ fontSize: "var(--text-sm)" }}>
                  District
                </Label>
                <Input
                  id="district"
                  value={formData.district}
                  readOnly
                  className="bg-muted text-muted-foreground"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" style={{ fontSize: "var(--text-sm)" }}>
                  State
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  readOnly
                  className="bg-muted text-muted-foreground"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>
            </div>
          </div>

          {/* 3. Configuration & Billing */}
          <div className="space-y-4">
            <h2
              className="font-semibold"
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              3. Configuration & Billing
            </h2>

            {/* Row 1: Facility Type, Registration Charges, Emergency Charges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label style={{ fontSize: "var(--text-sm)" }}>
                  Facility Type
                </Label>
                <RadioGroup
                  value={formData.facilityType}
                  onValueChange={(value) => {
                    const v = value as "private" | "government";
                    setFormData((prev) => ({
                      ...prev,
                      facilityType: v,
                      registrationCharges: v === "private" ? "100" : "1",
                      emergencyCharges: v === "private" ? "100" : "0",
                      followUpDays: v === "private" ? "7" : "15",
                      followUpVisits: "1",
                    }));
                  }}
                  className="flex items-center gap-6 h-10"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="cursor-pointer" style={{ fontSize: "var(--text-base)" }}>Private</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="government" id="government" />
                    <Label htmlFor="government" className="cursor-pointer" style={{ fontSize: "var(--text-base)" }}>Government</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationCharges" style={{ fontSize: "var(--text-sm)" }}>
                  Registration Charges
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono" style={{ fontSize: "var(--text-base)" }}>
                    ₹
                  </span>
                  <Input
                    id="registrationCharges"
                    type="number"
                    value={formData.registrationCharges}
                    onChange={(e) => handleRegistrationChargesChange(e.target.value)}
                    className="border border-border font-mono pl-7"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
                {errors.registrationCharges && <p className="text-red-500" style={{ fontSize: "var(--text-xs)" }}>{errors.registrationCharges}</p>}
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-xs)" }}>
                  Range: ₹0-₹2000
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyCharges" style={{ fontSize: "var(--text-sm)" }}>
                  Emergency Charges
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono" style={{ fontSize: "var(--text-base)" }}>
                    ₹
                  </span>
                  <Input
                    id="emergencyCharges"
                    type="number"
                    value={formData.emergencyCharges}
                    onChange={(e) => handleEmergencyChargesChange(e.target.value)}
                    className="border border-border font-mono pl-7"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
                {errors.emergencyCharges && <p className="text-red-500" style={{ fontSize: "var(--text-xs)" }}>{errors.emergencyCharges}</p>}
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-xs)" }}>
                  Range: ₹0-₹2000
                </p>
              </div>
            </div>

            {/* Row 2: Follow-up Configuration */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="followUpDays" style={{ fontSize: "var(--text-sm)" }}>
                  Free Follow-up Days
                </Label>
                <Input
                  id="followUpDays"
                  type="number"
                  min="0"
                  max="40"
                  value={formData.followUpDays}
                  onChange={(e) => handleFollowUpDaysChange(e.target.value)}
                  className="border border-border font-mono"
                  style={{ fontSize: "var(--text-base)" }}
                />
                {errors.followUpDays && <p className="text-red-500" style={{ fontSize: "var(--text-xs)" }}>{errors.followUpDays}</p>}
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-xs)" }}>
                  Range: 0-40 days
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="followUpVisits" style={{ fontSize: "var(--text-sm)" }}>
                  Free Follow-up Visits
                </Label>
                <Input
                  id="followUpVisits"
                  type="number"
                  min="0"
                  max="3"
                  value={formData.followUpVisits}
                  onChange={(e) => handleFollowUpVisitsChange(e.target.value)}
                  className="border border-border font-mono"
                  style={{ fontSize: "var(--text-base)" }}
                />
                {errors.followUpVisits && <p className="text-red-500" style={{ fontSize: "var(--text-xs)" }}>{errors.followUpVisits}</p>}
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-xs)" }}>
                  Range: 0-3 visits
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}