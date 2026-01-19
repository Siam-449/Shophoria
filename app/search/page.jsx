
import React, { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient.jsx';

export const metadata = {
  title: 'Search Results',
  // It is best practice to not index search result pages to avoid thin content issues.
  robots: {
    index: false,
    follow: true,
  },
};

const SearchPage = () => {
    return (
        <div className="bg-white dark:bg-slate-950">
            <Suspense fallback={
              <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
                  <div className="text-center my-12">
                       <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
                       <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mx-auto animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 8 }).map((_, index) => 
                      <div key={index} className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col animate-pulse">
                          <div className="aspect-square bg-slate-200 dark:bg-slate-800"></div>
                          <div className="p-3 flex flex-col flex-grow">
                              <div className="flex-grow">
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                              </div>
                          </div>
                      </div>
                    )}
                  </div>
              </main>
            }>
                <SearchResultsClient />
            </Suspense>
        </div>
    )
}

export default SearchPage;
