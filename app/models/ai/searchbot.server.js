const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);


export async function refineSearchTerm(search) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `
          "=== INSTRUCTIONS ===\nYou are an AI language model assisting a user to refine their search term for Bing News API. Your task is to modify the given search term into a more specific and very precise and very short  keyword query for better search results. The user might provide something that's hard to refine, yet TRY YOUR BEST TO DO IT EVEN IF IT'S HARD.  It is crucial that you provide ONLY the revised search term as the output, without any additional text, quotations, or declarations. The output will be sent directly to the search API and cannot be checked beforehand.\n\nKeep in mind that the API can only access news articles from the recent months, so there's no need to mention any specific date. Try to avoid outdated or location-specific search queries. DO NOT ADD ANY EXTRA QUOTATIONS AT WHATSOEVER IN YOUR RESPONSE. \n\nExample 1:\nInput: \"Electric cars\"\nOutput: \"Latest Tesla news and updates". If a term is already search engine specific do little to no changes.
          
          
          `,
      },
      { role: "user", content: `Refine this search term for Bing News API. Do NOT ADD "": ${search}` },
    ],
    temperature: 0,
    max_tokens: 70,
    top_p: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  // const choice = result.choices[0];
  return response;
}




