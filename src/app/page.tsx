"use client"

import Image from "next/image";
import Navbar from "../components/navbar";
import Header from "../components/header"
import DataGrid from "@/components/datagrid";
import Footer from "@/components/footer";
import { useState } from "react";
import AddBandPage from "./addband/page";
import { useEntity } from "@/context/entitycontext";

type Entity = {
  id: number;
  name: string;
  genre: string;
  status: boolean;
  theme: string;
  country: string;
  label: string;
  link: string;
};

export default function Home() {

  const { entities } = useEntity();

  return (
    <div className="">
      <Header />
      <section id="table-view-section">
        <DataGrid entities={entities} />
      </section>
      <Footer />
    </div>
  );
}
