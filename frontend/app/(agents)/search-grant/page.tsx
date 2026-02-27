'use client';
import axios from 'axios';
import { useState } from 'react';
import LoaderComponent from '@/app/components/Loader';
import ErrorFallBack from '@/app/components/ErrorBoundary'
import GrantGrid from './components/GrantGrid'
import useAuthStore from '@/app/store/AuthStore';
import HomeButton from '@/app/components/HomeButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { fetchWithAuth } from '@/app/lib/api';

export default function SearchGrantForm() {
  const [keyword, setKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchData, setSearchData] = useState([])
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleSubmit = async () => {

    try {
      if (!accessToken) {
        return
      }
      setLoading(true)
      const api = process.env.NEXT_PUBLIC_API_URL || 'api'
      let user_input: any = {}
      user_input['keyword'] = keyword
      user_input['description'] = description
      const response = await fetchWithAuth(`${api}/search-grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // <--- THIS WAS MISSING
        },
        body: JSON.stringify(user_input)
      }, accessToken, setAccessToken)
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json()
      setSearchData(data)
    } catch (error) {
      console.log(error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <>
      {
        loading ? <LoaderComponent /> : error.length > 0 ? <ErrorFallBack error={error} /> : searchData.length > 0 ? <GrantGrid grants={searchData} /> : (
          <div className="bg-background h-screen p-8">
            <div className='flex flex-start'>
              <HomeButton />
            </div>
            <div className="w-full  mx-auto px-6 sm:px-12">

              <div

                className="w-full flex flex-col gap-10  rounded-2xl  p-7"
              >

                <h1 className="text-center text-3xl md:text-4xl font-bold mb-2 tracking-wide text-foreground">
                  Search for Grants
                </h1>
                <div className="flex flex-col gap-6 mt-5">
                  <div className='mb-7'>
                    <Label className="block mb-2">
                      Domain / Type
                    </Label>
                    <Input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      required
                      placeholder="Enter a keyword or type ex: 'Education', 'Research', etc."
                      className='w-full'
                    />
                  </div>
                  <div>
                    <Label className="block mb-2">
                      Grant Description
                    </Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      placeholder="Enter a detailed description"
                      rows={5}
                      className="textarea"
                    />
                  </div>
                </div>
                <div className="fixed inset-x-0 bottom-0 bg-secondary p-5 flex z-50 lg:px-96">
                  <Button
                    onClick={handleSubmit}
                    disabled={!keyword || !description}
                    className="large-button"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>


          </div>
        )
      }
    </>
  );
}
