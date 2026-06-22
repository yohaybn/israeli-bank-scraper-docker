FROM node:24-slim

WORKDIR /app

# Install standard curl/ca-certificates first so Puppeteer can download binaries securely
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install

# This command downloads Chromium AND automatically sets up 
# all modern system dependencies required to run it headless!
RUN npx puppeteer browsers install chrome --with-deps

COPY server.js ./

EXPOSE 9203
ENV PORT=9203

CMD ["npm", "start"]
