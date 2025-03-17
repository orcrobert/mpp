"use client"

import Image from "next/image";
import Navbar from "../components/navbar";
import Header from "../components/header"
import DataGrid from "@/components/bands-grid";
import Footer from "@/components/footer";
import { useState } from "react";
import AddBandPage from "./add-band/page";
import { useEntity } from "@/context/entity-context";

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
