// THIS IS THE MAIN FILE YOU ARE WORKING ON

const puppeteer = require("puppeteer");
const fs = require("fs/promises");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp",
    });

    const page = await browser.newPage();
    await page.goto("https://www.bhg.com/gardening/plant-dictionary/bulb/allium/");


    const plantName = await page.waitForSelector('#mntl-sc-block_1-0-6 > table', { timeout: 10000 });

    let i = 0;
    let plants = [];

    (async () => {
        const browser = await puppeteer.launch();

        const urls = [
            "https://www.bhg.com/gardening/plant-dictionary/bulb/allium/",
            "https://www.bhg.com/gardening/plant-dictionary/bulb/triumph-tulips/",
            // "https://www.bhg.com/gardening/plant-dictionary/bulb/society-garlic/",
            // "https://www.bhg.com/gardening/plant-dictionary/bulb/anemone-bulb/",
            // "https://www.bhg.com/gardening/plant-dictionary/bulb/gloriosa-lily/",
            // "https://www.bhg.com/gardening/plant-dictionary/perennial/bee-balm/",
            // "https://www.bhg.com/gardening/plant-dictionary/perennial/hollyhock/",
            // "https://www.bhg.com/gardening/plant-dictionary/perennial/perennial-geranium/",
            // "https://www.bhg.com/gardening/plant-dictionary/perennial/spurge/"
        ];

        for (const url of urls) {

            const page = await browser.newPage();
            await page.goto(url, { waitUntil: "domcontentloaded" });

            let plantFeatures = "Null";

            // try{
            //     plantFeatures = await page.evaluate(
            //         (el) => el.querySelector("tr > td.mntl-sc-block-profile__value").textContent, url[i]
            //     );
            //     i++;
            //     console.log(plantFeatures);
            // }catch(error){
            //     console.log("error");
            // }

            // plantFeatures = await page.$$eval(
            //     "tr > td.mntl-sc-block-profile__value",
            //     els => els.map(el => el.textContent)
            // );
            // console.log(plantFeatures);

            // if (plantFeatures !== "Null") {
            //     plants.push({ plantFeatures });
            // }

            // THIS ONE ALSO WORKS
            // INSTEAD OF RETURNING AN ARRAY IF YOU RETURN A STRIING THEN I CAN PUSH THEM INTO AN ARRAY
            plantFeatures = await page.evaluate(() => {
                (el) => el.querySelector("tr > td.mntl-sc-block-profile__value").textContent,
                productHandle
            });




            //     return Array.from(document.querySelectorAll('tr > td.mntl-sc-block-profile__value')).map(x => x.textContent);
            // })
            // await fs.appendFile("PlantList.txt", plantFeatures.join("\r"))
            // console.log("Plant Genus Name: " + plantFeatures[0] + "\n");
            // console.log("Plant Common Names: " + plantFeatures[1] + "\n");
            // console.log("Plant Type: " + plantFeatures[2] + "\n");
            // console.log("Plant Light: " + plantFeatures[3] + "\n");

            await page.close();

        }
    })()
        .catch(err => console.error(err))
        .finally(() => browser?.close());

    //console.log(plants);
    await browser.close();

    await fs.appendFile("data.json", JSON.stringify(plants));

    

})();