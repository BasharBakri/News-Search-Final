// const axios = require("axios");

// export async function fetchCategory(category) {
//   const options = {
//     method: 'GET',
//     url: 'https://bing-news-search1.p.rapidapi.com/news',
//     params: {
//       count: '10',
//       category: category,
//       mkt: "en-US",
//       safeSearch: 'Off',
//       textFormat: 'Raw',
//     },
//     headers: {
//       'X-BingApis-SDK': 'true',
//       'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
//       'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com',
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     return response.data.value;
//   } catch (error) {
//     console.error(error);
//   }
// }


export async function fetchCategory(category) {

  // const countryCodes = [
  //   'en-CA', // Canada English
  //   'fr-CA', // Canada French
  //   'de-DE', // Germany German
  //   'fr-FR', // France French
  //   'zh-CN', // People's Republic of China Chinese
  //   'en-GB', // United Kingdom English
  //   'en-US'  // United States English
  // ];

  const subscriptionKey = process.env.BING_API_KEY;
  const host = "api.bing.microsoft.com";
  const path = "/v7.0/news/trendingtopics";

  // const mkt = market;

  const url = `https://${host}${path}?mkt=en-us&category=${category.toLowerCase()}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    console.log(result, 'abc');
    return result.value;
  } catch (error) {
    console.log('error', error);
  }
};