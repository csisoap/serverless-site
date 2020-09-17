const { URL } = require("url");
const fetch = require("node-fetch");
require("dotenv").config();
const { query } = require("./util/hasura");

const movies = require("../data/movies.json");

exports.handler = async () => {
  const { movies } = await query({
    query: `
      query MyQuery {
        movies {
          id
          poster
          tagline
          title
        }
      }
    `,
  });

  const api = new URL("https://www.omdbapi.com");

  //add the secret API key
  api.searchParams.set("apikey", process.env.OMDB_API_KEY);

  const promises = movies.map((movie) => {
    //use the movie's IMdb ID to look up details
    api.searchParams.set("i", movie.id);

    // @ts-ignore
    return fetch(api)
      .then((response) => response.json())
      .then((data) => {
        const scores = data.Ratings;

        return {
          ...movie,
          scores,
        };
      });
  });

  const moviesWithRatings = await Promise.all(promises);

  return {
    statusCode: 200,
    body: JSON.stringify(moviesWithRatings),
  };
};
