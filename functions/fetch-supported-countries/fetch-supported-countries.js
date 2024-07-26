// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  const API_KEY = process.env.CURRENCY_API_KEY;
  try {
    const countriesRes = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`
    );
    const countries = await countriesRes.json();
    return {
      statusCode: 200,
      body: JSON.stringify(countries),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
