import { gotScraping as got } from 'got-scraping';
import { load } from 'cheerio';

import { IParse } from '../interfaces/parse.interface.js';
import { IExecute } from '../interfaces/execute.interface.js';
import { sleep } from '../utils/utils.js';

export class Gewobag implements IParse, IExecute {
	async execute(): Promise<void> {
		const allItems = await this.parseAllLatest();
		await this.parseAllLatestDetails(allItems);
	}

	async parseAllLatest(): Promise<any[]> {
		console.log('Gewobag');
		const res = await got
			.get(
				'https://www.gewobag.de/fuer-mieter-und-mietinteressenten/mietangebote/'
			)
			.text();
		let $ = load(res);
		const links: any[] = [];

		$('.overview-small-layout').each(function (i, elem) {
			links.push($(elem).find('a').attr('href'));
		});
		console.log(links);
		return links;
	}
	async parseAllLatestDetails(listOfItems: any[]): Promise<any> {
		for (let i = 0; i < listOfItems.length; i++) {
			await sleep(1000);
			const res = await got
				.get({
					url: `${listOfItems[i]}`,
					headers: {
						'user-agent':
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
					},
				})
				.text();
			const $ = load(res);

			const price: string = $(
				'#rental-overview > div.overview-details > table.overview-table.details-price > tbody > tr.interest > td'
			)
				.text()
				.trim()
				.replaceAll('Euro', '')
				.replaceAll('\t', '');
			const rooms = $(
				'#rental-overview > div.overview-details > table.overview-table.details-general > tbody > tr:nth-child(5) > td'
			).text();

			const area = $(
				'#rental-overview > div.overview-details > table.overview-table.details-general > tbody > tr:nth-child(6) > td'
			)
				.text()
				.trim()
				.replaceAll('\t', '');

			const address = $(
				'#rental-overview > div.overview-details > table.overview-table.details-general > tbody > tr:nth-child(1) > td'
			).text();

			const wbs = $('div.post-header.wpi_immobilie-header > header > h1')
				.text()
				.toLowerCase()
				.split(' ')
				.includes('wbs');
			console.log(wbs);

			console.log({
				price: price,
				rooms: rooms,
				area: area,
				address: address,
				wbs: wbs ? 'Ja' : 'Nein',
			});
		}
	}
}
