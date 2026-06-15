const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\samaa\\.gemini\\antigravity\\brain\\27e0356a-1c59-4141-983e-6e501596bb7b\\.system_generated\\logs\\transcript_full.jsonl';

if (!fs.existsSync(logPath)) {
  console.error("Log file not found at:", logPath);
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
let htmlContent = '';

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    // Find the user input step
    if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('data-testid="available-product"')) {
      htmlContent = obj.content;
      console.log("Found user input HTML in log file!");
      break;
    }
  } catch (e) {
    // Ignore parse errors
  }
}

if (!htmlContent) {
  console.error("Could not find the HTML snippet in logs.");
  process.exit(1);
}

// Regex to find the product links, images, titles, prices
// Example: <a data-testid="available-product" ... href="[URL]" ... <img ... src="[IMG_URL]" ... <span ...>[TITLE]</span> ... <span ...>From <span>$[PRICE]</span></span>
// Let's split the HTML content by available-product to make it easier to parse each product card
const parts = htmlContent.split('data-testid="available-product"');
const products = [];

// The first part is the header, skip it
for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  
  // Extract link
  const linkMatch = part.match(/href="([^"]+)"/);
  const link = linkMatch ? linkMatch[1] : '';
  
  // Extract image URL
  const imgMatch = part.match(/src="(https:\/\/ih1\.redbubble\.net\/image\.[^"]+)"/);
  const img = imgMatch ? imgMatch[1] : '';
  
  // Extract title
  // Looking for the text after js-heartButton and imageContainer: it's inside a span with text Premium Oversized Hoodie, etc.
  // We can look for data-testid="ds-box" followed by text:
  // <span class="[^"]+">Premium Oversized Hoodie</span>
  const titleMatch = part.match(/<span class="[^"]+">([^<]+)<\/span>/);
  let title = titleMatch ? titleMatch[1] : '';
  
  // Sometimes the title is after some other tags. Let's do a more specific match for the product title.
  // In the HTML: <span class="... styles__body2--2dvwJ styles__nowrap--33UtL styles__display-block--3kWC4" data-testid="ds-box">Premium Oversized Hoodie</span>
  const titleMatch2 = part.match(/data-testid="ds-box">([^<]+)<\/span>/g);
  if (titleMatch2) {
    // The title is usually the first data-testid="ds-box" text in the text section of the card
    // Let's filter out common strings and pick the correct one
    for (const match of titleMatch2) {
      const text = match.replace('data-testid="ds-box">', '').replace('</span>', '').trim();
      if (text && text !== 'Favorite' && text !== 'Add to favorites' && !text.includes('$') && !text.includes('From')) {
        title = text;
        break;
      }
    }
  }
  
  // Extract price
  // The price is inside: data-testid="product-price"
  // e.g. <div class="..." data-testid="product-price"><span class="..."><span>$63.25</span></span></div>
  // or <div class="..." data-testid="product-price"><span class="..."><span>From <span>$23.38</span></span></span></div>
  let price = '';
  const priceSectionMatch = part.match(/data-testid="product-price"([\s\S]+?)<\/div>/);
  if (priceSectionMatch) {
    const priceText = priceSectionMatch[1].replace(/<[^>]+>/g, '').trim(); // Remove tags
    price = priceText;
  }
  
  if (link && img && title) {
    products.push({
      title,
      link,
      image: img,
      price
    });
  }
}

console.log(`Parsed ${products.length} products successfully!`);

fs.writeFileSync(
  path.join(__dirname, 'public', 'images', 'drooling-cat-products.json'),
  JSON.stringify(products, null, 2)
);

console.log("Saved products to public/images/drooling-cat-products.json");
