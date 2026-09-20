# Joyory AI LookMatch

Welcome to the documentation for **Joyory AI LookMatch**, an AI-powered beauty match application. This project uses generative AI to analyze text or images of makeup/beauty products and matches them with available products in the catalog based on specific attributes like color, tone, finish, and skin type.

## Architecture

The project consists of two main parts:
- **Frontend**: A static HTML/CSS/JavaScript web application.
- **Backend**: A FastAPI Python application serving the API and AI analysis endpoints.

## Documentation Structure

- [API Reference](API_REFERENCE.md) - Details about the backend REST API endpoints.
- [Setup Guide](SETUP_GUIDE.md) - Instructions to get the project running locally.

## Features

- **Text Analysis**: Users can type a description of a product, and the AI extracts relevant beauty attributes (color, tone, finish).
- **Image Analysis**: Users can upload an image, and the AI will analyze the image to extract beauty attributes.
- **Product Matching**: Based on extracted attributes, the backend finds the closest matching products in the catalog.
