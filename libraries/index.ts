import uuid from "react-native-uuid";

type Categories =
	| "Grocery"
	| "Clothing"
	| "Health"
	| "Personal Care"
	| "Education"
	| "Housing"
	| "Insurance"
	| "Utilities"
	| "Transportation"
	| "Miscellaneous"
	| "Food"
	| "Hobby"
	| "Gift"
	| "Investment"
	| "Saving"
	| "Entertainment"
	| "Salary"
	| "Other"
	| "Debt"
	| "Tax"
	| "Loan";

interface Transaction {
	id: string;
	name: string;
	desc: string;
	amount: number;
	type: "income" | "expense";
	category: Categories;
	date: Date;
}

const createTransaction = (
	id: string | null = null,
	name: string,
	desc: string,
	amount: number,
	type: "income" | "expense",
	category: Categories,
	date: Date
): Transaction => ({
	id: id || uuid.v4().toString(),
	name,
	desc,
	amount: Math.abs(amount) * (type === "income" ? 1 : -1),
	type,
	category,
	date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
});

const filterTransactions = (
	transactions: Transaction[],
	{
		text = null,
		category = null,
		amountMin = 0,
		amountMax = Number.MAX_SAFE_INTEGER,
		type = null,
		startDate = null,
		endDate = null,
	}: {
		text?: string | null;
		category?: Categories | "All" | null;
		amountMin?: number;
		amountMax?: number;
		type?: string | null;
		startDate?: Date | null;
		endDate?: Date | null;
	}
): Transaction[] => {
	return transactions.filter((transaction: Transaction) => {
		const convertedDate = new Date(transaction.date);
		const startDateMatch = !startDate || convertedDate >= startDate;
		const endDateMatch = !endDate || convertedDate <= endDate;
		const textMatch =
			!text || transaction.name.toLowerCase().includes(text.toLowerCase());
		const categoryMatch =
			!category || category == "All" || transaction.category == category;
		const amountMatch =
			amountMin <= Math.abs(transaction.amount) &&
			(!amountMax || Math.abs(transaction.amount) <= Math.abs(amountMax));
		const typeMatch = !type || transaction.type === type;
		return (
			startDateMatch &&
			endDateMatch &&
			textMatch &&
			categoryMatch &&
			amountMatch &&
			typeMatch
		);
	});
};

const sortTransactions = (
	transactions: Transaction[],
	{
		sortBy = "date",
		order = "asc",
	}: {
		sortBy?: "date" | "amount" | "category" | "name";
		order?: "asc" | "desc";
	}
): Transaction[] => {
	return transactions.sort((a: Transaction, b: Transaction) => {
		const mult = order === "asc" ? 1 : -1;
		if (sortBy === "date") {
			return mult * (a.date > b.date ? 1 : -1);
		} else if (sortBy === "amount") {
			return mult * (a.amount > b.amount ? 1 : -1);
		} else if (sortBy === "category") {
			return mult * (a.category > b.category ? 1 : -1);
		} else {
			return mult * (a.name > b.name ? 1 : -1);
		}
	});
};

const getTotalAmount = (transactions: Transaction[]): number => {
	return transactions.reduce((acc, transaction) => {
		return acc + transaction.amount;
	}, 0);
};

const getCategories = (transactions: Transaction[]): Categories[] => {
	return transactions.reduce((acc, transaction) => {
		if (!acc.includes(transaction.category)) {
			acc.push(transaction.category);
		}
		return acc;
	}, [] as Categories[]);
};

const formatMoney = (amount: number, currency: string = "EUR"): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
	}).format(amount);
};

const formatDate = (
	date: Date,
	dateStyle: "full" | "long" | "medium" | "short" | undefined = "long"
): string => {
	return new Intl.DateTimeFormat("en-US", {
		dateStyle: dateStyle,
	}).format(date);
};

const group = (arr: Array<any>, key: string) => {
	return [
		...arr
			.reduce(
				(acc, o) => acc.set(o[key], (acc.get(o[key]) || []).concat(o)),
				new Map()
			)
			.values(),
	];
};

