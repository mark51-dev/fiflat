import { load } from 'cheerio';
import Nightmare from 'nightmare';

import { IParse } from '../interfaces/parse.interface.js';
import { IExecute } from '../interfaces/execute.interface.js';

export class Gesobau implements IParse, IExecute {
	async execute(): Promise<void> {
		const allItems = await this.parseAllLatest();
		await this.parseAllLatestDetails(allItems);
	}

	async parseAllLatest(): Promise<any[]> {
		console.log('Gesobau');
		const res: any = await new Nightmare({
			waitTimeout: 3000,
			show: false,
		})
			.goto('https://www.gesobau.de/mieten/wohnungssuche.html')
			.evaluate(() => {
				return document.body.innerHTML;
			})
			.end()
			.then((res) => {
				return res;
			});

		let $ = load(res);
		const links: any[] = [];

		$('#tx-openimmo-6329 .list_item-body').each(function (i, elem) {
			links.push($(elem).find('a').attr('href'));
		});
		console.log(links);
		return links;
	}
	async parseAllLatestDetails(listOfItems: any[]): Promise<any> {
		for (let i = 0; i < listOfItems.length; i++) {
			const res: any = await new Nightmare({
				waitTimeout: 3000,
				show: true,
			})
				.goto(`https://www.gesobau.de${listOfItems[i]}`)
				.evaluate(() => {
					return document.body.innerHTML;
				})
				.end()
				.then((res: any) => {
					const $ = load(res);

					const price: string = $(
						'#tx-openimmo-2 > div:nth-child(2) > div.bs4-row.flex-wrap > section:nth-child(2) > div > div > dl > div:nth-child(1) > dd > p'
					)
						.text()
						.replace('€', '')
						.trim();
					const rooms = $(
						'#tx-openimmo-2 > div:nth-child(2) > div.bs4-row.flex-wrap > section.kennzahlen.bs4-col-md-6.mb-5 > div > dl > div:nth-child(1) > dd > p'
					).text();

					const area = $(
						'#tx-openimmo-2 > div:nth-child(2) > div.bs4-row.flex-wrap > section.kennzahlen.bs4-col-md-6.mb-5 > div > dl > div:nth-child(2) > dd > p'
					).text();

					const address = $(
						'#tx-openimmo-2 > div:nth-child(2) > div.facts_summary.mb-5.text-meta > p.location'
					).text();

					const wbs = $(
						'#tx-openimmo-2 > div:nth-child(2) > div.bs4-row.flex-wrap > section.kennzahlen.bs4-col-md-6.mb-5 > div > dl > div:nth-child(3) > dd > p'
					).text();

					return {
						price,
						rooms,
						area,
						address,
						wbs,
					};
				});

			console.log(res);
		}
	}
}
