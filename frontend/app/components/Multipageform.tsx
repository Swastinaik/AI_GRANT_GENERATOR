'use client';

import { useState} from 'react';
import Image from 'next/image';
import MultiLoader from './Loader';
import ErrorFallBack from './ErrorBoundary';
import AuthStore from '../store/AuthStore';
import axios from 'axios';
import NewEditor from './NewEditor';
import LoaderComponent from './Loader';
const templates = [
  { name: 'luxury', image: '/images/luxury.png' },
  { name: 'elegant', image: '/images/elegant.png' },
  { name: 'modern', image: '/images/modern.png' },
  { name: 'corporate', image: '/images/corporate.png' },
  { name: 'aesthetics', image: '/images/aesthetics.png' },
  { name: 'creative', image: '/images/creative.png' },
];

export default function MultiStepTemplateForm() {
  const { selectTemplate } = AuthStore.getState()
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string| null>(null);
  const [confirmedTemplate, setConfirmedTemplate] = useState<string>('modern');
  const [uploadedFile, setUploadedFile] = useState<string|null>(null);
  const [selectedFile, setSelectedFile] = useState<File|null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [response, setResponse] = useState(null)
  const [formData, setFormData] = useState({
    project_title: '',
    project_description: '',
    statement_of_need: '',
    funders_detail: '',
    goals_and_objectives: '',
    budget: '',
    target_audience: '',
    evaluation_method: '',
    sustainibility_plan: '',
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if(files && files[0]) {
      setSelectedFile(files[0])
      setUploadedFile(URL.createObjectURL(files[0]));}
  };

  const confirmTemplate = () => {
    if (selectedTemplate) {
      setConfirmedTemplate(selectedTemplate);
      setCurrentStep(1);
    }
  };

  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentStep((prev) => prev + 1);
  };
  const prevStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentStep((prev) => prev - 1);
  };

  const handleGenerate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true)
    try {
      selectTemplate(confirmedTemplate)
      const formDataToSend = new FormData()
      if(!selectedFile){
        setError("Please upload a file")
        return
      }
      formDataToSend.append('file',selectedFile)
      formDataToSend.append('user_input',JSON.stringify(formData))
      const api = process.env.NEXT_PUBLIC_API_KEY  || 'api'
      const data = await axios.post(`${api}/generate-grant`,formDataToSend,{
        withCredentials: true,
      })
      setResponse(data.data)
      console.log("Response from server:", data.data)
      setError("")

    } catch (e) {
      setError("There is error while generating the conent")
      console.log(e)
      throw new Error(error)
    } finally{
      setLoading(false)
    }
  };

  const isStepValid = (step: number) => {
    if (step === 1) return uploadedFile && formData.project_title && formData.project_description;
    if (step === 2) return formData.statement_of_need && formData.funders_detail && formData.goals_and_objectives;
    if (step === 3) return formData.budget && formData.target_audience && formData.evaluation_method && formData.sustainibility_plan;
    return true;
  };

  return (
    <>
    { loading ? <LoaderComponent/> :error.length > 0 ?  <ErrorFallBack error={error}/>: response ? <NewEditor grants={response}/>:(
    <div className="dark bg-gradient-to-b from-black via-neutral-900 to-black min-h-screen py-8">
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-12">
        <div className="w-full">
          <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-10 tracking-wide text-white">{currentStep === 0 ? 'Choose a Template' : 'Grant Application Form'}</h1>
          <form className="w-full">
            {/* Step 0: Template Selection */}
            {currentStep === 0 && (
              <>
                <div className="flex justify-center mb-10">
                <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-10 max-w-fit">
                  {templates.map((template) => (
                    <div
                      key={template.name}
                      className={`relative cursor-pointer rounded-2xl overflow-hidden shadow-lg w-70 h-90 transition-all duration-200 border-2
                        ${selectedTemplate === template.name ? 'border-blue-500 scale-105 bg-gradient-to-br from-blue-900/80 to-blue-600/30' : 'border-gray-700 hover:border-blue-500'}
                      `}
                      onClick={() => setSelectedTemplate(template.name)}
                    >
                      <Image
                        src={template.image}
                        alt={template.name}
                        width={275}
                        height={350}
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 py-3 text-center text-lg font-medium tracking-wide text-white">
                        {template.name.charAt(0).toUpperCase() + template.name.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
                </div>
                <button
                  type="button"
                  onClick={confirmTemplate}
                  disabled={!selectedTemplate}
                  className="block w-full py-4 text-lg rounded-xl font-bold tracking-wide bg-gradient-to-r from-fuchsia-500 via-blue-500 to-pink-400 text-white shadow-lg ring-2 ring-white/10 hover:from-pink-600 hover:to-blue-600 disabled:opacity-50 transition-all"
                >
                  Confirm &amp; Next
                </button>
              </>
            )}

            {/* Step 1-3: Form Fields */}
            {currentStep > 0 && (
              <div className="flex flex-col gap-8">
                {currentStep === 1 && (
                  <>
                    <div>
                      <label className="block mb-2 text-white font-semibold">File Uploader</label>
                      <input
                        type="file"
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                        onChange={handleFileChange}
                      />
                      {uploadedFile && <img src={uploadedFile} alt="Preview" className="mt-3 w-36 h-36 object-cover rounded-xl" />}
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Project Title</label>
                      <input
                        type="text"
                        name="project_title"
                        value={formData.project_title}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                        placeholder="Enter project title"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Project Description / Methodology</label>
                      <textarea
                        name="project_description"
                        value={formData.project_description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white resize-none"
                        placeholder="Describe the project methodology"
                      />
                    </div>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Statement of Need</label>
                      <textarea
                        name="statement_of_need"
                        value={formData.statement_of_need}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white resize-none"
                        placeholder="Describe the need for this project"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Funders Detail</label>
                      <textarea
                        name="funders_detail"
                        value={formData.funders_detail}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white resize-none"
                        placeholder="Describe funders' details"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Goals and Objectives</label>
                      <textarea
                        name="goals_and_objectives"
                        value={formData.goals_and_objectives}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white resize-none"
                        placeholder="List goals and objectives"
                      />
                    </div>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Budget</label>
                      <textarea
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white resize-none"
                        placeholder="Provide budget details"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Target Audience</label>
                      <textarea
                        name="target_audience"
                        value={formData.target_audience}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white resize-none"
                        placeholder="Who is your target audience?"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Evaluation Method</label>
                      <textarea
                        name="evaluation_method"
                        value={formData.evaluation_method}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white resize-none"
                        placeholder="Explain how the project will be evaluated"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Sustainability Plan</label>
                      <textarea
                        name="sustainibility_plan"
                        value={formData.sustainibility_plan}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white resize-none"
                        placeholder="Describe the plan for sustainability"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Navigation - Always sticky/fixed to bottom if needed */}
            {currentStep > 0 && (
              <div className="fixed inset-x-0 bottom-0 bg-black bg-opacity-70 py-4 px-6 flex gap-6 z-50 transition-all sm:px-24 md:px-36 lg:px-64 xl:px-80">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex-1 py-4 mr-2 text-lg rounded-xl font-semibold transition-all bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 disabled:opacity-50"
                >
                  Back
                </button>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="flex-1 py-4 ml-2 text-lg rounded-xl font-bold transition-all bg-gradient-to-r from-fuchsia-500 via-blue-500 to-pink-400 text-white shadow-lg ring-2 ring-white/10 hover:from-pink-600 hover:to-blue-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!isStepValid(currentStep)}
                    className="flex-1 py-4 ml-2 text-lg rounded-xl font-bold transition-all bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg hover:from-green-600 hover:to-green-800 disabled:opacity-50 cursor-pointer"
                  >
                    Generate
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
      {/* Padding at bottom so content not hidden under sticky/fixed buttons */}
      <div className="h-28" />
    </div>
    )}
    </>
  );
}
