"use client";
import React,{ useState } from "react"
import FileUploader from "../components/FileUploader";
import MultiLoader from "../components/Loader";
import axios from "axios";
import { AI_Response } from "../lib/utils/types";
import EditorNew from "../components/Editor";
import ErrorFallBack from "../components/ErrorBoundary";
const Form = () => {
 const [formData, setFormdata] = useState({cover_letter: "",
    project_summary: "", executive_summary: "", statement_need: "",
    project_description: "", evaluation_plan: "", budgets: "", sustainibility_plan: ""
 })
 const [file, setFile] = useState<File | null>(null)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState("")
 const [success, setSuccess] = useState(false)
 

 const [ai_response, setAiResponse] = useState<AI_Response[]>([])

 const onSubmit = async () => {
    if (!file) {
      setError("Please upload a file")
      return
    }
    try {
      setLoading(true)
      const formDataToSend = new FormData();
      formDataToSend.append("file", file)
      formDataToSend.append("user_input", JSON.stringify(formData))
      const data = await axios.post("http://localhost:8000/chat",formDataToSend,{
        withCredentials: true,
      })
      console.log("Response from server:", data.data)
      setAiResponse(data.data)
      setSuccess(true)
      setError("")

    } catch (error) {
      console.error("Error generating grant:", error)
      setError("Error generating grant, please try again later")
      setSuccess(false)
      throw new Error("Error generating grant", error as Error)
    }
    finally{
      setLoading(false)
    }
    
 }

 return (
  <div className="flex flex-col h-full w-full">
    {loading ? <MultiLoader />: error.length > 0 ? <ErrorFallBack error={error}/> : ai_response.length > 0 ? <EditorNew response={ai_response} setResponse={setAiResponse}/> :(
   <div className="flex flex-col items-center gap-4 p-6 bg-black">
    <h1 className="text-2xl text-white">Generate Grant</h1>
     <div  className="flex flex-col gap-7 w-full">
       <FileUploader onFileSelect={(file) => setFile(file)}/>
        <div className="flex flex-col">
        <label className="text-white">Cover Letter :</label>
       <textarea className="w-full h-36 p-4 bg-black-100 text-white border border-gray-500  rounded-md" placeholder="cover letter" onChange={(e) => setFormdata({...formData, cover_letter: e.target.value})} />
        </div>
        <div className="flex flex-col">
        <label className="text-white ">Project Summary :</label>
       <textarea className="w-full h-36 p-4 bg-black-100 text-white border border-gray-500 rounded-md" placeholder="project summary" onChange={(e) => setFormdata({...formData, project_summary: e.target.value})} />
       </div>
       <div className="flex flex-col">
       <label className="text-white ">Executive Summary :</label>
       <textarea className="w-full h-36 p-4 bg-black-100 text-white border border-gray-500  rounded-md" placeholder="executive summary" onChange={(e) => setFormdata({...formData, executive_summary: e.target.value})} />
       </div>
       <div className="flex flex-col">
        <label className="text-white ">Statemeent of Need :</label>
       <textarea className="w-full h-36 p-4 bg-black-100 text-white border border-gray-500 rounded-md" placeholder="statement need" onChange={(e) => setFormdata({...formData, statement_need: e.target.value})} />
       </div>
       <div className="flex flex-col">
        <label className="text-white ">Project description :</label>
       <textarea className="w-full h-36 p-4 bg-black-100 text-white border border-gray-500 rounded-md" placeholder="project description" onChange={(e) => setFormdata({...formData, project_description: e.target.value})} />
       </div>
       <div className="flex flex-col">
        <label className="text-white">Evalutaion plan :</label>
       <textarea className="w-full h-36 p-4 bg-black-100 text-white border border-gray-500 rounded-md" placeholder="evaluation plan" onChange={(e) => setFormdata({...formData, evaluation_plan: e.target.value})} />
       </div>
       <div className="flex flex-col">
        <label className="text-white ">Budget :</label>
       <textarea className="w-full h-36 p-4 bg-black-100 text-white border border-gray-500 rounded-md" placeholder="budgets" onChange={(e) => setFormdata({...formData, budgets: e.target.value})} />
       </div>
       <div className="flex flex-col">
        <label className="text-white">Sustainitbility plan :</label>
       <textarea className="w-full h-36 p-4 bg-black-100 text-white border border-gray-500 rounded-md" placeholder="sustainibility plan" onChange={(e) => setFormdata({...formData, sustainibility_plan: e.target.value})} />
       </div>
       <div className="flex flex-col items-center justify-center mb-5">
       <button onClick={onSubmit} className="flex items-center justify-center w-2xs h-9 bg-blue-600 text-white hover:bg-blue-500 cursor-pointer rounded-md ">Generate</button>
       </div>
     </div>
   </div>
    )}
  </div>
 )
}


export default Form