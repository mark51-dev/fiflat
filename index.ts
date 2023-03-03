import { Gewobag } from './core/gewobag.js';
import { Degewo } from './core/degewo.js';
import { Howoge } from './core/howoge.js';
import { Wbm } from './core/wbm.js';
import { Gesobau } from './core/gesobau.js';

async function run() {
	const websites = ['Degewo', 'Howoge', 'Gewobag', 'Wbm', 'Gesobau'];

	for (let i = 0; i < websites.length; i++) {
		if ('Degewo' === websites[i]) {
			await new Degewo().execute();
		}
		if ('Howoge' === websites[i]) {
			await new Howoge().execute();
		}
		if ('Gewobag' === websites[i]) {
			await new Gewobag().execute();
		}
		if ('Wbm' === websites[i]) {
			await new Wbm().execute();
		}
		if ('Gesobau' === websites[i]) {
			await new Gesobau().execute();
		}
	}
}

run();
