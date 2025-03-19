const axios = require('axios');

const getGeoLocation = async () => {
  try {
    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json', {
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching geolocation:', error.message);
    return null;
  }
};

module.exports = getGeoLocation;
