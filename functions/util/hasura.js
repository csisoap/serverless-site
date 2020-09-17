const fetch = require("node-fetch");
const url = require("url");

async function query({ query, variables = {} }) {
  // @ts-ignore
  const result = await fetch(process.env.HASURA_API_KEY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables }),
  }).then((response) => response.json());

  //   TODO show helpful info if there's an error
  //   result.errors

  return result.data;
}

exports.query = query;
