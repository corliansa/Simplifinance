import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingButton from "../components/FloatingButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	filterTransactions,
	getCategories,
	getTotalAmount,
	formatMoney,
	Transaction,
} from "../libraries";

export default function Overview({ navigation }: any) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const categories = getCategories(transactions);
	const amounts = categories
		.map((category) => {
			return {
				name: category,
				amount: getTotalAmount(filterTransactions(transactions, { category })),
			};
		})
		.sort((a, b) => b.amount - a.amount);
	const income = filterTransactions(transactions, { type: "income" });
	const expense = filterTransactions(transactions, { type: "expense" });
	const incomeAmount = getTotalAmount(income);
	const expenseAmount = getTotalAmount(expense);

	const loadTransactionsAsync = async () => {
		try {
			const tx = await AsyncStorage.getItem("transactions");
			if (tx) {
				if (tx != JSON.stringify(transactions)) setTransactions(JSON.parse(tx));
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		loadTransactionsAsync();
		const focusListener: any = navigation.addListener("focus", () => {
			loadTransactionsAsync();
		});
		return focusListener;
	}, []);

	const renderItem = ({ item }: any) => {
		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					borderBottomColor: "lightgrey",
					borderBottomWidth:
						amounts[amounts.length - 1].name === item.name ? 0 : 1,
				}}
			>
				<Text style={{ fontSize: 18, fontWeight: "500", color: "white" }}>
					{item.name}
				</Text>
				<Text
					style={{
						fontSize: 16,
						fontWeight: "500",
						color: item.amount < 0 ? "lightcoral" : "lightblue",
					}}
				>
					{formatMoney(item.amount)}
				</Text>
			</View>
		);
	};

	const listFooterComponent = () => {
		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					marginTop: 10,
					borderTopColor: "white",
					borderTopWidth: 2,
				}}
			>
				<Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
					Total
				</Text>
				<Text
					style={{
						fontSize: 24,
						fontWeight: "bold",
						color:
							Math.abs(incomeAmount) - Math.abs(expenseAmount) < 0
								? "coral"
								: "lightblue",
					}}
				>
					{formatMoney(Math.abs(incomeAmount) - Math.abs(expenseAmount))}
				</Text>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.main}>
				<FlatList
					data={amounts}
					renderItem={renderItem}
					keyExtractor={(item) => item.name}
					ListFooterComponent={listFooterComponent}
				/>
				<View style={{ justifyContent: "flex-end" }}>
					<Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
						{`In total, you have spent ${formatMoney(
							Math.abs(expenseAmount)
						)} out of ${formatMoney(Math.abs(incomeAmount))} of your income.`}
					</Text>
					{Math.abs(incomeAmount) - Math.abs(expenseAmount) < 0 ? (
						<Text style={{ color: "coral" }}>
							Uh-oh. Looks like need to work on your money management more!
						</Text>
					) : null}
				</View>
			</SafeAreaView>
			<FloatingButton
				icon="ellipsis-vertical"
				onPress={() => navigation.navigate("Transactions")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#101010",
	},
	main: {
		flex: 1,
		margin: 20,
	},
});
