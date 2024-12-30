import sys
import json
from textblob import TextBlob
from textblob import TextBlob
import re

offensive_keywords = ["kill", "violence", "terrorist", "bomb", "shoot","Loser"]

def analyze_news(content):
    # Sentiment analysis
    analysis = TextBlob(content)
    sentiment = analysis.sentiment.polarity

    # Keyword-based filtering
    contains_offensive_keywords = any(
        keyword in content.lower() for keyword in offensive_keywords
    )

    # Determine if content is offensive
    is_offensive = sentiment < -0.5 or contains_offensive_keywords
    flagged_reason = (
        "Highly negative sentiment" if sentiment < -0.5 else "Contains offensive keywords"
        if contains_offensive_keywords
        else None
    )

    tags = ["positive"] if sentiment > 0 else ["negative", "offensive"] if is_offensive else ["neutral"]

    return {
        "isOffensive": is_offensive,
        "reason": flagged_reason,
        "tags": tags,
    }

if __name__ == "__main__":
    content = sys.argv[1]
    result = analyze_news(content)
    print(json.dumps(result))
