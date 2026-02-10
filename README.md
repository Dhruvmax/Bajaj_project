# BFHL API

This is a REST API developed for the Bajaj Finserv Health challenge. It provides endpoints for various mathematical operations and AI integration.

## API Endpoints

### POST /bfhl
Main endpoint that accepts JSON data and performs operations based on the input key.

**Request Body Format:**
```json
{
  "fibonacci": 7
}
```
OR
```json
{
  "prime": [2, 4, 7, 9, 11]
}
```
OR
```json
{
  "lcm": [12, 18, 24]
}
```
OR
```json
{
  "hcf": [24, 36, 60]
}
```
OR
```json
{
  "AI": "What is the capital of India?"
}
```

**Response Format:**
```json
{
  "is_success": true,
  "official_email": "YOUR_EMAIL",
  "data": ...
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "is_success": true,
  "official_email": "YOUR_EMAIL"
}
```

## Setup & Run

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file with:
    ```env
    PORT=3000
    GEMINI_API_KEY=your_gemini_api_key
    EMAIL=your_email@example.com
    ```
4.  Start the server:
    ```bash
    npm start
    ```

## deployment

This project can be deployed on Vercel, Railway, or Render.
