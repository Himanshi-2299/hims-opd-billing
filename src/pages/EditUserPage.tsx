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

type UserFormData = {
  role: string;
  employeeId: string;
  username: string;
  password: string;
  fullName: string;
  gender: string;
  mobileNumber: string;
  email: string;
  addressLine1: string;
  pincode: string;
  locality: string;
  block: string;
  district: string;
  state: string;
  healthFacility: string;
  qualification: string;
  designation: string;
  registrationNo: string;
  registrationCouncil: string;
  hprId: string;
  signature: File | null;
};

// Mock user data - In a real app, this would come from an API
const MOCK_USERS: Record<string, UserFormData> = {
  "1": {
    role: "DOCTOR",
    healthFacility: "1",
    employeeId: "DOC001",
    username: "dr.kumar",
    password: "password123",
    fullName: "Dr. Rajesh Kumar",
    gender: "male",
    mobileNumber: "9988776655",
    email: "rajesh.kumar@hospital.com",
    addressLine1: "456 Medical Plaza",
    pincode: "110001",
    locality: "Connaught Place",
    block: "Block D",
    district: "New Delhi",
    state: "Delhi",
    qualification: "MBBS, MS (Ortho)",
    designation: "Orthopedic Surgeon",
    registrationNo: "MCI54321",
    registrationCouncil: "Medical Council of India",
    hprId: "91-1234-5678-9012",
    signature: null,
  },
  "2": {
    role: "DOCTOR",
    healthFacility: "1",
    employeeId: "DOC002",
    username: "dr.smith",
    password: "password123",
    fullName: "Dr. Sarah Smith",
    gender: "female",
    mobileNumber: "9876543210",
    email: "sarah.smith@hospital.com",
    addressLine1: "123 Medical Center Dr",
    pincode: "10001",
    locality: "Manhattan",
    block: "Block B",
    district: "New York",
    state: "Maharashtra",
    qualification: "MBBS, MD (Cardiology)",
    designation: "Senior Cardiologist",
    registrationNo: "MCI12345",
    registrationCouncil: "Medical Council of India",
    hprId: "91-2345-6789-0123",
    signature: null,
  },
  "3": {
    role: "DOCTOR",
    healthFacility: "1",
    employeeId: "DOC003",
    username: "dr.sharma",
    password: "password123",
    fullName: "Dr. Priya Sharma",
    gender: "female",
    mobileNumber: "9123456789",
    email: "priya.sharma@hospital.com",
    addressLine1: "789 Healthcare Avenue",
    pincode: "400001",
    locality: "Andheri West",
    block: "Block A",
    district: "Mumbai",
    state: "Maharashtra",
    qualification: "MBBS, MD (Pediatrics)",
    designation: "Pediatrician",
    registrationNo: "MCI23456",
    registrationCouncil: "Medical Council of India",
    hprId: "91-3456-7890-1234",
    signature: null,
  },
  "4": {
    role: "DOCTOR",
    healthFacility: "1",
    employeeId: "DOC004",
    username: "dr.patel",
    password: "password123",
    fullName: "Dr. Amit Patel",
    gender: "male",
    mobileNumber: "9876789012",
    email: "amit.patel@hospital.com",
    addressLine1: "321 Neurology Center",
    pincode: "560001",
    locality: "MG Road",
    block: "Block C",
    district: "Bangalore",
    state: "Karnataka",
    qualification: "MBBS, DM (Neurology)",
    designation: "Neurologist",
    registrationNo: "MCI34567",
    registrationCouncil: "Medical Council of India",
    hprId: "91-4567-8901-2345",
    signature: null,
  },
  "5": {
    role: "DOCTOR",
    healthFacility: "1",
    employeeId: "DOC005",
    username: "dr.desai",
    password: "password123",
    fullName: "Dr. Anita Desai",
    gender: "female",
    mobileNumber: "9345678901",
    email: "anita.desai@hospital.com",
    addressLine1: "654 Women's Health Center",
    pincode: "380001",
    locality: "Satellite",
    block: "Block E",
    district: "Ahmedabad",
    state: "Gujarat",
    qualification: "MBBS, MS (Gynecology)",
    designation: "Gynecologist",
    registrationNo: "MCI45678",
    registrationCouncil: "Medical Council of India",
    hprId: "91-5678-9012-3456",
    signature: null,
  },
  "6": {
    role: "DOCTOR",
    healthFacility: "1",
    employeeId: "DOC006",
    username: "dr.singh",
    password: "password123",
    fullName: "Dr. Vikram Singh",
    gender: "male",
    mobileNumber: "9234567890",
    email: "vikram.singh@hospital.com",
    addressLine1: "987 Surgical Center",
    pincode: "500001",
    locality: "Banjara Hills",
    block: "Block F",
    district: "Hyderabad",
    state: "Telangana",
    qualification: "MBBS, MS (General Surgery)",
    designation: "General Surgeon",
    registrationNo: "MCI56789",
    registrationCouncil: "Medical Council of India",
    hprId: "91-6789-0123-4567",
    signature: null,
  },
  "7": {
    role: "DOCTOR",
    healthFacility: "1",
    employeeId: "DOC007",
    username: "dr.reddy",
    password: "password123",
    fullName: "Dr. Meera Reddy",
    gender: "female",
    mobileNumber: "9456789012",
    email: "meera.reddy@hospital.com",
    addressLine1: "741 Skin Care Clinic",
    pincode: "600001",
    locality: "T Nagar",
    block: "Block G",
    district: "Chennai",
    state: "Tamil Nadu",
    qualification: "MBBS, MD (Dermatology)",
    designation: "Dermatologist",
    registrationNo: "MCI67890",
    registrationCouncil: "Medical Council of India",
    hprId: "91-7890-1234-5678",
    signature: null,
  },
  "8": {
    role: "DOCTOR",
    healthFacility: "1",
    employeeId: "DOC008",
    username: "dr.yadav",
    password: "password123",
    fullName: "Dr. Kaushendra Yadav",
    gender: "male",
    mobileNumber: "9878787676",
    email: "kaushendra.yadav@hospital.com",
    addressLine1: "852 General Medicine Wing",
    pincode: "226001",
    locality: "Hazratganj",
    block: "Block H",
    district: "Lucknow",
    state: "Uttar Pradesh",
    qualification: "MBBS, MD (General Medicine)",
    designation: "General Physician",
    registrationNo: "MCI78901",
    registrationCouncil: "Medical Council of India",
    hprId: "91-8777-6798-0979",
    signature: null,
  },
  "9": {
    role: "FRONTDESK",
    healthFacility: "1",
    employeeId: "EMP05811",
    username: "nasir",
    password: "password123",
    fullName: "M Nasir",
    gender: "male",
    mobileNumber: "9876785087",
    email: "nasir@hospital.com",
    addressLine1: "45 Park Avenue",
    pincode: "560001",
    locality: "MG Road",
    block: "Block A",
    district: "Bangalore Urban",
    state: "Karnataka",
    qualification: "",
    designation: "",
    registrationNo: "",
    registrationCouncil: "",
    hprId: "",
    signature: null,
  },
  "10": {
    role: "NURSE",
    healthFacility: "1",
    employeeId: "NUR8907",
    username: "mina",
    password: "password123",
    fullName: "Mina Sharma",
    gender: "female",
    mobileNumber: "7408242287",
    email: "mina.sharma@hospital.com",
    addressLine1: "78 Healthcare Lane",
    pincode: "400001",
    locality: "Andheri East",
    block: "Block C",
    district: "Mumbai",
    state: "Maharashtra",
    qualification: "",
    designation: "",
    registrationNo: "",
    registrationCouncil: "",
    hprId: "",
    signature: null,
  },
  "11": {
    role: "DOCTOR",
    healthFacility: "2",
    employeeId: "DOC101",
    username: "dr.thompson",
    password: "password123",
    fullName: "Dr. Sarah Thompson",
    gender: "female",
    mobileNumber: "9876543210",
    email: "sarah.thompson@hospital.com",
    addressLine1: "101 Medical District",
    pincode: "700001",
    locality: "Park Street",
    block: "Block I",
    district: "Kolkata",
    state: "West Bengal",
    qualification: "MBBS, MD (General Medicine)",
    designation: "General Physician",
    registrationNo: "MCI89012",
    registrationCouncil: "Medical Council of India",
    hprId: "91-1234-5678-9012",
    signature: null,
  },
  "12": {
    role: "DOCTOR",
    healthFacility: "2",
    employeeId: "DOC102",
    username: "dr.chen",
    password: "password123",
    fullName: "Dr. Michael Chen",
    gender: "male",
    mobileNumber: "9765432109",
    email: "michael.chen@hospital.com",
    addressLine1: "202 ENT Specialty Center",
    pincode: "110002",
    locality: "Karol Bagh",
    block: "Block J",
    district: "New Delhi",
    state: "Delhi",
    qualification: "MBBS, MS (ENT)",
    designation: "ENT Specialist",
    registrationNo: "MCI90123",
    registrationCouncil: "Medical Council of India",
    hprId: "91-2345-6789-0123",
    signature: null,
  },
  "13": {
    role: "DOCTOR",
    healthFacility: "2",
    employeeId: "DOC103",
    username: "dr.nair",
    password: "password123",
    fullName: "Dr. Kavita Nair",
    gender: "female",
    mobileNumber: "9654321098",
    email: "kavita.nair@hospital.com",
    addressLine1: "303 Eye Care Center",
    pincode: "682001",
    locality: "Ernakulam",
    block: "Block K",
    district: "Kochi",
    state: "Kerala",
    qualification: "MBBS, MS (Ophthalmology)",
    designation: "Ophthalmologist",
    registrationNo: "MCI01234",
    registrationCouncil: "Medical Council of India",
    hprId: "91-3456-7890-1234",
    signature: null,
  },
  "14": {
    role: "NURSE",
    healthFacility: "2",
    employeeId: "NUR456",
    username: "ppatel",
    password: "password123",
    fullName: "Priya Patel",
    gender: "female",
    mobileNumber: "9123456789",
    email: "priya.patel@hospital.com",
    addressLine1: "78 Healthcare Lane",
    pincode: "400001",
    locality: "Andheri East",
    block: "Block C",
    district: "Mumbai",
    state: "Maharashtra",
    qualification: "",
    designation: "",
    registrationNo: "",
    registrationCouncil: "",
    hprId: "",
    signature: null,
  },
  "15": {
    role: "DOCTOR",
    healthFacility: "3",
    employeeId: "DOC201",
    username: "dr.malhotra",
    password: "password123",
    fullName: "Dr. Arjun Malhotra",
    gender: "male",
    mobileNumber: "9543210987",
    email: "arjun.malhotra@hospital.com",
    addressLine1: "404 Radiology Wing",
    pincode: "302001",
    locality: "C Scheme",
    block: "Block L",
    district: "Jaipur",
    state: "Rajasthan",
    qualification: "MBBS, MD (Radiology)",
    designation: "Radiologist",
    registrationNo: "MCI11223",
    registrationCouncil: "Medical Council of India",
    hprId: "91-4567-8901-2345",
    signature: null,
  },
  "16": {
    role: "DOCTOR",
    healthFacility: "3",
    employeeId: "DOC202",
    username: "dr.verma",
    password: "password123",
    fullName: "Dr. Sunita Verma",
    gender: "female",
    mobileNumber: "9432109876",
    email: "sunita.verma@hospital.com",
    addressLine1: "505 Pathology Lab",
    pincode: "201001",
    locality: "Sector 18",
    block: "Block M",
    district: "Noida",
    state: "Uttar Pradesh",
    qualification: "MBBS, MD (Pathology)",
    designation: "Pathologist",
    registrationNo: "MCI22334",
    registrationCouncil: "Medical Council of India",
    hprId: "91-5678-9012-3456",
    signature: null,
  },
  "17": {
    role: "FRONTDESK",
    healthFacility: "3",
    employeeId: "EMP789",
    username: "jlee",
    password: "password123",
    fullName: "Jennifer Lee",
    gender: "female",
    mobileNumber: "8765432109",
    email: "jennifer.lee@hospital.com",
    addressLine1: "606 Reception Area",
    pincode: "411001",
    locality: "Koregaon Park",
    block: "Block N",
    district: "Pune",
    state: "Maharashtra",
    qualification: "",
    designation: "",
    registrationNo: "",
    registrationCouncil: "",
    hprId: "",
    signature: null,
  },
};

