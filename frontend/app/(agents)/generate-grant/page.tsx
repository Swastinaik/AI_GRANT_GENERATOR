'use client'
import { useState } from "react"
import MultiStepTemplateForm from "./components/Multipageform"
import NewEditor from "./components/NewEditor"

export default function ClientWrapper(){
    const [response, setResponse] = useState<any>([])
    return (
    <main>
      {response.length > 0 ? (
        <NewEditor grants={response} />
      ) : (
        <MultiStepTemplateForm  />
      )}
    </main>
  );
}
