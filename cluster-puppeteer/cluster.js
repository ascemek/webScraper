const fs = require("fs");
const { Cluster } = require("puppeteer-cluster");

const urls = [
    "https://www.bhg.com/gardening/plant-dictionary/bulb/allium/", //allium
    "https://www.bhg.com/gardening/plant-dictionary/vegetable/arugula/", //arugula
];

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 100,
        monitor: true,
        puppeteerOptions: {
            headless: false,
            defaultViewport: false,
            userDataDir: "./tmp",
        },
    });

    cluster.on("taskerror", (err, data) => {
        console.log(`Error crawling ${data}: ${err.message}`);
    });

    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);
        const plantsHandles = await page.$$(
            "#bhg-article_1-0 > div.loc.article-content"
        );

        for (const planthandle of plantsHandles) {
            let plantFeatures = "Null";

            try {
                plantFeatures = await page.evaluate(
                    (el) => el.querySelector("table > tbody").textContent,
                    planthandle
                );
            } catch (error) { }

            // WRITE TO TXT
            try{
                fs.appendFile(
                    "results.txt",
                    `${plantFeatures}${"############################"}\n`,
                    function (err) {
                        if (err) throw err;
                    }
                );
            }catch(error){
                console.log("error");
            }

            // WRITE TO JSON
            // try{
            //     fs.writeFile(
            //         "data.json",
            //         JSON.stringify(plantFeatures),
            //         function (err) {
            //             if (err) throw err;
            //         }
            //     );
            // }catch(error){
            //     console.log("error");
            // }


        }
    });

    for (const url of urls) {
        await cluster.queue(url);
    }

    await cluster.idle();
    await cluster.close();
})();