const MOCK_DEPARTMENTS: Record<string, DepartmentDetails[]> = {
  "1": [
    {
      id: "1",
      department: "Emergency (ER)",
      roomNumber: "302",
      opdDays: ["M", "T", "W", "T2", "F"],
      consultationCharges: "600",
    },
  ],
  "2": [
    {
      id: "1",
      department: "In-Patient (IPD)",
      roomNumber: "101",
      opdDays: ["M", "W", "F"],
      consultationCharges: "500",
    },
    {
      id: "2",
      department: "Laboratory (LAB)",
      roomNumber: "205",
      opdDays: ["T", "T2"],
      consultationCharges: "300",
    },
  ],
  "3": [
    {
      id: "1",
      department: "Pharmacy (PHARM)",
      roomNumber: "203",
      opdDays: ["M", "T", "W", "T2", "F", "S"],
      consultationCharges: "400",
    },
  ],
  "4": [
    {
      id: "1",
      department: "Emergency (ER)",
      roomNumber: "401",
      opdDays: ["T", "T2", "F"],
      consultationCharges: "700",
    },
  ],
  "5": [
    {
      id: "1",
      department: "In-Patient (IPD)",
      roomNumber: "301",
      opdDays: ["M", "W", "F"],
      consultationCharges: "450",
    },
  ],
  "6": [
    {
      id: "1",
      department: "Laboratory (LAB)",
      roomNumber: "501",
      opdDays: ["M", "T", "W", "T2", "F"],
      consultationCharges: "800",
    },
  ],
  "7": [
    {
      id: "1",
      department: "Pharmacy (PHARM)",
      roomNumber: "201",
      opdDays: ["M", "W", "S"],
      consultationCharges: "350",
    },
  ],
  "8": [
    {
      id: "1",
      department: "Emergency (ER)",
      roomNumber: "102",
      opdDays: ["M", "T", "W", "T2", "F", "S"],
      consultationCharges: "300",
    },
  ],
  "11": [
    {
      id: "1",
      department: "In-Patient (IPD)",
      roomNumber: "103",
      opdDays: ["M", "T", "W", "T2", "F"],
      consultationCharges: "350",
    },
  ],
  "12": [
    {
      id: "1",
      department: "Laboratory (LAB)",
      roomNumber: "202",
      opdDays: ["T", "T2", "S"],
      consultationCharges: "400",
    },
  ],
  "13": [
    {
      id: "1",
      department: "Pharmacy (PHARM)",
      roomNumber: "204",
      opdDays: ["M", "W", "F"],
      consultationCharges: "450",
    },
  ],
  "15": [
    {
      id: "1",
      department: "Emergency (ER)",
      roomNumber: "601",
      opdDays: ["M", "T", "W", "T2", "F"],
      consultationCharges: "500",
    },
  ],
  "16": [
    {
      id: "1",
      department: "Laboratory (LAB)",
      roomNumber: "602",
      opdDays: ["M", "T", "W", "T2", "F"],
      consultationCharges: "400",
    },
  ],
};

