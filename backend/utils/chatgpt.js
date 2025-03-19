const axios = require('axios');

const API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
const API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!API_KEY) {
    console.error("Error: Missing Hugging Face API Key. Set HUGGINGFACE_API_KEY in your environment.");
    process.exit(1);
}

const tagsList = [
    ["City Updates", "Neighborhood News", "Ward Updates", "Local Politics", "Municipal Corporation News", 
     "Traffic & Parking Issues", "Road & Infrastructure", "Electricity & Water Supply", "Waste Management", "Public Transport"],
    ["Local Crime Reports", "Community Events", "Festivals & Celebrations", "Schools & Colleges", "Local Markets & Businesses",
     "Health & Hospitals", "Weather Updates", "Religious & Cultural Activities", "Employment & Job Openings", "Missing Persons & Lost & Found"],
    ["Real Estate & Housing", "Public Safety Alerts", "NGOs & Social Work", "Local Startups & Innovations", "Historical & Heritage Sites",
     "Sports & Tournaments", "Accidents & Emergency Reports", "Tourist Attractions & Travel", "Legal & Court Updates", "Local Heroes & Inspirational Stories"]
];

async function classifyContent(content) {
    try {
        const classificationResults = await Promise.all(
            tagsList.map(async (tags) => {
                const response = await axios.post(API_URL, {
                    inputs: content,
                    parameters: { candidate_labels: tags }
                }, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.data || !response.data.labels || !response.data.scores) {
                    console.error("Unexpected response format:", response.data);
                    return [];
                }

                return response.data.labels.map((label, index) => ({
                    tag: label,
                    score: response.data.scores[index]
                }));
            })
        );

        // Flatten the results and sort by score
        const sortedResults = classificationResults.flat().sort((a, b) => b.score - a.score);
        
        // Return the top 2 tags
        return sortedResults.slice(0, 3);
    } catch (error) {
        console.error('Error during classification:', error.response ? error.response.data : error.message);
        return [];
    }
}

module.exports = classifyContent;
