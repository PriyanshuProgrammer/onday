"use client"
import Image from "next/image";
import { useState } from "react";
import Page1 from "./components/Page1";

export default function Home() {
  const [count, setcount] = useState(0)
  return (
    <>
      <Page1></Page1>
    </>
  )
}
  