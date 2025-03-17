const axios = require('axios');

const getLocation = async (address) => {
  try {
    const response = await axios.get('https://geocode.xyz', {
      params: {
        locate: address,
        json: 1,
      },
      timeout: 10000,
    });

    const { latt, longt } = response.data;
    return {
      latitude: parseFloat(latt).toFixed(8),
      longitude: parseFloat(longt).toFixed(8),
    };
  } catch (error) {
    console.error('Error fetching location:', error.message);
    return { latitude: null, longitude: null };
  }
};

getLocation('New York').then(console.log);
