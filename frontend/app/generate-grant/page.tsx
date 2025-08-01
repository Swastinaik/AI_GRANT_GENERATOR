'use client'
import { useState } from "react"
import MultiStepTemplateForm from "@/app/components/Multipageform"
import NewEditor from "@/app/components/NewEditor"

export default function ClientWrapper(){
    const [response, setResponse] = useState<any>([])
    return (
    <main className="dark">
      {response.length > 0 ? (
        <NewEditor grants={response} />
      ) : (
        <MultiStepTemplateForm  />
      )}
    </main>
  );
}
