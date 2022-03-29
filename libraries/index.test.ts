import {
	Transaction,
	createTransaction,
	filterTransactions,
	sortTransactions,
	getTotalAmount,
	getMonthRange,
} from "./index";

const example_transactions: Transaction[] = [
	createTransaction(
		"",
		"Salary",
		"Kiriman ibu",
		800,
		"income",
		"Salary",
		new Date(2022, 1, 1)
	),
	createTransaction(
		"",
		"Wohnung",
		"bayar südkreuz",
		-460,
		"expense",
		"Housing",
		new Date(2022, 1, 2)
	),
	createTransaction(
		"",
		"Edeka",
		"belanja",
		-20,
		"expense",
		"Grocery",
		new Date(2022, 1, 2)
	),
	createTransaction(
		"",
		"Flink",
		"belanja",
		-15,
		"expense",
		"Grocery",
		new Date(2022, 1, 6)
	),
	createTransaction(
		"",
		"Edeka",
		"belanja",
		-23,
		"expense",
		"Grocery",
		new Date(2022, 1, 11)
	),
	createTransaction(
		"",
		"Mouse",
		"",
		-70,
		"expense",
		"Hobby",
		new Date(2022, 1, 14)
	),
	createTransaction(
		"",
		"TK",
		"asuransi",
		-110,
		"expense",
		"Insurance",
		new Date(2022, 1, 15)
	),
	createTransaction(
		"",
		"Edeka",
		"belanja",
		-21,
		"expense",
		"Grocery",
		new Date(2022, 1, 17)
	),
];

describe("Transaction test", () => {
	it("should filter transactions", () => {
		const filtered = filterTransactions(example_transactions, {
			text: "",
			category: "All",
			amountMin: 100,
			amountMax: 1000,
			type: "expense",
			startDate: new Date(2022, 1),
			endDate: new Date(2022, 2),
		});
		expect(filtered).toHaveLength(2);
	});
	it("should get total amount", () => {
		const total = getTotalAmount(example_transactions);
		expect(total).toEqual(81);
	});
	it("should get filtered transactions", () => {
		const filtered = filterTransactions(example_transactions, {
			text: "",
			category: "All",
			amountMin: 100,
			amountMax: 1000,
			type: "expense",
			startDate: new Date(2022, 1),
			endDate: new Date(2022, 2),
		});
		expect(getTotalAmount(filtered)).toBe(-570);
	});
	it("should sort transactions", () => {
		const sorted = sortTransactions(example_transactions, {
			sortBy: "amount",
			order: "desc",
		});
		expect(sorted[0].amount).toBe(800);
	});
});

export { example_transactions };
