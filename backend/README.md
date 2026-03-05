# Divergent Backend

This is the backend service for the Divergent application. It is an Express server written in TypeScript that interacts with the Ollama API to generate complete, single-file HTML applications based on user prompts.

## Features

- **Prompt Generation API**: An endpoint that streams generated HTML code from an AI model (`glm-4.7:cloud`) via Ollama based on user text prompts.
- **Health Check API**: A simple endpoint to verify that the server is up and running.
- **Stream Support**: Streams AI responses using chunked transfer encoding, allowing real-time response rendering on the client side.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Integration**: Ollama (Node.js library)
- **Security & Utilities**: Helmet, CORS, dotenv

## Getting Started

### Prerequisites

- Node.js
- npm (or yarn)
- Note: Requires access to a configured Ollama instance running the `glm-4.7:cloud` model.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add any necessary environment variables.
   ```bash
   PORT=5001
   ```

### Running the Server

- **Development mode** (with hot-reloading using `tsx`):
  ```bash
  npm run dev
  ```

- **Production build**:
  ```bash
  npm run build
  npm start
  ```

## API Endpoints

### Generate Prompt

- **URL**: `/api/prompt`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "prompt": "Your descriptive prompt here"
  }
  ```
- **Response**: Streams a raw text response of the generated HTML.

### Health Check

- **URL**: `/api/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "ok",
    "message": "Server is running"
  }
  ```
