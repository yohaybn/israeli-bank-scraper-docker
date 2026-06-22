const express = require('express');
const { createScraper } = require('israeli-bank-scrapers');

const app = express();
app.use(express.json());

app.post('/scrape', async (req, res) => {
    try {
        const config = req.body;
        const { credentials, ...options } = config;

        if (!options.companyId || !credentials) {
            return res.status(400).json({ error: "Missing required companyId or credentials keys." });
        }

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
        return res.status(500).json({ error: err.message });
    }
});

// Default to port 9203, but allow configuration via environment variable
const PORT = process.env.PORT || 9203;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});