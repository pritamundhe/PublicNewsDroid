# Public News Droid

Public News Droid is a sleek and modern news website that provides users with categorized news in an easy-to-navigate format. This project is built using **React** and styled with **Tailwind CSS**, ensuring a responsive and visually appealing design.

---

## Features

- **Attractive Header**:
  - Includes a search bar with a dedicated search button.
  - Displays a logo and site title.
  - User actions like messages and profile are easily accessible.

- **Dynamic Navigation Bar**:
  - Categorized navigation items styled as white rectangles.
  - Hover effects for better user interaction.
  - Fully responsive layout.

- **Clean Design**:
  - Minimalistic and modern UI with Tailwind CSS.
  - Easy-to-use and user-friendly interface.

---

## Tech Stack

- **Frontend**:
  - React
  - Tailwind CSS

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pritamundhe/PublicNewsDroid.git
   cd PublicNewsDroid
   ```

2. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```env
CLIENT_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:5000/api
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TEXTRAZOR_API_KEY=your_textrazor_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running the Application

1. Start the Backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the Frontend application:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.
