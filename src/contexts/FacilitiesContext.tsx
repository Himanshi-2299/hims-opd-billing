import React, { createContext, useContext, useState, ReactNode } from "react";

export type FacilityData = {
  id: string;
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
  // Fields for the table view
  code: string;
  name: string;
  type: "hospital" | "clinic" | "laboratory" | "pharmacy";
  address: string;
  city: string;
  phone: string;
  capacity: number;
  status: "active" | "inactive";
};

type FacilitiesContextType = {
  facilities: FacilityData[];
  updateFacility: (id: string, data: Partial<FacilityData>) => void;
  addFacility: (data: FacilityData) => void;
  deleteFacility: (id: string) => void;
  getFacilityById: (id: string) => FacilityData | undefined;
};

const FacilitiesContext = createContext<FacilitiesContextType | undefined>(undefined);

// Initial mock data
const initialFacilities: FacilityData[] = [
  {
    id: "1",
    facilityId: "FAC001",
    facilityName: "Main Hospital",
    facilityEmail: "main@hospital.com",
    departments: ["general_medicine", "surgery"],
    roles: ["frogs", "nurse", "doc12"],
    phoneCountryCode: "+91",
    phoneNumber: "9876543210",
    addressLine1: "123 Medical Center Dr",
    pincode: "10001",
    locality: "New York",
    block: "Manhattan",
    district: "New York County",
    state: "New York",
    registrationCharges: "100",
    emergencyCharges: "100",
    facilityType: "private",
    followUpDays: "7",
    followUpVisits: "1",
    // Table view fields
    code: "HQ01",
    name: "Main Hospital",
    type: "hospital",
    address: "123 Medical Center Dr",
    city: "New York",
    phone: "+91 9876543210",
    capacity: 500,
    status: "active",
  },
  {
    id: "2",
    facilityId: "FAC002",
    facilityName: "East Wing Clinic",
    facilityEmail: "eastwing@hospital.com",
    departments: ["general_medicine", "pediatrics"],
    roles: ["frogs", "nurse"],
    phoneCountryCode: "+91",
    phoneNumber: "9876543211",
    addressLine1: "456 Healthcare Ave",
    pincode: "11201",
    locality: "Brooklyn",
    block: "Brooklyn",
    district: "Kings County",
    state: "New York",
    registrationCharges: "100",
    emergencyCharges: "100",
    facilityType: "private",
    followUpDays: "7",
    followUpVisits: "1",
    // Table view fields
    code: "CL01",
    name: "East Wing Clinic",
    type: "clinic",
    address: "456 Healthcare Ave",
    city: "Brooklyn",
    phone: "+91 9876543211",
    capacity: 50,
    status: "active",
  },
  {
    id: "3",
    facilityId: "FAC003",
    facilityName: "North Diagnostic Center",
    facilityEmail: "north@diagnostics.com",
    departments: ["cardiology", "orthopedics"],
    roles: ["doc12", "admin"],
    phoneCountryCode: "+91",
    phoneNumber: "9876543212",
    addressLine1: "789 Wellness Blvd",
    pincode: "11375",
    locality: "Queens",
    block: "Queens",
    district: "Queens County",
    state: "New York",
    registrationCharges: "1",
    emergencyCharges: "0",
    facilityType: "government",
    followUpDays: "15",
    followUpVisits: "1",
    // Table view fields
    code: "LAB01",
    name: "North Diagnostic Center",
    type: "laboratory",
    address: "789 Wellness Blvd",
    city: "Queens",
    phone: "+91 9876543212",
    capacity: 20,
    status: "active",
  },
  {
    id: "4",
    facilityId: "FAC004",
    facilityName: "South Emergency Unit",
    facilityEmail: "emergency@hospital.com",
    departments: ["general_medicine", "surgery", "cardiology"],
    roles: ["frogs", "nurse", "doc12", "admin"],
    phoneCountryCode: "+91",
    phoneNumber: "9876543213",
    addressLine1: "321 Emergency Ln",
    pincode: "10002",
    locality: "Manhattan",
    block: "Manhattan",
    district: "New York County",
    state: "New York",
    registrationCharges: "100",
    emergencyCharges: "100",
    facilityType: "private",
    followUpDays: "7",
    followUpVisits: "1",
    // Table view fields
    code: "PH01",
    name: "South Emergency Unit",
    type: "pharmacy",
    address: "321 Emergency Ln",
    city: "Manhattan",
    phone: "+91 9876543213",
    capacity: 10,
    status: "active",
  },
];

export function FacilitiesProvider({ children }: { children: ReactNode }) {
  const [facilities, setFacilities] = useState<FacilityData[]>(initialFacilities);

  const updateFacility = (id: string, data: Partial<FacilityData>) => {
    setFacilities((prev) =>
      prev.map((facility) => {
        if (facility.id === id) {
          const updated = { ...facility, ...data };
          // Sync name and phone for table view
          updated.name = data.facilityName || facility.facilityName;
          updated.phone = `${data.phoneCountryCode || facility.phoneCountryCode} ${data.phoneNumber || facility.phoneNumber}`;
          updated.address = data.addressLine1 || facility.addressLine1;
          updated.city = data.locality || facility.locality;
          return updated;
        }
        return facility;
      })
    );
  };

  const addFacility = (data: FacilityData) => {
    setFacilities((prev) => [...prev, data]);
  };

  const deleteFacility = (id: string) => {
    setFacilities((prev) => prev.filter((facility) => facility.id !== id));
  };

  const getFacilityById = (id: string) => {
    return facilities.find((facility) => facility.id === id);
  };

  return (
    <FacilitiesContext.Provider
      value={{
        facilities,
        updateFacility,
        addFacility,
        deleteFacility,
        getFacilityById,
      }}
    >
      {children}
    </FacilitiesContext.Provider>
  );
}

export function useFacilities() {
  const context = useContext(FacilitiesContext);
  if (context === undefined) {
    throw new Error("useFacilities must be used within a FacilitiesProvider");
  }
  return context;
}
