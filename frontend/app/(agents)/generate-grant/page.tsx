'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GrantEditor } from '../generate-grant/components/GrantEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorFallBack from '@/app/components/ErrorBoundary';
import useAuthStore from '@/app/store/AuthStore';
import LoaderComponent from '@/app/components/Loader';
import { fetchWithAuth } from '@/app/lib/api';
import { UploadCloud, ArrowLeft, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

const STEP_TITLES = ['Project Overview', 'Objectives & Funders', 'Budget & Impact'];

export default function MultiStepTemplateForm() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const fundersDetail = useAuthStore((state) => state.fundersDetail);

  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);

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

  useEffect(() => {
    if (fundersDetail) {
      setFormData((prev) => ({ ...prev, funders_detail: fundersDetail }));
    }
  }, [fundersDetail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      setUploadedFile(URL.createObjectURL(files[0]));
    }
  };

  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => prev - 1);
  };

  const handleGenerate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!accessToken) return;

    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      if (!selectedFile) {
        setError("Please upload a file");
        setLoading(false);
        return;
      }
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('user_input', JSON.stringify(formData));

      const api = process.env.NEXT_PUBLIC_API_URL || 'api';
      const response = await fetchWithAuth(`${api}/generate-grant`, {
        method: "POST",
        body: formDataToSend
      }, accessToken, setAccessToken);

      if (!response.ok) {
        throw Error("Failed to send request to API.");
      }

      const data = await response.json();
      setResponse(data);
      setError("");
    } catch (e) {
      setError("There is an error while generating the content.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number) => {
    if (step === 0) return uploadedFile && formData.project_title && formData.project_description;
    if (step === 1) return formData.statement_of_need && formData.funders_detail && formData.goals_and_objectives;
    if (step === 2) return formData.budget && formData.target_audience && formData.evaluation_method && formData.sustainibility_plan;
    return true;
  };

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : error.length > 0 ? (
        <ErrorFallBack error={error} />
      ) : response ? (
        <GrantEditor grant={response} />
      ) : (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">

          {/* Top Navigation / Escape Hatch */}
          <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
              <div className="text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {STEP_TITLES.length}
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full flex h-1 bg-muted">
              {STEP_TITLES.map((_, index) => (
                <div
                  key={index}
                  className={`h-full flex-1 transition-all duration-500 ease-in-out ${index <= currentStep ? 'bg-primary' : 'bg-transparent'
                    } ${index !== 0 ? 'border-l border-background/20' : ''}`}
                />
              ))}
            </div>
          </nav>

          {/* Main Form Container */}
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

            {/* Dynamic Step Header */}
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                {STEP_TITLES[currentStep]}
              </h1>
              <p className="text-muted-foreground text-lg">
                {currentStep === 0 && "Let's start with the basic details of your grant proposal."}
                {currentStep === 1 && "Define the core problem and outline your objectives."}
                {currentStep === 2 && "Finalize the financial and evaluation details."}
              </p>
            </div>

            <form className="space-y-10">

              {/* Step 0: Project Details */}
              {currentStep === 0 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Organization Document <span className="text-destructive">*</span></Label>
                    <label className={`relative flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 
                      ${selectedFile ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'}`}>
                      <div className="flex flex-col items-center justify-center space-y-3">
                        {selectedFile ? (
                          <FileText className="w-10 h-10 text-primary" />
                        ) : (
                          <UploadCloud className="w-10 h-10 text-muted-foreground" />
                        )}
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">
                            {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                          </p>
                          {!selectedFile && <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, or TXT (Max 10MB)</p>}
                        </div>
                      </div>
                      <Input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt"
                      />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Select Language</Label>
                    <Select
                      value={formData.language}
                      name="language"
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger className="w-full h-14 rounded-xl text-base px-4 bg-background border-muted-foreground/30 focus:border-primary focus:ring-primary/20">
                        <SelectValue placeholder="Choose a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Project Title <span className="text-destructive">*</span></Label>
                    <Input
                      type="text"
                      name="project_title"
                      value={formData.project_title}
                      onChange={handleInputChange}
                      placeholder="e.g., The Clean Water Initiative"
                      className="h-14 rounded-xl text-base px-4 bg-background border-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Project Description & Methodology <span className="text-destructive">*</span></Label>
                    <Textarea
                      name="project_description"
                      value={formData.project_description}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Provide a high-level overview of what the project entails..."
                      className="resize-none rounded-xl text-base p-4 bg-background border-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              {/* Step 1: Objectives & Funders */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Statement of Need <span className="text-destructive">*</span></Label>
                    <Textarea
                      name="statement_of_need"
                      value={formData.statement_of_need}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Describe the specific problem or gap your project addresses..."
                      className="resize-none rounded-xl text-base p-4 border-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Funders Details <span className="text-destructive">*</span></Label>
                    <Textarea
                      name="funders_detail"
                      value={formData.funders_detail}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Details of the granting organization or target funder..."
                      className="resize-none rounded-xl text-base p-4 border-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Goals and Objectives <span className="text-destructive">*</span></Label>
                    <Textarea
                      name="goals_and_objectives"
                      value={formData.goals_and_objectives}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="What are the specific, measurable outcomes you aim to achieve?"
                      className="resize-none rounded-xl text-base p-4 border-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Budget & Impact */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Budget Breakdown <span className="text-destructive">*</span></Label>
                    <Textarea
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Outline the expected costs and funding requirements..."
                      className="resize-none rounded-xl text-base p-4 border-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Target Audience <span className="text-destructive">*</span></Label>
                    <Textarea
                      name="target_audience"
                      value={formData.target_audience}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Who are the primary beneficiaries of this grant?"
                      className="resize-none rounded-xl text-base p-4 border-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Evaluation Method <span className="text-destructive">*</span></Label>
                    <Textarea
                      name="evaluation_method"
                      value={formData.evaluation_method}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="How will you track progress and measure success?"
                      className="resize-none rounded-xl text-base p-4 border-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Sustainability Plan <span className="text-destructive">*</span></Label>
                    <Textarea
                      name="sustainibility_plan"
                      value={formData.sustainibility_plan}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="How will the initiative continue once the grant funding ends?"
                      className="resize-none rounded-xl text-base p-4 border-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons - Flawless Mobile & Desktop Response */}
              <div className="pt-8 mt-8 border-t border-border flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`w-full sm:w-auto text-base h-12 rounded-xl ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                  Back
                </Button>

                {currentStep < 2 ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="w-full sm:w-auto h-12 px-8 text-base rounded-xl transition-all"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={!isStepValid(currentStep) || loading}
                    className="w-full sm:w-auto h-12 px-8 text-base rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all"
                  >
                    {loading ? (
                      "Generating..."
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Grant
                      </>
                    )}
                  </Button>
                )}
              </div>

            </form>
          </main>
        </div>
      )}
    </>
  );
}