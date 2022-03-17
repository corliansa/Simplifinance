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
			(!amountMin || amountMin <= Math.abs(transaction.amount)) &&
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
};
