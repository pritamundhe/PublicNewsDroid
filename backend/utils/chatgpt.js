const axios = require('axios');

const API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';

const API_KEY = process.env.HUGGINGFACE_API_KEY;

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

        const results = response.data;
        const sortedResults = results.labels
            .map((label, index) => ({ tag: label, score: results.scores[index] }))
            .sort((a, b) => b.score - a.score);

        return sortedResults;
    } catch (error) {
        console.error('Error during classification:', error.response ? error.response.data : error.message);
        return [];
    }
}

const content = "Virat kolhi wins a match";
const tags = ["machine learning", "Cricket", "Disaster", "Germany", "Big Boss","Sport","Politics","Deer","Baramati"];

classifyContent(content, tags).then(result => {
    console.log("Matched tags:", result);
}).catch(error => {
    console.error("Error:", error);
});
