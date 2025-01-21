const axios = require('axios');

const getLocationFromIPAPI = async () => {
  try {
    const response = await axios.get('http://ip-api.com/json', { timeout: 10000 });

    const { lat, lon } = response.data;
    return {
      latitude: parseFloat(lat).toFixed(8),
      longitude: parseFloat(lon).toFixed(8),
    };
  } catch (error) {
    console.error('Error fetching location from IP-API:', error.message);
    return { latitude: null, longitude: null };
  }
};

module.exports = getLocationFromIPAPI;
