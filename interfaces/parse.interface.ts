export interface IParse {
	parseAllLatest(): Promise<any[]>;
	parseAllLatestDetails(listOfItems: any[]): Promise<any>;
}
