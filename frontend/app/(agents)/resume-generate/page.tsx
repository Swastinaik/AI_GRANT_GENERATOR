'use client'
import React, { useState } from "react"
import LoaderComponent from '../../components/Loader';
import ErrorFallBack from '../../components/ErrorBoundary'
import axios from "axios";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { generateRandomString } from "../../lib/utils/helpers";
import HomeButton from '../../components/HomeButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { fetchWithAuth } from '@/app/lib/api';
import useAuthStore from '@/app/store/AuthStore';


type styleType = "classic" | "modern"
export default function Resume() {
    const [jobDescription, setJobDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [userProfile, setUserProfile] = useState<string | undefined>(undefined)
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [style, setStyle] = useState<styleType>("classic")
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            setSelectedFile(files[0])
            setUploadedFile(URL.createObjectURL(files[0]));
        }
    };

    const handleInputChange = (value: string) => {

        setStyle(value as styleType)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const form = new FormData()
            if (selectedFile) {
                form.append("file", selectedFile)
            }
            if (userProfile) {
                form.append("user_information", userProfile)
            }
            form.append("job_description", jobDescription)
            form.append("style", style)

            const api = process.env.NEXT_PUBLIC_API_URL || 'api'
            const response = await fetchWithAuth(`${api}/resume-generator`, {
                method: 'POST',
                body: form,
                headers: {
                    responseType: 'arraybuffer',
                }
            }, accessToken, setAccessToken)
            if(!response.ok){
                throw Error("Failed to send request to API.")
            }
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const fileName = 'resume/'+ generateRandomString(5) + '.docx'
            link.setAttribute('download', fileName);

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return true
        } catch (error) {
            console.log(error)
            setError(error as string)

        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            {loading ? <LoaderComponent /> : error ? <ErrorFallBack /> :
                <div className="bg-background h-screen p-8">
                    <div className='flex flex-start'>
                        <HomeButton />
                    </div>
                    <div className="w-full max-w-3xl mx-auto px-6 sm:px-12 overflow-visible">
                        <form
                            onSubmit={handleSubmit}
                            className="w-full flex flex-col gap-10  rounded-2xl  p-7 pb-28"
                        >
                            <h1 className="text-center text-3xl md:text-4xl font-bold mb-2 tracking-wide text-foreground">
                                Resume Generator
                            </h1>

                            <div className="flex flex-col gap-6 mt-5">
                                <div>
                                    <Label className="mb-2">File Uploader</Label>
                                    <Input
                                        type="file"
                                        className="w-full h-auto flex items-center justify-center p-3 bg-card border border-border rounded-xl text-foreground file:cursor-pointer file:rounded-xl file:border-0 file:bg-gray-800 file:text-white file:py-2 file:px-4 file:text-sm file:transition-all hover:file:bg-gray-700"
                                        onChange={handleFileChange}
                                    />
                                    {uploadedFile && <img src={uploadedFile} alt="Preview" className="mt-3 w-36 h-36 object-cover rounded-xl" />}
                                </div>
                                <p className="text-gray-100"> or </p>
                                <div>
                                    <Label className="mb-2">
                                        User Profile
                                    </Label>
                                    <Textarea
                                        value={userProfile}
                                        onChange={(e) => setUserProfile(e.target.value)}

                                        placeholder="Enter a user information..."
                                        rows={5}
                                        className="textarea"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2">
                                        Job Description
                                    </Label>
                                    <Textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        required
                                        placeholder="Enter a detailed description"
                                        rows={5}
                                        className="textarea"
                                    />
                                </div>
                                <div className="mb-2">
                                    <Label className="mb-2">
                                        Select Language
                                    </Label>
                                    <Select
                                        value={style}
                                        name='language'
                                        onValueChange={handleInputChange}
                                    >
                                        <SelectTrigger className='w-full'>

                                            <SelectValue
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="classic">Classic</SelectItem>
                                            <SelectItem value="modern">Modern</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="fixed inset-x-0 bottom-0 bg-secondary p-5 flex z-50 lg:px-96">
                                <Button
                                    type="submit"

                                    className="large-button"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>

    )
}
