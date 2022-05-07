import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingButton from "../components/FloatingButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
	filterTransactions,
	getTotalAmount,
	getMonthRange,
	formatMoney,
	Transaction,
} from "../libraries/";

export default function Home({ navigation }: any) {
	const { startDate, endDate } = getMonthRange();
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const income = filterTransactions(transactions, { type: "income" });
	const expense = filterTransactions(transactions, { type: "expense" });
	const incomeAmount = getTotalAmount(income);
	const expenseAmount = getTotalAmount(expense);

	const loadTransactionsAsync = async () => {
		try {
			const tx = await AsyncStorage.getItem("transactions");
			if (tx) {
				if (tx != JSON.stringify(transactions))
					setTransactions(
						filterTransactions(JSON.parse(tx), {
							startDate,
							endDate,
						})
					);
				else setTransactions([]);
			} else {
				setTransactions([]);
			}
		} catch (error) {
			setTransactions([]);
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

	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<SafeAreaView style={styles.main}>
				<Text
					style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
					testID="homeText"
				>
					{`Hello there,\nYou have spent ${formatMoney(
						Math.abs(expenseAmount)
					)} out of ${formatMoney(
						Math.abs(incomeAmount)
					)} this month.\nHave a nice day!`}
				</Text>
				{Math.abs(incomeAmount) - Math.abs(expenseAmount) < 0 ? (
					<Text style={{ color: "coral" }} testID="homeExtraText">
						Uh-oh. Looks like you spend more than your income this month!
					</Text>
				) : null}
			</SafeAreaView>
			<FloatingButton
				icon="chevron-forward"
				onPress={() => navigation.navigate("Transactions")}
				testID="homeButton"
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
		justifyContent: "center",
	},
});
