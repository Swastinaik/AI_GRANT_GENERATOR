'use client';
import axios from 'axios';
import { useState } from 'react';
import {MultiStepLoader} from './multi-step-loader'
import ErrorFallBack from './ErrorBoundary'
import GrantGrid from './GrantGrid'


export default function KeywordDescriptionForm() {
  const [keyword, setKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchData, setSearchData] = useState([])
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true)
      const url = '/api'
      let user_input:any = {}
      user_input['keyword'] = keyword
      user_input['description'] = description
      const response = await axios.post(`${url}/search-grant`, user_input)
      console.log(response.data)
      setSearchData(response.data)
    } catch (error) {
      console.log(error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
    finally{
      setLoading(false)
    }    
  };

  return (
    <>
    {
      loading ? <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={2000} loop={true} /> : error.length > 0 ? <ErrorFallBack error={error} /> : searchData.length > 0 ? <GrantGrid grants={searchData} /> : (
    <div className="dark bg-gradient-to-b from-black via-neutral-900 to-black h-screen py-8">
      <div className="w-full max-w-3xl mx-auto px-6 sm:px-12">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-10  rounded-2xl shadow-2xl p-7"
        >
          <h1 className="text-center text-3xl md:text-4xl font-bold mb-2 tracking-wide text-white">
            Search for Grants
          </h1>
          <div className="flex flex-col gap-6 mt-5">
            <div>
              <label className="block mb-2 text-white font-semibold">
                Keyword / Type
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
                placeholder="Enter a keyword or type ex: 'Education', 'Research', etc."
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block mb-2 text-white font-semibold">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter a detailed description"
                rows={5}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 resize-none"
              />
            </div>
          </div>
          <div className="fixed inset-x-0 bottom-0 bg-black bg-opacity-70 p-5 flex z-50 lg:px-96">
            <button
              type="submit"
              disabled={!keyword || !description}
              className="w-full py-4 text-lg rounded-xl font-bold transition-all bg-gradient-to-r from-fuchsia-500 via-blue-500 to-pink-400 text-white shadow-lg ring-2 ring-white/10 hover:from-pink-600 hover:to-blue-600 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {/* Spacer to prevent main content from being covered by fixed button */}
      <div className="h-32" />
    </div>
    )
    }
    </>
  );
}
