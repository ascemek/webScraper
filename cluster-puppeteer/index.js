// AMAZON SCRAPPER

const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp",
    });

    const page = await browser.newPage();
    await page.goto("https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cn%3A11036071%2Cp_36%3A1253503011&dc&fs=true&qid=1635596580&rnid=16225007011&ref=sr_pg_1");

    const productsHandles = await page.$$("div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item");

    let i = 0;
    let items = [];

    for (const productHandle of productsHandles) {

        let title = "Null";
        let price = "Null";
        let image = "Null";

        try {
            title = await page.evaluate(
                (el) => el.querySelector("h2 > a > span").textContent,
                productHandle
            );
        } catch (error) { }

        try {
            price = await page.evaluate(
                (el) => el.querySelector(".a-price > .a-offscreen").textContent,
                productHandle
            );
        } catch (error) { }

        try {
            image = await page.evaluate(
                (el) => el.querySelector(".s-image").getAttribute("src"),
                productHandle
            );
        } catch (error) { }


        if (title !== "Null") {
            items.push({ title, price, image });
        }
       
    }

    console.log(items);

    //await browser.close();
})();
