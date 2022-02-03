import {
	Transaction,
	filterTransactions,
	sortTransactions,
	getTotalAmount,
	example_transactions,
	getMonthRange,
} from "./index";

const filtered = filterTransactions(example_transactions, {
	text: "",
	category: "All",
	amountMin: 0,
	amountMax: 1000,
	type: "expense",
	startDate: new Date(2022, 0),
	endDate: new Date(2022, 1),
});

console.log(filtered);

const total = getTotalAmount(example_transactions);

console.log(total);

const sorted = sortTransactions(filtered, {
	sortBy: "name",
	order: "asc",
});

console.log(sorted);

console.log(getMonthRange());

describe("Transaction test", () => {
	it("should filter transactions", () => {
		expect(filtered).toHaveLength(10);
	});
	it("should get total amount", () => {
		expect(total).toEqual(-3600);
	});
});

export { example_transactions };
