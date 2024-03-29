import { useLoaderData, useNavigation, useOutletContext } from "@remix-run/react";
import SearchCard from "~/components/searchCard";
import { bingNewsSearch } from "~/models/news/news.server";
import { summarizeSearch } from "~/models/ai/summarybot.server";
import { defer } from "@remix-run/server-runtime";
import { Suspense } from "react";
import { Await } from "@remix-run/react";


export async function loader({ params }) {

  if (params.search) {

    try {

      const searchResultsPromise = await bingNewsSearch(params.search);



      const searchResults = await searchResultsPromise;
      const summaryArray = await searchResults?.map((oneResult) => {
        return {
          name: oneResult.name,
          description: oneResult.description
        };
      });
      console.log(searchResults, summaryArray, 'news search page 27');
      const summaryResponsePromise = await summarizeSearch(params.search, summaryArray);
      return defer({
        searchResults: searchResultsPromise,
        summaryResponse: summaryResponsePromise
      });

    } catch (error) {
      throw error;
    }
  } else {
    console.log('null');
    return null;
  }

}

export default function NewsSearch() {
  const loaderData = useLoaderData() || '';
  const isSubmitting = useNavigation().state === 'submitting';

  const [bgColor, textColor] = useOutletContext();


  const newsGrid = (
    <Suspense fallback={<p>Loading news...</p>}>
      <Await
        resolve={loaderData?.searchResults}
        errorElement={<p>Error loading news search results!</p>}
      >
        {(searchResults) =>
          searchResults ? (
            searchResults.map((newsItem) => {
              const uniqueId = Math.random().toString(32).slice(2);
              return <SearchCard key={uniqueId} data={newsItem} />;
            })
          ) : (
            <p>Loading search results...</p>
          )}
      </Await>
    </Suspense>
  );

  const summary = (
    <Suspense fallback={(
      <div className={`${bgColor} max-w-full  p-4`}>
        <pre className={textColor}>Loading summary...</pre>
      </div>)}>
      <Await
        resolve={loaderData?.summaryResponse}
        errorElement={<p>Error loading summary!</p>}
      >
        {(summaryResult) => {
          if (summaryResult) {

            console.log("Summary Result:", summaryResult);
            return (
              <div className={`${bgColor} max-w-full overflow-x-hidden p-4`}>
                <pre className={` overflow-x-hidden whitespace-pre-wrap text-sm ${textColor}`}>
                  {summaryResult}
                </pre>
              </div>
            );
          } else {
            return (
              <div className={`${bgColor} max-w-full  p-4`}>
                <pre className={textColor}>Waiting for a new search</pre>
              </div>);
          }
        }}
      </Await>
    </Suspense>
  );

  return (
    <>
      {summary}
      {isSubmitting ? <pre className={`${textColor} ${bgColor} mt-4`}>Loading results</pre> : newsGrid}
    </>
  );
}


