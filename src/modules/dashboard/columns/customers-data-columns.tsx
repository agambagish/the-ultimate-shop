"use client";

import type { ColumnDef } from "@tanstack/react-table";

interface Customer {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export const customersDataColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "pinCode",
    header: "Pin Code",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
];
