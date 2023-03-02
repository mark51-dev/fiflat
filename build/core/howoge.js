import { gotScraping as got } from 'got-scraping';
import { sleep } from '../utils/utils.js';
export class Howoge {
    async execute() {
        const allItems = await this.parseAllLatest();
        await this.parseAllLatestDetails(allItems);
    }
    async parseAllLatest() {
        const res = await got
            .get('https://www.howoge.de/?type=999&tx_howsite_json_list[action]=immoList')
            .json();
        return res.immoobjects;
    }
    async parseAllLatestDetails(listOfItems) {
        console.log('Howoge');
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