const getMonthRange = (
	month: number = new Date().getMonth(),
	year: number = new Date().getFullYear()
) => {
	return {
		startDate: new Date(year, month),
		endDate: new Date(year, month + 1, 0),
	};
};

const generateRandomColor = (seed: string = Math.random().toString()) => {
	let acc = 0;
	for (let i = 0; i < seed.length; i++) {
		acc += seed.charCodeAt(i);
	}
	const letters = "0123456789ABCDEF";
	let color =
		letters[Math.floor(acc % 16)] +
		letters[Math.floor((acc * seed.length + acc) % 16)];
	color = "#" + color + color + color;
	return color;
};

const transactions: Transaction[] = [
	{
		id: "1",
		name: "Salary",
		desc: "My salary from my job",
		amount: 10000,
		type: "income",
		category: "Salary",
		date: new Date(2022, 0, 1),
	},
	{
		id: "2",
		name: "Edeka",
		desc: "",
		amount: -100,
		type: "expense",
		category: "Grocery",
		date: new Date(2022, 0, 2),
	},
	{
		id: "3",
		name: "H&M",
		desc: "",
		amount: -200,
		type: "expense",
		category: "Clothing",
		date: new Date(2022, 0, 3),
	},
	{
		id: "4",
		name: "Checkup",
		desc: "",
		amount: -300,
		type: "expense",
		category: "Health",
		date: new Date(2022, 0, 4),
	},
	{
		id: "5",
		name: "Skincare",
		desc: "",
		amount: -400,
		type: "expense",
		category: "Personal Care",
		date: new Date(2022, 0, 5),
	},
	{
		id: "6",
		name: "Semesterbeitrag",
		desc: "",
		amount: -500,
		type: "expense",
		category: "Education",
		date: new Date(2022, 0, 6),
	},
	{
		id: "7",
		name: "Wohnung",
		desc: "",
		amount: -600,
		type: "expense",
		category: "Housing",
		date: new Date(2022, 0, 7),
	},
	{
		id: "8",
		name: "TK",
		desc: "",
		amount: -700,
		type: "expense",
		category: "Insurance",
		date: new Date(2022, 0, 8),
	},
	{
		id: "9",
		name: "Fraenk",
		desc: "",
		amount: -800,
		type: "expense",
		category: "Utilities",
		date: new Date(2022, 0, 9),
	},
	{
		id: "10",
		name: "Semesterticket",
		desc: "",
		amount: -900,
		type: "expense",
		category: "Transportation",
		date: new Date(2022, 0, 10),
	},
	{
		id: "11",
		name: "Miscellaneous",
		desc: "",
		amount: -1000,
		type: "expense",
		category: "Miscellaneous",
		date: new Date(2022, 0, 11),
	},
	{
		id: "12",
		name: "Sushi Nami",
		desc: "uber eats",
		amount: -1100,
		type: "expense",
		category: "Food",
		date: new Date(2022, 0, 12),
	},
	{
		id: "13",
		name: "Steam",
		desc: "beli skin dota",
		amount: -1200,
		type: "expense",
		category: "Hobby",
		date: new Date(2022, 0, 13),
	},
	{
		id: "14",
		name: "Birthday cake",
		desc: "kue ultah ibu",
		amount: -1300,
		type: "expense",
		category: "Gift",
		date: new Date(2022, 0, 14),
	},
	{
		id: "15",
		name: "Crypto",
		desc: "btc & bnb",
		amount: -1400,
		type: "expense",
		category: "Investment",
		date: new Date(2022, 0, 15),
	},
	{
		id: "16",
		name: "Deposit",
		desc: "deposit jenius",
		amount: -1500,
		type: "expense",
		category: "Saving",
		date: new Date(2022, 0, 16),
	},
	{
		id: "17",
		name: "Cinema",
		desc: "nonton bareng ghina",
		amount: -1600,
		type: "expense",
		category: "Entertainment",
		date: new Date(2022, 0, 17),
	},
];

const example_transactions: Transaction[] = [
	...transactions,
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

export {
	Categories,
	Transaction,
	createTransaction,
	filterTransactions,
	sortTransactions,
	getTotalAmount,
	getCategories,
	formatMoney,
	formatDate,
	group,
	getMonthRange,
	generateRandomColor,
	example_transactions,
};
