const axios = require('axios');

const API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
const API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!API_KEY) {
    console.error("Error: Missing Hugging Face API Key. Set HUGGINGFACE_API_KEY in your environment.");
    process.exit(1);
}

async function classifyContent(content, tags) {
    try {
        const data = {
            inputs: content,
            parameters: { candidate_labels: tags }
        };

        const response = await axios.post(API_URL, data, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.labels || !response.data.scores) {
            console.error("Unexpected response format:", response.data);
            return [];
        }

        return response.data.labels
            .map((label, index) => ({ tag: label, score: response.data.scores[index] }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 2);
        
    } catch (error) {
        console.error('Error during classification:', error.response ? error.response.data : error.message);
        return [];
    }
}

const content = "A person lost in the city";

const tags1 = ["City Updates", "Neighborhood News", "Ward Updates", "Local Politics", "Municipal Corporation News",
    "Traffic & Parking Issues", "Road & Infrastructure", "Electricity & Water Supply", "Waste Management", "Public Transport"];

const tags2 = ["Local Crime Reports", "Community Events", "Festivals & Celebrations", "Schools & Colleges", "Local Markets & Businesses",
    "Health & Hospitals", "Weather Updates", "Religious & Cultural Activities", "Employment & Job Openings", "Missing Persons & Lost & Found"];

const tags3 = ["Real Estate & Housing", "Public Safety Alerts", "NGOs & Social Work", "Local Startups & Innovations", "Historical & Heritage Sites",
    "Sports & Tournaments", "Accidents & Emergency Reports", "Tourist Attractions & Travel", "Legal & Court Updates", "Local Heroes & Inspirational Stories"];

Promise.all([
    classifyContent(content, tags1),
    classifyContent(content, tags2),
    classifyContent(content, tags3)
]).then(results => {
    results.forEach((result, index) => {
        console.log(`Top 2 tags for Group ${index + 1}:`);
        result.forEach(tagInfo => {
            console.log(`- ${tagInfo.tag} (Score: ${tagInfo.score.toFixed(4)})`);
        });
    });
}).catch(error => {
    console.error("Error:", error);
});
