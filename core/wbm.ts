import { gotScraping as got } from 'got-scraping';
import { load } from 'cheerio';

import { IParse } from '../interfaces/parse.interface.js';
import { IExecute } from '../interfaces/execute.interface.js';
import { sleep } from '../utils/utils.js';

export class Wbm implements IParse, IExecute {
	async execute(): Promise<void> {
		const allItems = await this.parseAllLatest();
		await this.parseAllLatestDetails(allItems);
	}

	async parseAllLatest(): Promise<any[]> {
		console.log('Wbm');
		const res = await got
			.get('https://www.wbm.de/wohnungen-berlin/angebote-wbm/')
			.text();
		let $ = load(res);
		const links: any[] = [];
		$('.openimmo-search-list-item').each(function (i, elem) {
			links.push($(elem).find('.btn.sign').attr('href'));
		});

		console.log(links);
		return links;
	}

	async parseAllLatestDetails(listOfItems: any[]): Promise<any> {
		for (let i = 0; i < listOfItems.length; i++) {
			await sleep(1000);
			const res = await got
				.get({
					url: `https://www.wbm.de${listOfItems[i]}`,
					headers: {
						'user-agent':
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
					},
				})
				.text();
			const $ = load(res);

			const price: string = $(
				'#description > div.textWrap > ul:nth-child(5) > li:nth-child(3) > span.value.big-1'
			)
				.text()
				.replace('EUR', '')
				.trim();
			const rooms = $(
				'#description > div.textWrap > ul:nth-child(9) > li:nth-child(1)'
			)
				.text()
				.replaceAll('\t', '')
				.replaceAll('\n', '')
				.replace('Anzahl der Zimmer: ', '');

			const area = $(
				'#description > div.textWrap > ul:nth-child(9) > li:nth-child(2)'
			)
				.text()
				.replaceAll('\t', '')
				.replaceAll('\n', '')
				.replace('Größe: ca. ', '');

			const address = $('#description > div.textWrap > p.address.big-1').text();

			const wbs = $('.check-property-list li').text().indexOf('WBS');

			console.log({
				price,
				rooms,
				area,
				address,
				wbs: wbs != 1 ? true : false,
			});
		}
	}
}
