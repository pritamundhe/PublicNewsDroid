const axios = require('axios');

const getLocation = async () => {
  try {
    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json', { timeout: 10000 });
    const { latitude, longitude, city, country, region, country_code, continent_code, ip, timezone, accuracy, asn, organization, area_code, organization_name, country_code3 } = response.data;
    
    return {
      latitude,
      longitude,
      city,
      country,
      region,
      country_code,
      continent_code,
      ip,
      timezone,
      accuracy,
      asn,
      organization,
      area_code,
      organization_name,
      country_code3,
    };
  } catch (error) {
    console.error('Error fetching location:', error.message);
    return { latitude: null, longitude: null, city: 'Unknown', country: 'Unknown' };
  }
};

module.exports = getLocation;
