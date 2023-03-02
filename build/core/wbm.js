import { gotScraping as got } from 'got-scraping';
import { load } from 'cheerio';
import { sleep } from '../utils/utils.js';
export class Wbm {
    async execute() {
        const allItems = await this.parseAllLatest();
        // await this.parseAllLatestDetails(allItems);
    }
    async parseAllLatest() {
        const res = await got
            .get('https://www.wbm.de/wohnungen-berlin/angebote-wbm/')
            .text();
        let $ = load(res);
        const links = [];
        $('.openimmo-search-list-item').each(function (i, elem) {
            links.push($(elem).find('.btn.sign').attr('href'));
        });
        console.log(links);
        return links;
    }
    async parseAllLatestDetails(listOfItems) {
        console.log('Wbm');
        for (let i = 0; i < listOfItems.length; i++) {
            await sleep(2000);
            console.log({
                price: listOfItems[i].rent,
                rooms: listOfItems[i].rooms,
                area: listOfItems[i].area,
                address: listOfItems[i].title,
                wbs: listOfItems[i].wbs,
            });
        }
    }
}
