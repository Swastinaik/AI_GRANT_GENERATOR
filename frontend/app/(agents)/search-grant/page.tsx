'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoaderComponent from '@/app/components/Loader';
import ErrorFallBack from '@/app/components/ErrorBoundary';
import GrantGrid from './components/GrantGrid';
import useAuthStore from '@/app/store/AuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { fetchWithAuth } from '@/app/lib/api';
import { ArrowLeft, Search } from 'lucide-react';

export default function SearchGrantForm() {
  const [keyword, setKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchData, setSearchData] = useState([]);

  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleSubmit = async () => {
    try {
      if (!accessToken) {
        return;
      }
      setLoading(true);
      const api = process.env.NEXT_PUBLIC_API_URL || 'api';

      let user_input: any = {};
      user_input['keyword'] = keyword;
      user_input['description'] = description;

      const response = await fetchWithAuth(`${api}/search-grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_input)
      }, accessToken, setAccessToken);

      if (!response.ok) {
        throw new Error('Failed to fetch grant data');
      }

      const data = await response.json();
      setSearchData(data);
    } catch (error) {
      console.log(error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : error.length > 0 ? (
        <ErrorFallBack error={error} />
      ) : searchData.length > 0 ? (
        <GrantGrid grants={searchData} />
      ) : (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">

          {/* Unified Top Navigation */}
          <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
            </div>
          </nav>

          {/* Main Container - Matched to previous forms */}
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header */}
              <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                  Search for Grants
                </h1>
                <p className="text-muted-foreground text-lg">
                  Enter your domain and a brief description of your project to discover relevant funding opportunities.
                </p>
              </div>

              {/* Form Elements */}
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Domain / Type <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                    placeholder="e.g., 'Education', 'Medical Research', 'Climate Change'"
                    className="h-14 rounded-xl text-base px-4 bg-background border-muted-foreground/30 focus:border-primary focus:ring-primary/20 transition-colors"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Grant Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Provide a brief summary of what the grant is for, the target demographic, and expected outcomes..."
                    rows={6}
                    className="resize-none rounded-xl text-base p-4 bg-background border-muted-foreground/30 focus:border-primary focus:ring-primary/20 transition-colors"
                  />
                </div>

                {/* Submit Button - Matched footer style */}
                <div className="pt-8 mt-8 border-t border-border flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-4">
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!keyword.trim() || !description.trim() || loading}
                    className="w-full sm:w-auto h-12 px-8 text-base rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all"
                  >
                    {loading ? (
                      "Searching..."
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Search Grants
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

          </main>
        </div>
      )}
    </>
  );
}