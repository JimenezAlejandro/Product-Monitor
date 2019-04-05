const puppeteer = require('puppeteer');
const searchUrl = 'https://www.zara.com/us/en/search';


module.exports = async (searchTerm, isSearch) => {
    if (!searchTerm || searchTerm == '') { return {}; }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(isSearch ? searchUrl : searchTerm);

    if (isSearch) {
        await page.focus('#search-term');
        await page.keyboard.type(searchTerm);
        await page.waitFor('a.item');
        await page.click('a.item');
    }
    await page.waitFor('h1.product-name');

    const result = await page.evaluate(() => {
        let json = {};
        let sizes = [];

        let name = document.querySelector('head > meta[name="description"]').content;
        let sizeElements = document.querySelectorAll('input._sizeInput');
        let imageUrl = document.querySelector('a._seoImg.main-image').getAttribute('href');
        let pageUrl = document.querySelector('head > link[rel="canonical"]').href;

        for (var element of sizeElements) {
            sizes.push({ value: element.value, disabled: element.disabled });
        }

        json['name'] = name;
        json['sizes'] = sizes;
        json['imageUrl'] = imageUrl;
        json['pageUrl'] = pageUrl;

        return json;
    });
    browser.close();
    return result;
};

module.exports.getAvailability = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitFor('h1.product-name');

    const result = await page.evaluate(() => {
        let inStock = [];

        let sizeElements = document.querySelectorAll('input._sizeInput');

        for (var element of sizeElements) {
            inStock[element.value] = !(element.disabled);
        }

        return inStock;
    });
    browser.close();
    return result;
};

module.exports.getSizes = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitFor('h1.product-name');

    const result = await page.evaluate(() => {
        let sizes = [];

        let sizeElements = document.querySelectorAll('input._sizeInput');

        for (var element of sizeElements) {
            sizes.push(element.value);
        }

        return sizes;
    });
    browser.close();
    return result;
};