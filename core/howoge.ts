import { gotScraping as got } from 'got-scraping';

import { IParse } from '../interfaces/parse.interface.js';
import { IExecute } from '../interfaces/execute.interface.js';
import { sleep } from '../utils/utils.js';

export class Howoge implements IParse, IExecute {
	async execute(): Promise<void> {
		const allItems = await this.parseAllLatest();
		await this.parseAllLatestDetails(allItems);
	}

	async parseAllLatest(): Promise<any[]> {
		const res: {
			badges: [];
			immoobjects: [];
		} = await got
			.get(
				'https://www.howoge.de/?type=999&tx_howsite_json_list[action]=immoList'
			)
			.json();
		return res.immoobjects;
	}
	async parseAllLatestDetails(listOfItems: any[]): Promise<any> {
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
