import { gotScraping as got } from 'got-scraping';
import { load } from 'cheerio';
import { sleep } from '../utils/utils.js';
export class Gesobau {
    async execute() {
        const allItems = await this.parseAllLatest();
        await this.parseAllLatestDetails(allItems);
    }
    async parseAllLatest() {
        const res = await got
            .get('https://www.gewobag.de/fuer-mieter-und-mietinteressenten/mietangebote/')
            .text();
        let $ = load(res);
        const links = [];
        $('.overview-small-layout').each(function (i, elem) {
            links.push($(elem).find('a').attr('href'));
        });
        console.log(links);
        return links;
    }
    async parseAllLatestDetails(listOfItems) {
        console.log('Gesobau');
        for (let i = 0; i < listOfItems.length; i++) {
            await sleep(1000);
            const res = await got
                .get({
                url: `${listOfItems[i]}`,
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                },
            })
                .text();
            const $ = load(res);
            const price = $('#tx-openimmo-2 > div:nth-child(2) > div.bs4-row.flex-wrap > section:nth-child(2) > div > div > dl > div:nth-child(1) > dd > p')
                .text()
                .replace('€', '')
                .trim();
            const rooms = $('#tx-openimmo-2 > div:nth-child(2) > div.bs4-row.flex-wrap > section.kennzahlen.bs4-col-md-6.mb-5 > div > dl > div:nth-child(1) > dd > p').text();
            const area = $('#tx-openimmo-2 > div:nth-child(2) > div.bs4-row.flex-wrap > section.kennzahlen.bs4-col-md-6.mb-5 > div > dl > div:nth-child(2) > dd > p').text();
            const address = $('#tx-openimmo-2 > div:nth-child(2) > div.facts_summary.mb-5.text-meta > p.location').text();
            const wbs = $('#tx-openimmo-2 > div:nth-child(2) > div.bs4-row.flex-wrap > section.kennzahlen.bs4-col-md-6.mb-5 > div > dl > div:nth-child(3) > dd > p').text();
            console.log({
                price,
                rooms,
                area,
                address,
                wbs,
            });
        }
    }
}
