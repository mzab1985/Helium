// In CommonJS, modules are loaded using require() instead of import
const axios = require('axios');



// Function to perform 5 million calculations
function heavyComputation() {
  let result = 0;
  for (let i = 0; i < 75_000_000; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }
  return result;
}

// Function to measure speed of Axios request and computation
async function measureAxiosSpeed() {
  // Perform 5 million calculations
  const computationStart = performance.now();
  const computationResult = heavyComputation();
  const computationEnd = performance.now();
  const computationTime = computationEnd - computationStart;
  console.log(`Computation Time: ${computationTime} ms`);

  // Measure Axios request time
  const axiosStart = performance.now();
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1'); // Example URL
    const axiosEnd = performance.now();
    const axiosTime = axiosEnd - axiosStart;

    console.log('Computation Result:', computationResult);
    console.log('Axios Response:', response.data);
    console.log(`Axios Request Time: ${axiosTime} ms`);

    return {
      computationResult,
      computationTime,
      axiosTime,
    };
  } catch (error) {
    console.error('Error making Axios request:', error);
  }
}

// Execute the function
measureAxiosSpeed();
