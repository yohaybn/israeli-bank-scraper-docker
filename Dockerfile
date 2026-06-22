FROM node:24-slim

# Tell Puppeteer to skip downloading its built-in chrome binary
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install native Chromium and its dependencies via Debian packages
# This works perfectly out-of-the-box on BOTH amd64 and arm64
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install

COPY server.js ./

EXPOSE 9203
ENV PORT=9203

CMD ["npm", "start"]
