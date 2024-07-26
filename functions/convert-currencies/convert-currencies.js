// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    const API_KEY = process.env.CURRENCY_API_KEY;
    const { baseCur, convertCur, amount } = event.queryStringParameters;

    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${baseCur}/${convertCur}/${amount}`
    );
    const result = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};

module.exports = { handler };
