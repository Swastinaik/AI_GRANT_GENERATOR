'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { GrantEditor } from '../generate-grant/components/GrantEditor';
import {
  Select,
  SelectContent,

  SelectItem,

  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ErrorFallBack from '@/app/components/ErrorBoundary';
import AuthStore from '@/app/store/AuthStore';
import useAuthStore from '@/app/store/AuthStore';
import LoaderComponent from '@/app/components/Loader';
import { fetchWithAuth } from '@/app/lib/api';
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
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const fundersDetail = useAuthStore((state)=> state.fundersDetail)
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [confirmedTemplate, setConfirmedTemplate] = useState<string>('modern');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [response, setResponse] = useState(null)
  const [formData, setFormData] = useState({
    language: 'English',
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

  useEffect(()=>{
    if(fundersDetail){
      setFormData((prev)=> ({...prev, funders_detail: fundersDetail}))
    }
  }, [fundersDetail])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0])
      setUploadedFile(URL.createObjectURL(files[0]));
    }
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
    if(!accessToken){
      return
    }
    e.preventDefault();
    setLoading(true)
    try {
      selectTemplate(confirmedTemplate)
      const formDataToSend = new FormData()
      if (!selectedFile) {
        setError("Please upload a file")
        return
      }
      formDataToSend.append('file', selectedFile)
      formDataToSend.append('user_input', JSON.stringify(formData))
      const api = process.env.NEXT_PUBLIC_API_URL || 'api'
      const response = await fetchWithAuth(`${api}/generate-grant`, {
        method: "POST",
        body: formDataToSend
      }, accessToken, setAccessToken)
      if (!response.ok) {
        throw Error("Failed to send request to API.")
      }
      const data = await response.json()
      setResponse(data)
      setError("")

    } catch (e) {
      setError("There is error while generating the conent")
      console.log(e)
      throw new Error(error)
    } finally {
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
      {loading ? <LoaderComponent /> : error.length > 0 ? <ErrorFallBack error={error} /> : response ? <GrantEditor grant={response} /> : (
        <div className="min-h-screen py-8 bg-background">
          <div className="w-full max-w-6xl mx-auto px-6 sm:px-12">
            <div className="w-full">
              <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-10 tracking-wide text-foreground">{currentStep === 0 ? 'Choose a Template' : 'Grant Application Form'}</h1>
              <form className="w-full">
                {/* Step 0: Template Selection */}
                {currentStep === 0 && (
                  <>
                    <div className="flex justify-center mb-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6 mb-10 max-w-fit">
                        {templates.map((template) => (
                          <div
                            key={template.name}
                            className={`relative cursor-pointer rounded-2xl overflow-hidden shadow-lg w-70 h-90 transition-all duration-200 border-2
                        ${selectedTemplate === template.name ? 'border-primary scale-105 shadow-xl' : 'border-transparent hover:border-border hover:scale-105'}
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
                            <div className="absolute inset-x-0 bottom-0 bg-background bg-opacity-60 py-3 text-center text-lg font-medium tracking-wide text-foreground">
                              {template.name.charAt(0).toUpperCase() + template.name.slice(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='flex items-center justify-around'>
                      <Button variant={'outline'}>
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={confirmTemplate}
                        disabled={!selectedTemplate}
                        className=""
                      >
                        Confirm &amp; Next
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 1-3: Form Fields */}
                {currentStep > 0 && (
                  <div className="flex flex-col gap-8">
                    {currentStep === 1 && (
                      <>
                        <div>
                          <Label className="mb-2">File Uploader</Label>
                          <Input
                            type="file"
                            className="w-full flex items-center h-auto p-3 bg-card border border-border rounded-xl text-foreground file:cursor-pointer file:rounded-xl file:border-0 file:bg-gray-800 file:text-white file:py-2 file:px-4 file:text-sm file:transition-all hover:file:bg-gray-700"
                            onChange={handleFileChange}
                          />
                          {uploadedFile && <img src={uploadedFile} alt="Preview" className="mt-3 w-36 h-36 object-cover rounded-xl" />}
                        </div>
                        <div className="mb-2">
                          <Label className='mb-2'>
                            Select Language
                          </Label>
                          <Select

                            value={formData.language}
                            name='language'
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, language: value }))}
                          >
                            <SelectTrigger className='w-full'>

                              <SelectValue
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Hindi">Hindi</SelectItem>
                              <SelectItem value="Chinese">Chinese</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className='mb-2'>Project Title</Label>
                          <Input
                            type="text"
                            name="project_title"
                            value={formData.project_title}
                            onChange={handleInputChange}

                            placeholder="Enter project title"
                          />
                        </div>
                        <div>
                          <Label className='mb-2'>Project Description / Methodology</Label>
                          <Textarea
                            name="project_description"
                            value={formData.project_description}
                            className='textarea'
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Describe the project methodology"
                          />
                        </div>
                      </>
                    )}
                    {currentStep === 2 && (
                      <>
                        <div>
                          <Label className='mb-2'>Statement of Need</Label>
                          <Textarea
                            name="statement_of_need"
                            value={formData.statement_of_need}
                            className='textarea'
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Describe the need for this project"
                          />
                        </div>
                        <div>
                          <Label className='mb-2'>Funders Detail</Label>
                          <Textarea
                            name="funders_detail"
                            value={formData.funders_detail}
                            className='textarea'
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Describe funders' details"
                          />
                        </div>
                        <div>
                          <Label className='mb-2'>Goals and Objectives</Label>
                          <Textarea
                            name="goals_and_objectives"
                            value={formData.goals_and_objectives}
                            className='textarea'
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="List goals and objectives"
                          />
                        </div>
                      </>
                    )}
                    {currentStep === 3 && (
                      <>
                        <div>
                          <Label className='mb-2'>Budget</Label>
                          <Textarea
                            name="budget"
                            value={formData.budget}
                            className='textarea'
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Provide budget details"
                          />
                        </div>
                        <div>
                          <Label className='mb-2'>Target Audience</Label>
                          <Textarea
                            name="target_audience"
                            value={formData.target_audience}
                            className='textarea'
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Who is your target audience?"
                          />
                        </div>
                        <div>
                          <Label className='mb-2'>Evaluation Method</Label>
                          <Textarea
                            name="evaluation_method"
                            value={formData.evaluation_method}
                            className='textarea'
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Explain how the project will be evaluated"
                          />
                        </div>
                        <div>
                          <Label className='mb-2'>Sustainability Plan</Label>
                          <Textarea
                            name="sustainibility_plan"
                            value={formData.sustainibility_plan}
                            className='textarea'
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Describe the plan for sustainability"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Navigation - Always sticky/fixed to bottom if needed */}
                {currentStep > 0 && (
                  <div className="fixed inset-x-0 bottom-0 bg-secondary bg-opacity-70 py-4 px-6 flex gap-6 z-50 transition-all sm:px-24 md:px-36 lg:px-64 xl:px-80">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant={'outline'}
                      disabled={currentStep === 1}
                      className="large-button"
                    >
                      Back
                    </Button>
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid(currentStep)}
                        className="large-button"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="button"

                        onClick={handleGenerate}
                        disabled={!isStepValid(currentStep)}
                        className="large-button "
                      >
                        Generate
                      </Button>
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
