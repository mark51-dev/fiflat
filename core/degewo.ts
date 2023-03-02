import { gotScraping as got } from 'got-scraping';
import { load } from 'cheerio';

import { IParse } from '../interfaces/parse.interface.js';
import { IExecute } from '../interfaces/execute.interface.js';
import { sleep } from '../utils/utils.js';

export class Degewo implements IParse, IExecute {
	constructor() {}

	async execute() {
		const allItems = await this.parseAllLatest();
		await this.parseAllLatestDetails(allItems);
	}

	async parseAllLatest(): Promise<any[]> {
		const res = await got.get('https://immosuche.degewo.de').text();
		let $ = load(res);
		const links: any[] = [];
		$('.article-list__item.article-list__item--immosearch').each(function (
			i,
			elem
		) {
			links.push($(elem).find('a').attr('href'));
		});
		console.log(links);
		return links;
	}
	async parseAllLatestDetails(listOfItems: any[]): Promise<any> {
		console.log('Degewo');
		for (let i = 0; i < listOfItems.length; i++) {
			await sleep(1000);
			const res = await got
				.get({
					url: `https://immosuche.degewo.de${listOfItems[i]}`,
					headers: {
						'user-agent':
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
					},
				})
				.text();
			const $ = load(res);

			const price: string = $('.expose__price-tag')
				.text()
				.replaceAll('\n', '')
				.replace(/\s\W\w+/, '');
			const rooms = $(
				'#c1358 > div:nth-child(2) > section:nth-child(1) > div.teaser-tileset__col-1 > section > div > table > tbody > tr:nth-child(1) > td:nth-child(2)'
			).text();

			const area = $(
				'#c1358 > div:nth-child(2) > section:nth-child(1) > div.teaser-tileset__col-1 > section > div > table > tbody > tr:nth-child(2) > td:nth-child(2)'
			).text();

			const address = $(
				'#c1358 > article > div > div > header > span.expose__meta'
			).text();

			const wbs = $(
				'#c1358 > div:nth-child(2) > section:nth-child(1) > div.teaser-tileset__col-1 > section > div > table > tbody > tr:nth-child(7) > td:nth-child(2)'
			).text();

			console.log({
				price,
				rooms,
				area,
				address,
				wbs: wbs === 'Ja' ? 'Ja' : 'Nein',
			});
		}
	}
}
