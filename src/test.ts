import createFetch from ".";

const fetch = createFetch();
const response = await fetch("https://example.com");
console.log(await response.text());
