const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;
const Parser = require('rss-parser');

const app = express();
const PORT = process.env.PORT || 3000;
// Configure parser to look for media:content and enclosure for images
const parser = new Parser({
    customFields: {
        item: ['media:content', 'enclosure', 'image']
    }
});

app.use(cors());

// 1. TICKER API
const symbolMap = {
    'nifty': '^NSEI',
    'sensex': '^BSESN',
    'banknifty': '^NSEBANK',
    'sp500': '^GSPC',
    'nasdaq': '^IXIC',
    'dow': '^DJI',
    'ftse': '^FTSE',
    'nikkei': '^N225',
    'dax': '^GDAXI',
    'btc': 'BTC-USD',
    'usdinr': 'INR=X',
    'eurinr': 'EURINR=X',
    'gbpinr': 'GBPINR=X',
    'brent': 'BZ=F',
    'goldinr': 'GC=F',
    'silverinr': 'SI=F'
};

app.get('/api/ticker', async (req, res) => {
    try {
        const symbols = Object.values(symbolMap);
        const quotes = await yahooFinance.quote(symbols);
        const formattedData = {};
        for (const [id, symbol] of Object.entries(symbolMap)) {
            const quote = quotes.find(q => q.symbol === symbol);
            if (quote) {
                formattedData[id] = {
                    price: quote.regularMarketPrice,
                    pct: quote.regularMarketChangePercent
                };
            }
        }
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching Yahoo Finance data:', error.message);
        res.status(500).json({ error: 'Failed to fetch live data' });
    }
});

// 2. AGGREGATED NEWS API
const RSS_FEEDS = {
    'india': [
        { url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', source: 'The Economic Times' },
        { url: 'https://www.business-standard.com/rss/markets-106.rss', source: 'Business Standard' }
    ],
    'global': [
        { url: 'https://economictimes.indiatimes.com/markets/global-markets/rssfeeds/302302302.cms', source: 'The Economic Times Global' },
        { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', source: 'CNBC Finance' }
    ],
    'nifty': [
        { url: 'https://economictimes.indiatimes.com/markets/stocks/news/rssfeeds/2146842.cms', source: 'ET Stocks' }
    ],
    'stocks': [
        { url: 'https://economictimes.indiatimes.com/markets/stocks/news/rssfeeds/2146842.cms', source: 'ET Stocks' },
        { url: 'https://www.business-standard.com/rss/companies-101.rss', source: 'Business Standard' }
    ],
    'sector': [
        { url: 'https://economictimes.indiatimes.com/industry/auto/rssfeeds/13357555.cms', source: 'ET Auto', industry: 'Automobile' },
        { url: 'https://economictimes.indiatimes.com/industry/energy/rssfeeds/13357490.cms', source: 'ET Energy', industry: 'Energy & Power' },
        { url: 'https://economictimes.indiatimes.com/industry/banking/finance/banking/rssfeeds/13358259.cms', source: 'ET Banking', industry: 'Banking & Finance' },
        { url: 'https://economictimes.indiatimes.com/industry/tech/information-tech/rssfeeds/13357270.cms', source: 'ET Tech', industry: 'Information Technology' }
    ]
};

// Helper to extract image URL from RSS item
function extractImage(item) {
    if (item.enclosure && item.enclosure.url) {
        return item.enclosure.url;
    }
    if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
        return item['media:content'].$.url;
    }
    // Fallback: try to regex image from content HTML
    const content = item.content || item.contentSnippet || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
        return imgMatch[1];
    }
    return null;
}

app.get('/api/news', async (req, res) => {
    const category = req.query.category || 'india';
    const feeds = RSS_FEEDS[category] || RSS_FEEDS['india'];
    let allNews = [];

    try {
        for (const feed of feeds) {
            try {
                const parsed = await parser.parseURL(feed.url);
                const items = parsed.items.slice(0, 5).map(item => ({
                    title: item.title,
                    link: item.link,
                    description: item.contentSnippet || item.content || '',
                    pubDate: item.pubDate,
                    source: feed.source,
                    industry: feed.industry || 'Market News',
                    image: extractImage(item) // Extract the image for the frontend
                }));
                allNews = allNews.concat(items);
            } catch (e) {
                console.error('Failed to parse feed: ' + feed.url);
            }
        }
        
        // Sort by newest
        allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        // Return top 8 items
        res.json({ items: allNews.slice(0, 8) });
    } catch (error) {
        console.error('News aggregation error:', error);
        res.status(500).json({ error: 'Failed to aggregate news' });
    }
});

// Listen on all network interfaces (0.0.0.0) to allow mobile testing over local wifi
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Live Market Data Backend running on http://0.0.0.0:${PORT}`);
});
