import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select";
import { ChevronLeft, Upload, Plus, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Label } from "../app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../app/components/ui/radio-group";
import { toast } from "sonner";
import { useUsers } from "../contexts/UsersContext";

const FACILITIES = {
  "1": "Main Hospital",
  "2": "East Wing Clinic",
  "3": "North Diagnostic Center",
};

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const DEPARTMENTS = [
  "Emergency (ER)", "In-Patient (IPD)", "Laboratory (LAB)", "Pharmacy (PHARM)"
];

const DAYS = ["M", "T", "W", "T2", "F", "S"];
const DAY_LABELS: { [key: string]: string } = {
  "M": "Monday",
  "T": "Tuesday", 
  "W": "Wednesday",
  "T2": "Thursday",
  "F": "Friday",
  "S": "Saturday"
};

type DepartmentDetails = {
  id: string;
  department: string;
  roomNumber: string;
  opdDays: string[];
  consultationCharges: string;
};

export default function AddUserPage() {
  const navigate = useNavigate();
  const { facilityId } = useParams<{ facilityId: string }>();
  const facilityName = facilityId ? FACILITIES[facilityId as keyof typeof FACILITIES] : "";
  const { users, addUser } = useUsers();

  const [formData, setFormData] = React.useState({
    // Section 1: Role
    role: "",
    
    // Section 2: General Details
    employeeId: "",
    username: "",
    password: "",
    fullName: "",
    gender: "",
    
    // Section 3: Contact Information
    mobileNumber: "",
    email: "",
    addressLine1: "",
    pincode: "",
    locality: "",
    block: "",
    district: "",
    state: "",
    healthFacility: facilityId || "",
    
    // Section 4: Professional Credentials (Doctor only)
    qualification: "",
    designation: "",
    registrationNo: "",
    registrationCouncil: "",
    hprId: "",
    signature: null as File | null,
  });

  const [departments, setDepartments] = React.useState<DepartmentDetails[]>([
    {
      id: "1",
      department: "",
      roomNumber: "",
      opdDays: [],
      consultationCharges: "",
    }
  ]);

  const handleBack = () => {
    navigate(`/masters/facilities/${facilityId}/users`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, signature: file }));
  };

  const handleDepartmentChange = (id: string, field: keyof DepartmentDetails, value: string | string[]) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, [field]: value } : dept
      )
    );
  };

  const toggleOpdDay = (deptId: string, day: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === deptId) {
          const opdDays = dept.opdDays.includes(day)
            ? dept.opdDays.filter((d) => d !== day)
            : [...dept.opdDays, day];
          return { ...dept, opdDays };
        }
        return dept;
      })
    );
  };

  const addDepartment = () => {
    const newDept: DepartmentDetails = {
      id: Date.now().toString(),
      department: "",
      roomNumber: "",
      opdDays: [],
      consultationCharges: "",
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const removeDepartment = (id: string) => {
    if (departments.length === 1) {
      toast.error("At least one department is required");
      return;
    }
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
  };

  const isFormValid = () => {
    const baseValid =
      formData.role &&
      formData.username &&
      formData.password &&
      formData.fullName &&
      formData.gender &&
      formData.mobileNumber &&
      formData.healthFacility;

    if (formData.role === "DOCTOR") {
      const doctorValid =
        formData.qualification &&
        formData.designation &&
        formData.registrationNo &&
        formData.registrationCouncil &&
        departments.every(dept => dept.department && dept.consultationCharges);
      return baseValid && doctorValid;
    }

    return baseValid;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Create new user
    const totalConsultationCharges = formData.role === "DOCTOR" && departments.length > 0
      ? Math.max(...departments.map(d => parseInt(d.consultationCharges) || 0))
      : 0;
    
    // Format current date/time
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }).toUpperCase().replace(/ /g, "-");
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const createdAt = `${formattedDate}, ${formattedTime}`;
    
    // Generate new user ID
    const newId = String(users.length + 1);
    
    const newUser = {
      id: newId,
      facilityId: facilityId || "",
      name: formData.fullName,
      emailId: formData.email,
      address: formData.addressLine1,
      consultationCharges: totalConsultationCharges,
      createdBy: "Current User", // In real app, use logged-in user
      createdAt: createdAt,
      lastModifiedBy: "Current User",
      lastModifiedAt: createdAt,
    };
    
    addUser(newUser);
    toast.success("User added successfully");
    navigate(`/masters/facilities/${facilityId}/users`);
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
          <div>
            <h1
              className="font-semibold"
              style={{
                fontSize: "var(--text-h4)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              Add New User
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
              {facilityName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid()}>
            Add User
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. Role */}
          <div className="space-y-4">
            <h2
              className="font-semibold"
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              1. Role
            </h2>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" style={{ fontSize: "var(--text-sm)" }}>
                  Select Role *
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger id="role" className="border-border bg-input-background">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    <SelectItem value="DOCTOR">Doctor</SelectItem>
                    <SelectItem value="NURSE">Nurse</SelectItem>
                    <SelectItem value="FRONTDESK">Front Desk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 2. General Details */}
          <div className="space-y-4">
            <h2
              className="font-semibold"
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              2. General Details
            </h2>

            {/* Row 1: Employee ID, Username, Password, Full Name */}
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId" style={{ fontSize: "var(--text-sm)" }}>
                  Employee ID <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                  className="border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" style={{ fontSize: "var(--text-sm)" }}>
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" style={{ fontSize: "var(--text-sm)" }}>
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" style={{ fontSize: "var(--text-sm)" }}>
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>
            </div>

            {/* Row 2: Gender */}
            <div className="space-y-2">
              <Label style={{ fontSize: "var(--text-sm)" }}>Gender *</Label>
              <RadioGroup value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" style={{ fontSize: "var(--text-sm)" }} className="cursor-pointer">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" style={{ fontSize: "var(--text-sm)" }} className="cursor-pointer">
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="others" id="others" />
                    <Label htmlFor="others" style={{ fontSize: "var(--text-sm)" }} className="cursor-pointer">
                      Others
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 3. Contact Information */}
          <div className="space-y-4">
            <h2
              className="font-semibold"
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              3. Contact Information
            </h2>

            {/* Row 1: Mobile No., Email, Address Line 1, Pincode */}
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber" style={{ fontSize: "var(--text-sm)" }}>
                  Mobile No. *
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value="+91"
                    readOnly
                    className="w-16 bg-muted text-muted-foreground font-mono"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="Enter"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                    className="border-border font-mono flex-1"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" style={{ fontSize: "var(--text-sm)" }}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine1" style={{ fontSize: "var(--text-sm)" }}>
                  Address Line 1
                </Label>
                <Input
                  id="addressLine1"
                  type="text"
                  placeholder="Enter"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                  className="border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode" style={{ fontSize: "var(--text-sm)" }}>
                  Pincode
                </Label>
                <Input
                  id="pincode"
                  type="text"
                  placeholder="Enter"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className="border-border font-mono"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>
            </div>

            {/* Row 2: Locality, Block, District, State */}
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locality" style={{ fontSize: "var(--text-sm)" }}>
                  Locality
                </Label>
                <Input
                  id="locality"
                  type="text"
                  placeholder="Enter"
                  value={formData.locality}
                  onChange={(e) => handleInputChange("locality", e.target.value)}
                  className="border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="block" style={{ fontSize: "var(--text-sm)" }}>
                  Block
                </Label>
                <Input
                  id="block"
                  type="text"
                  placeholder="Enter"
                  value={formData.block}
                  onChange={(e) => handleInputChange("block", e.target.value)}
                  className="border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district" style={{ fontSize: "var(--text-sm)" }}>
                  District
                </Label>
                <Input
                  id="district"
                  type="text"
                  placeholder="Enter"
                  value={formData.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                  className="border-border"
                  style={{ fontSize: "var(--text-base)" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" style={{ fontSize: "var(--text-sm)" }}>
                  State
                </Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger id="state" className="border-border bg-input-background">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    {STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Health Facility */}
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="healthFacility" style={{ fontSize: "var(--text-sm)" }}>
                  Health Facility *
                </Label>
                <Select value={formData.healthFacility} onValueChange={(value) => handleInputChange("healthFacility", value)}>
                  <SelectTrigger id="healthFacility" className="border-border bg-input-background">
                    <SelectValue placeholder="Select Health Facility" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    {Object.entries(FACILITIES).map(([id, name]) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 4. Professional Credentials (Doctor only) */}
          {formData.role === "DOCTOR" && (
            <div className="space-y-4">
              <h2
                className="font-semibold"
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                4. Professional Credentials
              </h2>

              {/* Row 1: Qualification, Designation, Registration No., Registration Council */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualification" style={{ fontSize: "var(--text-sm)" }}>
                    Qualification *
                  </Label>
                  <Input
                    id="qualification"
                    type="text"
                    placeholder="Enter"
                    value={formData.qualification}
                    onChange={(e) => handleInputChange("qualification", e.target.value)}
                    className="border-border"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation" style={{ fontSize: "var(--text-sm)" }}>
                    Designation *
                  </Label>
                  <Input
                    id="designation"
                    type="text"
                    placeholder="Enter Designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    className="border-border"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNo" style={{ fontSize: "var(--text-sm)" }}>
                    Registration No. *
                  </Label>
                  <Input
                    id="registrationNo"
                    type="text"
                    placeholder="Enter Registration No."
                    value={formData.registrationNo}
                    onChange={(e) => handleInputChange("registrationNo", e.target.value)}
                    className="border-border font-mono"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationCouncil" style={{ fontSize: "var(--text-sm)" }}>
                    Registration Council *
                  </Label>
                  <Input
                    id="registrationCouncil"
                    type="text"
                    placeholder="Enter Registration Council"
                    value={formData.registrationCouncil}
                    onChange={(e) => handleInputChange("registrationCouncil", e.target.value)}
                    className="border-border"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>
              </div>

              {/* Row 2: HPR ID, Signature */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hprId" style={{ fontSize: "var(--text-sm)" }}>
                    HPR ID <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="hprId"
                    type="text"
                    placeholder="Enter HPR ID"
                    value={formData.hprId}
                    onChange={(e) => handleInputChange("hprId", e.target.value)}
                    className="border-border font-mono"
                    style={{ fontSize: "var(--text-base)" }}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="signature" style={{ fontSize: "var(--text-sm)" }}>
                    Signature
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="signature-display"
                      type="text"
                      value={formData.signature?.name || ""}
                      placeholder="Signature.png"
                      readOnly
                      className="border-border flex-1"
                      style={{ fontSize: "var(--text-base)" }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("signature")?.click()}
                    >
                      <Upload className="size-4 mr-2" />
                      Upload
                    </Button>
                    <input
                      id="signature"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Department and OPD Details (Doctor only) */}
          {formData.role === "DOCTOR" && (
            <div className="space-y-4">
              <h2
                className="font-semibold"
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                {formData.role === "DOCTOR" ? "5" : "4"}. Department and OPD Details
              </h2>

              {departments.map((dept, index) => (
                <div key={dept.id} className="border rounded-md p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: "var(--text-sm)" }}>
                      Department {index + 1}
                    </span>
                    {departments.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDepartment(dept.id)}
                      >
                        <X className="size-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Row 1: Department, Room Number, Consultation Charges */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`department-${dept.id}`} style={{ fontSize: "var(--text-sm)" }}>
                        Department *
                      </Label>
                      <Select
                        value={dept.department}
                        onValueChange={(value) => handleDepartmentChange(dept.id, "department", value)}
                      >
                        <SelectTrigger id={`department-${dept.id}`} className="border-border bg-input-background">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent className="bg-background text-foreground">
                          {DEPARTMENTS.map((department) => (
                            <SelectItem key={department} value={department}>
                              {department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`roomNumber-${dept.id}`} style={{ fontSize: "var(--text-sm)" }}>
                        Room Number
                      </Label>
                      <Input
                        id={`roomNumber-${dept.id}`}
                        type="text"
                        placeholder="Enter Room Number"
                        value={dept.roomNumber}
                        onChange={(e) => handleDepartmentChange(dept.id, "roomNumber", e.target.value)}
                        className="border-border font-mono"
                        style={{ fontSize: "var(--text-base)" }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`consultationCharges-${dept.id}`} style={{ fontSize: "var(--text-sm)" }}>
                        Consultation Charges *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono" style={{ fontSize: "var(--text-base)" }}>
                          ₹
                        </span>
                        <Input
                          id={`consultationCharges-${dept.id}`}
                          type="number"
                          placeholder="0"
                          value={dept.consultationCharges}
                          onChange={(e) => handleDepartmentChange(dept.id, "consultationCharges", e.target.value)}
                          className="border-border font-mono pl-7"
                          style={{ fontSize: "var(--text-base)" }}
                        />
                      </div>
                      <span className="text-primary" style={{ fontSize: "var(--text-xs)" }}>
                        Range: ₹0-₹3,000
                      </span>
                    </div>
                  </div>

                  {/* Row 2: OPD Days */}
                  <div className="space-y-2">
                    <Label style={{ fontSize: "var(--text-sm)" }}>OPD Days</Label>
                    <div className="flex items-center gap-2">
                      {DAYS.map((day) => (
                        <Button
                          key={day}
                          type="button"
                          variant={dept.opdDays.includes(day) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleOpdDay(dept.id, day)}
                          className="w-10 h-10 p-0"
                          style={{ fontSize: "var(--text-sm)" }}
                        >
                          {day === "T2" ? "T" : day}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addDepartment}
              >
                <Plus className="size-4 mr-2" />
                Add Department
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}