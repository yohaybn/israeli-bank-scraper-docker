const express = require('express');
const {
    createScraper
} = require('israeli-bank-scrapers');

const app = express();
app.use(express.json());

app.post('/scrape', async (req, res) => {
    try {

        const config = req.body;
        const {
            credentials,
            ...options
        } = config;

        if (!options.companyId || !credentials) {
            return res.status(400).json({
                error: "Missing required companyId or credentials keys."
            });
        }

        // Force the scraper to use the container's native multi-arch Chromium binary
        options.browserArgs = options.browserArgs || {};
        options.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium';
        options.args = [
          ...(options.args || []),
          '--no-sandbox',
          '--disable-setuid-sandbox',
          // 1. Spoof a completely real, standard Windows Chrome browser user agent
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          // 2. Set language headers so Israeli portals don't flag missing locale traits
          '--lang=he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
          // 3. Request standard desktop structural dimensions
          '--window-size=1920,1080'
        ];
        
        // 4. Force default viewports to emulate full desktop resolutions 
        options.defaultViewport = {
          width: 1920,
          height: 1080
        };

        // Safely parse the startDate if it's passed as a string
        if (options.startDate && typeof options.startDate === 'string') {
            options.startDate = new Date(options.startDate);
        }

        const scraper = createScraper(options);
        const scrapeResult = await scraper.scrape(credentials);
        if (!scrapeResult.success) {
            return res.status(500).json({
                error: `Scrape execution unsuccessful: ${scrapeResult.errorType}`,
                errorMessage: scrapeResult.errorMessage
            });
        }

        // Return the scraped accounts and transactions directly
        return res.json(scrapeResult.accounts);

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
});

// Default to port 9203, but allow configuration via environment variable
const PORT = process.env.PORT || 9203;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