export function EditUserPage() {
  const navigate = useNavigate();
  const { facilityId, userId } = useParams<{ facilityId: string; userId: string }>();
  const facilityName = facilityId ? FACILITIES[facilityId as keyof typeof FACILITIES] : "";
  const { getUserById, updateUser } = useUsers();

  const [formData, setFormData] = React.useState<UserFormData>(() => {
    if (userId) {
      const contextUser = getUserById(userId);
      if (contextUser) {
        return {
          role: contextUser.role,
          employeeId: contextUser.employeeId,
          username: contextUser.username,
          password: "********", // Don't expose real password
          fullName: contextUser.fullName,
          gender: contextUser.gender,
          mobileNumber: contextUser.mobileNumber,
          email: contextUser.email,
          addressLine1: contextUser.address,
          pincode: contextUser.pincode,
          locality: contextUser.locality,
          block: contextUser.block,
          district: contextUser.district,
          state: contextUser.state,
          healthFacility: contextUser.facilityId,
          qualification: contextUser.qualification || "",
          designation: contextUser.designation || "",
          registrationNo: contextUser.registrationNo || "",
          registrationCouncil: contextUser.registrationCouncil || "",
          hprId: contextUser.hprId || "",
          signature: null,
        };
      }
    }
    return {
      role: "",
      employeeId: "",
      username: "",
      password: "",
      fullName: "",
      gender: "",
      mobileNumber: "",
      email: "",
      addressLine1: "",
      pincode: "",
      locality: "",
      block: "",
      district: "",
      state: "",
      healthFacility: facilityId || "",
      qualification: "",
      designation: "",
      registrationNo: "",
      registrationCouncil: "",
      hprId: "",
      signature: null,
    };
  });

  const [departments, setDepartments] = React.useState<DepartmentDetails[]>(() => {
    if (userId) {
      const contextUser = getUserById(userId);
      if (contextUser && contextUser.departments && contextUser.departments.length > 0) {
        // Map departments from context to department details format
        return contextUser.departments.map((dept, index) => ({
          id: String(index + 1),
          department: dept,
          roomNumber: "", // TODO: Store room number in context
          opdDays: [], // TODO: Store OPD days in context
          consultationCharges: String(contextUser.consultationCharges || 0),
        }));
      }
      // If user has no departments, check mock data as fallback
      if (MOCK_DEPARTMENTS[userId]) {
        return MOCK_DEPARTMENTS[userId];
      }
    }
    return [
      {
        id: "1",
        department: "",
        roomNumber: "",
        opdDays: [],
        consultationCharges: "",
      }
    ];
  });

  // Validation errors for department fields
  const [departmentErrors, setDepartmentErrors] = React.useState<{
    [key: string]: { consultationCharges?: string };
  }>({});

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
    // Validate room number - only allow numbers
    if (field === "roomNumber" && typeof value === "string") {
      // Remove any non-digit characters
      value = value.replace(/\D/g, "");
    }

    // Validate consultation charges
    if (field === "consultationCharges" && typeof value === "string") {
      const numValue = parseFloat(value);
      
      // Clear previous error
      setDepartmentErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });

      // Check if value is outside range
      if (value && (isNaN(numValue) || numValue < 0 || numValue > 3000)) {
        setDepartmentErrors((prev) => ({
          ...prev,
          [id]: {
            consultationCharges: "Consultation charges must be between ₹0 - ₹3,000",
          },
        }));
      }
    }

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
    
    // Update user in context
    if (userId) {
      // Calculate consultation charges from departments
      const totalConsultationCharges = formData.role === "DOCTOR" && departments.length > 0
        ? Math.max(...departments.map(d => parseInt(d.consultationCharges) || 0))
        : 0;
      
      // Get list of department names
      const departmentNames = formData.role === "DOCTOR" 
        ? departments.map(d => d.department).filter(Boolean)
        : undefined;
      
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
      const lastModifiedAt = `${formattedDate}, ${formattedTime}`;
      
      updateUser(userId, {
        name: formData.fullName,
        emailId: formData.email,
        address: formData.addressLine1,
        consultationCharges: totalConsultationCharges,
        departments: departmentNames,
        lastModifiedBy: "Current User", // In real app, use logged-in user
        lastModifiedAt: lastModifiedAt,
      });
    }
    
    toast.success("User updated successfully");
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
              Edit User
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
            Save Changes
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
                5. Department and OPD Details
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
                      <div className="flex items-baseline justify-between">
                        <Label htmlFor={`consultationCharges-${dept.id}`} style={{ fontSize: "var(--text-sm)" }}>
                          Consultation Charges *
                        </Label>
                      </div>
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
                      <span className="text-muted-foreground" style={{ fontSize: "var(--text-xs)" }}>
                        Range: ₹0-₹3,000
                      </span>
                      {departmentErrors[dept.id]?.consultationCharges && (
                        <p className="text-red-500" style={{ fontSize: "var(--text-xs)" }}>
                          {departmentErrors[dept.id]?.consultationCharges}
                        </p>
                      )}
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