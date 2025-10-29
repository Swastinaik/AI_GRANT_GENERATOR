'use client'
import React, { useState } from "react"
import LoaderComponent from '../components/Loader';
import ErrorFallBack from '../components/ErrorBoundary'
import axios from "axios";
import { generateRandomString } from "../lib/utils/helpers";


type styleType = "classic" | "modern"
export default function Resume() {
    const [jobDescription, setJobDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [userProfile, setUserProfile] = useState<string | undefined>(undefined)
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [style, setStyle] = useState<styleType>("classic")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            setSelectedFile(files[0])
            setUploadedFile(URL.createObjectURL(files[0]));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setStyle(value as styleType)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const form = new FormData()
            if(selectedFile){
                form.append("file", selectedFile)
            }
            if(userProfile){
                form.append("user_information",userProfile)
            }
            form.append("job_description",jobDescription)
            form.append("style",style)

            const api = process.env.NEXT_PUBLIC_API_KEY || 'api'
            const response = await axios.post(`${api}/resume-generator`,form,{
                withCredentials: true,
                responseType: 'arraybuffer',
              
            })
            const mediaType = response.headers['content-type'];
            const blob = new Blob([response.data], { type: mediaType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const fileName = generateRandomString(5) + '.docx'
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
        finally{
            setLoading(false)
        }
    }


    return (
        <>
        {loading ? <LoaderComponent/> : error ? <ErrorFallBack/> :
        <div className="dark bg-gradient-to-b from-black via-neutral-900 to-black h-screen py-8">
            <div className="w-full max-w-3xl mx-auto px-6 sm:px-12 overflow-visible">
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-10  rounded-2xl shadow-2xl p-7 pb-28"
                >
                    <h1 className="text-center text-3xl md:text-4xl font-bold mb-2 tracking-wide text-white">
                        Resume Generator
                    </h1>

                    <div className="flex flex-col gap-6 mt-5">
                        <div>
                            <label className="block mb-1 text-white font-semibold">File Uploader</label>
                            <input
                                type="file"
                                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                                onChange={handleFileChange}
                            />
                            {uploadedFile && <img src={uploadedFile} alt="Preview" className="mt-3 w-36 h-36 object-cover rounded-xl" />}
                        </div>
                        <p className="text-gray-100"> or </p>
                        <div>
                            <label className="block mb-2 text-white font-semibold">
                                User Profile
                            </label>
                            <textarea
                                value={userProfile}
                                onChange={(e) => setUserProfile(e.target.value)}
                
                                placeholder="Enter a user information..."
                                rows={5}
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-white font-semibold">
                                Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                required
                                placeholder="Enter a detailed description"
                                rows={5}
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 resize-none"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-2 text-white font-semibold">
                                Select Language
                            </label>
                            <select
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2"
                                value={style}
                                name='language'
                                onChange={handleInputChange}
                            >
                                <option value="classic">Classic</option>
                                <option value="modern">Modern</option>

                            </select>
                        </div>
                    </div>
                    <div className="fixed inset-x-0 bottom-0 bg-black bg-opacity-70 p-5 flex z-50 lg:px-96">
                        <button
                            type="submit"
                           
                            className="w-full py-4 text-lg rounded-xl font-bold transition-all bg-gradient-to-r from-fuchsia-500 via-blue-500 to-pink-400 text-white shadow-lg ring-2 ring-white/10 hover:from-pink-600 hover:to-blue-600 disabled:opacity-50"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
        }
        </>
        
    )
}
