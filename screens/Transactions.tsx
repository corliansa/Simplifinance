import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Dimensions,
	Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";
import Dialog from "react-native-dialog";
import { RadioGroup, RadioButton, Picker } from "react-native-ui-lib";
import {
	filterTransactions,
	sortTransactions,
	example_transactions,
	getTotalAmount,
	formatMoney,
	getCategories,
	formatDate,
	group,
	getMonthRange,
	generateRandomColor,
	Transaction,
} from "../libraries/";
import FloatingButton from "../components/FloatingButton";

export default function Transactions({ navigation }: any) {
	const [current, setCurrent] = useState<number>(0);
	const [detailed, setDetailed] = useState<boolean>(false);
	const [grouping, setGrouping] = useState<"category" | "date">("date");
	const [filter, setFilter] = useState({});
	const [sorting, setSorting] = useState({});
	const [showSorter, setShowSorter] = useState<boolean>(false);

	const { startDate, endDate } = getMonthRange(new Date().getMonth() + current);
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const currentTransactions = filterTransactions(transactions, {
		startDate,
		endDate,
	});
	const filteredTransactions = filterTransactions(currentTransactions, filter);
	const sortedTransactions = sortTransactions(filteredTransactions, sorting);
	const groupedTransactions = group(sortedTransactions, grouping);
	const sectionedTransactions = groupedTransactions.map((item: any) => {
		return {
			title:
				grouping === "date"
					? formatDate(new Date(item[0].date))
					: item[0].category,
			data: item,
		};
	});

	const income = filterTransactions(sortedTransactions, { type: "income" });
	const expense = filterTransactions(sortedTransactions, { type: "expense" });
	const incomeAmount = getTotalAmount(income);
	const expenseAmount = getTotalAmount(expense);

	const categories = getCategories(
		filterTransactions(sortedTransactions, { type: "expense" })
	);
	const amounts = categories.map((category) => {
		return {
			name: category,
			amount: Math.abs(
				getTotalAmount(filterTransactions(sortedTransactions, { category }))
			),
			color: generateRandomColor(category),
			legendFontColor: "#7F7F7F",
			legendFontSize: 14,
		};
	});

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

	const deleteTransactionAsync = async (id: string) => {
		try {
			const newTransactions = transactions.filter(
				(item: Transaction) => item.id !== id
			);
			setTransactions(newTransactions);
			await AsyncStorage.setItem(
				"transactions",
				JSON.stringify(newTransactions)
			);
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

	const RenderRightActions = (props: any) => {
		return (
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "row",
					marginVertical: 4,
				}}
			>
				<TouchableOpacity
					style={{
						justifyContent: "center",
						alignItems: "center",
						margin: 2,
						paddingHorizontal: 12,
						backgroundColor: "rgba(231, 231, 228,1)",
						borderRadius: 10,
						height: "100%",
						width: 70,
					}}
					onPress={() =>
						navigation.navigate("AddTransaction", { txPayload: props.tx })
					}
				>
					<Text style={{ color: "#333" }}>Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						justifyContent: "center",
						alignItems: "center",
						margin: 2,
						paddingHorizontal: 12,
						backgroundColor: "rgba(231, 231, 228,1)",
						borderRadius: 10,
						height: "100%",
						width: 70,
					}}
					onPress={() => deleteTransactionAsync(props.tx.id)}
				>
					<Text style={{ color: "#333" }}>Delete</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const renderItem = ({ item }: { item: Transaction }) => {
		return (
			<Swipeable
				rightThreshold={-200}
				renderRightActions={() => <RenderRightActions tx={item} />}
			>
				<TouchableOpacity>
					<View
						style={{
							flexDirection: "row",
							margin: 2,
							padding: 8,
							backgroundColor: "rgba(24, 24, 27,1)",
							borderRadius: 10,
							alignItems: "center",
						}}
					>
						<View
							style={{
								backgroundColor: "#000",
								padding: 2,
								alignSelf: "flex-start",
								borderRadius: 4,
								marginRight: 8,
							}}
						>
							<Text style={{ color: "grey" }}>
								{grouping == "date"
									? item.category
									: formatDate(new Date(item.date), "short")}
							</Text>
						</View>
						<View style={{ flex: 1 }}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Text
									style={{ fontSize: 16, fontWeight: "500", color: "white" }}
								>
									{item.name}
								</Text>
								<Text
									style={{
										color: item.amount < 0 ? "lightcoral" : "lightblue",
										fontSize: 16,
									}}
								>
									{formatMoney(item.amount)}
								</Text>
							</View>
							{item.desc ? (
								<Text style={{ color: "grey" }}>{item.desc}</Text>
							) : null}
						</View>
					</View>
				</TouchableOpacity>
			</Swipeable>
		);
	};

	const renderSectionHeader = ({ section }: any) => {
		return (
			<View
				style={{
					padding: 4,
					borderRadius: 4,
				}}
			>
				<Text style={{ color: "#ECB365", fontWeight: "bold" }}>
					{section.title}
				</Text>
			</View>
		);
	};

	const listFooterComponent = () => {
		return (
			sortedTransactions.length > 0 && (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: 10,
						borderTopColor: "white",
						borderTopWidth: 2,
						marginHorizontal: 2,
						paddingTop: 4,
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
			)
		);
	};

	const listEmptyComponent = () => {
		return (
			<View
				style={{
					flexDirection: "row",
					margin: 2,
					padding: 8,
					backgroundColor: "rgba(24, 24, 27,1)",
					borderRadius: 10,
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ color: "white", fontSize: 18 }}>
					No transactions found
				</Text>
			</View>
		);
	};

	const SorterButton = () => {
		return (
			<TouchableOpacity
				style={{
					position: "absolute",
					bottom: 80,
					right: 20,
					backgroundColor: "#fff",
					borderRadius: 50,
					width: 50,
					height: 50,
					alignItems: "center",
					justifyContent: "center",
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
				}}
				onPress={() => setShowSorter(!showSorter)}
			>
				<Ionicons name="ellipsis-vertical" size={32} color="#041C32" />
			</TouchableOpacity>
		);
	};

	const SorterModal = () => {
		const [sortBy, setSortBy] = useState<
			"date" | "amount" | "name" | "category"
		>("date");
		const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
		return (
			<Dialog.Container
				visible={showSorter}
				onBackdropPress={() => setShowSorter(false)}
			>
				<Dialog.Title>Preferences</Dialog.Title>
				<RadioGroup
					initialValue={sortOrder}
					onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
					style={{
						flexDirection: "row",
						marginHorizontal: 20,
						justifyContent: "space-evenly",
						marginBottom: 20,
					}}
				>
					<Text style={{ alignSelf: "center" }}>Order by</Text>
					<RadioButton color="grey" value="asc" label="Asc" />
					<RadioButton color="grey" value="desc" label="Desc" />
				</RadioGroup>
				<Dialog.Button label="Cancel" onPress={() => setShowSorter(false)} />
				<Dialog.Button label="Apply" onPress={() => setShowSorter(false)} />
			</Dialog.Container>
		);
	};

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.main}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						width: Dimensions.get("window").width - 40,
					}}
				>
					<TouchableOpacity onPress={() => setCurrent(current - 1)}>
						<Ionicons name="chevron-back" size={32} color="white" />
					</TouchableOpacity>
					<Text style={{ color: "white", fontSize: 28, fontWeight: "400" }}>
						{new Date(startDate).toLocaleString("en", { month: "long" })}{" "}
						{new Date(startDate).getFullYear()}
					</Text>
					<TouchableOpacity onPress={() => setCurrent(current + 1)}>
						<Ionicons name="chevron-forward" size={32} color="white" />
					</TouchableOpacity>
				</View>
				<View style={{ marginTop: 10 }}>
					{amounts.length > 0 && (
						<Pressable onPress={() => setDetailed(!detailed)}>
							<PieChart
								data={amounts}
								width={Dimensions.get("window").width - 40}
								height={Dimensions.get("window").height / 4}
								chartConfig={{
									backgroundGradientFrom: "#1E2923",
									backgroundGradientFromOpacity: 0,
									backgroundGradientTo: "#08130D",
									backgroundGradientToOpacity: 0.5,
									color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
									strokeWidth: 4, // optional, default 3
									barPercentage: 1,
									useShadowColorFromDataset: false, // optional
								}}
								accessor={"amount"}
								backgroundColor={"transparent"}
								paddingLeft={"15"}
								absolute={detailed}
								avoidFalseZero={true}
							/>
						</Pressable>
					)}
					<SectionList
						sections={sectionedTransactions}
						renderItem={renderItem}
						keyExtractor={(item): any => item.id}
						renderSectionHeader={renderSectionHeader}
						ListEmptyComponent={listEmptyComponent}
						// @ts-ignore
						ListFooterComponent={listFooterComponent}
						style={{
							height: "100%",
						}}
						showsVerticalScrollIndicator={false}
					/>
				</View>
			</SafeAreaView>
			<SorterModal />
			<SorterButton />
			<FloatingButton
				icon="add"
				onPress={() => navigation.navigate("AddTransaction")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#101010",
		alignItems: "center",
	},
	main: {
		flex: 1,
		margin: 20,
	},
});
