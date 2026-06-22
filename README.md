
# Israeli Bank Scraper Docker API

A lightweight, multi-architecture (`amd64` / `arm64`) Dockerized REST API wrapper for the excellent [israeli-bank-scrapers](https://github.com/eshaham/israeli-bank-scrapers) library. 

This project exposes the Node.js scraper capabilities via a simple Express REST API, making it easy to trigger financial scraping from any programming languag running locally or in Docker.

---

## Quick Start

### 1. Run the Container
Run the pre-built Docker image directly. By default, the API listens on port `9203`.

```bash
docker run -d \
  --name israeli-bank-scraper-api \
  -p 9203:9203 \
  --restart unless-stopped \
  ghcr.io/yohaybn/israeli-bank-scraper-docker/israeli-bank-scraper-api:latest

```

*Note: If you want to change the port inside the container, you can pass an environment variable: `-e PORT=8080 -p 8080:8080`.*

### 2. Trigger a Scrape

Send a `POST` request to the `/scrape` endpoint with your credentials and options payload.

```bash
curl -X POST http://localhost:9203/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "visaCal",
    "startDate": "2026-05-01",
    "combineInstallments": false,
    "credentials": {
      "username": "your_username",
      "password": "your_password"
    }
  }'

```

---

## Build from Source (Optional)

If you cloned this repository and want to build the Docker image locally for your current architecture:

```bash
# Build the image
docker build -t local/israeli-bank-scraper-api .

# Run the local image
docker run -d -p 9203:9203 local/israeli-bank-scraper-api

```

---

## Credits & Documentation

This project is a thin deployment wrapper. All the heavy lifting, financial institution integrations, and core logic are entirely powered by the [israeli-bank-scrapers library by @eshaham](https://github.com/eshaham/israeli-bank-scrapers).

Please check their documentation for the full list of supported `companyId` parameters and credentials schemas for Israeli banks and credit card companies.

