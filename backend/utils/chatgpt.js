const axios = require('axios');

// Hugging Face API URL for Zero-shot classification model
const API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';

// Replace with your Hugging Face API key
const API_KEY = process.env.HUGGINGFACE_API_KEY;

// Function to perform zero-shot classification
async function classifyContent(content, tags) {
    try {
        // Request body with content and candidate labels (tags)
        const data = {
            inputs: content,
            parameters: { candidate_labels: tags }
        };

        // Make a POST request to the Hugging Face API
        const response = await axios.post(API_URL, data, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Extract and return the relevant tags based on score
        const results = response.data;
        const sortedResults = results.labels
            .map((label, index) => ({ tag: label, score: results.scores[index] }))
            .sort((a, b) => b.score - a.score);  // Sort by score in descending order

        return sortedResults;
    } catch (error) {
        console.error('Error during classification:', error.response ? error.response.data : error.message);
        return [];
    }
}

// Example content and tags
const content = "state";
const tags = ["machine learning", "AI", "data science", "web development", "Java","Sport","Politics"];

// Call the classifyContent function
classifyContent(content, tags).then(result => {
    console.log("Matched tags:", result);
}).catch(error => {
    console.error("Error:", error);
});
