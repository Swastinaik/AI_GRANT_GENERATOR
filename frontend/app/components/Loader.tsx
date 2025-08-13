"use client";
import React, { useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader"

const loadingStates = [
    {
      text: "Analyzing the input",
    },
    {
      text: "Ai is thinking",
    },
    {
      text: "Generating response",
    },
    {
      text: "Loading the data",
    },
    {
      text: "Processing the request",
    },
    {
      text: "Please wait",
    },
    {
      text: "Almost there",
    },
    {
      text: "Finalizing the output",
    },
  ];

export default function LoaderComponent() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="dark w-full h-[60vh] flex items-center justify-center">
      <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
    </div>
  );
}

