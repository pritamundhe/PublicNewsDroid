const axios = require('axios');

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

const analyzeContent = async (content) => {
  try {
    if (!HF_API_KEY) {
        console.error('Hugging Face API Key is missing');
        process.exit(1);
    }

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/unitary/toxic-bert',
      { inputs: content },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    );

    const toxicLabel = response.data[0].find(
      label => label.label === 'toxic' || label.label === 'severe_toxic'
    );

    const toxicityThreshold = 0.005;

    if (toxicLabel && toxicLabel.score > toxicityThreshold) {
      return true;
    }

    console.log(toxicLabel.data);

    return false;
  } catch (error) {
    console.error('Error analyzing content:', error.response ? error.response.data : error.message);
    return false;
  }
};

module.exports = analyzeContent;
