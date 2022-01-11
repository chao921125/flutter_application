const puppeteer = require("puppeteer");
// import * as puppeteer from "puppeteer";

// /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
// /Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge

const optionsLaunch = {
    headless: false,
    devtools: false,
    defaultViewport: {
        width: 1200,
        height: 900
    },
    slowMo: 250,
    timeout: 0,
    // product: "chrome",
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ["--enable-automation"],
    // channel: "chrome",
    // executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
};
const optionsPage = {
    timeout: 0,
    waitUntil: "domcontentloaded"
};

;(async () => {
    await initBrowser();
})().catch(async error => {
    await initBrowser();
});

// 1-10
let pageUrl = "https://t66y.com/thread0806.php?fid=25";
let pageSize = 17;
let pageStart = 1;

const initBrowser = async () => {
    // await page.evaluateOnNewDocument(() => {
    //     Object.defineProperty(navigator, 'webdriver', { get: () => false });
    // });
    // for (let i = pageStart; i <= pageSize; i++) {
    for (let i = pageSize; i >= pageStart; i--) {
        const browser = await puppeteer.launch(optionsLaunch);
        const page = await browser.newPage();
        console.log(i);
        await page.goto(pageUrl + `&search=&page=${i}`, optionsPage);
        await getData(page, browser, i);
        await page.waitFor(3000);
        await browser.close();
    }
}

const getData = async (page, browser, index) => {
    await page.waitForSelector("#tbody");
    let listLength = await page.$$eval("#tbody > tr", el => el.length);
    let start = 1;
    if (index === 1) {
        start = 11;
    }
    for (let i = start; i <= listLength; i++) {
        const pageDetail = await browser.newPage();
        try {
            let linkHref = await page.$eval(`#tbody > tr:nth-child(${i}) > td:nth-child(2) > h3 > a`, el => el.href);
            await pageDetail.goto(linkHref, optionsPage);
            let downHref = await pageDetail.$$eval("#main div.t.t2 table tbody tr.tr1.do_not_catch th:nth-child(2) table tbody tr td div.tpc_content.do_not_catch a", el => {
                for (let j = 0; j < el.length; j++) {
                    if (el[j].getAttribute("href").includes("link.php")) {
                        return el[j].getAttribute("href");
                    }
                }
            });
            console.log(downHref);
            await pageDetail.goto(downHref, optionsPage);
            await pageDetail.click("body button:nth-child(5)");
            await pageDetail.close();
        } catch(e) {
            await pageDetail.close();
            continue;
        }
        await page.waitFor(3000);
    }
}
