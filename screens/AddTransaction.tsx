import { useState } from "react";
import Dialog from "react-native-dialog";
import {
	TouchableOpacity,
	View,
	Text,
	StyleSheet,
	Alert,
	Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	MaskedInput,
	DateTimePicker,
	RadioGroup,
	RadioButton,
	Picker,
	Button,
	Incubator,
} from "react-native-ui-lib";
const { TextField } = Incubator;
import { createTransaction, Categories, Transaction } from "../libraries";

export default function AddTransaction({ navigation, route }: any) {
	const txPayload = route?.params?.txPayload;
	const [name, setName] = useState<string>(txPayload?.name || "");
	const [desc, setDesc] = useState<string>(txPayload?.desc || "");
	const [amount, setAmount] = useState<string>(
		txPayload?.amount
			? Math.abs(txPayload?.amount)?.toString()?.replace(".", ",")
			: ""
	);
	const [type, setType] = useState<"expense" | "income">(
		txPayload?.type || "expense"
	);
	const [category, setCategory] = useState<Categories>(
		txPayload?.category || "Grocery"
	);
	const [date, setDate] = useState<Date>(
		txPayload?.date ? new Date(txPayload?.date) : new Date()
	);

	const checkValid = () => {
		if (name.length === 0) return false;
		if (amount.length === 0) return false;
		if (isNaN(realAmount) || realAmount < 0) return false;
		if (type !== "expense" && type !== "income") return false;
		if (category.length === 0) return false;
		if (date === null) return false;
		return true;
	};

	const onSave = async () => {
		if (!checkValid()) {
			Alert.alert("Error", "Please fill in all the required fields!");
			return;
		}
		const newTx: Transaction = createTransaction(
			null,
			name,
			desc,
			realAmount,
			type,
			category,
			date
		);
		const tx = await AsyncStorage.getItem("transactions");
		if (tx) {
			const transactions = JSON.parse(tx);
			if (txPayload) {
				transactions[
					transactions.findIndex((tx: Transaction) => tx.id === txPayload.id)
				] = newTx;
			} else {
				transactions.push(newTx);
			}
			await AsyncStorage.setItem("transactions", JSON.stringify(transactions));
		} else {
			await AsyncStorage.setItem("transactions", JSON.stringify([newTx]));
		}
		navigation.goBack();
	};

	const onCancel = () => {
		navigation.goBack();
	};

	const options = [
		{ label: "Grocery", value: "Grocery" },
		{ label: "Clothing", value: "Clothing" },
		{ label: "Health", value: "Health" },
		{ label: "Personal Care", value: "Personal Care" },
		{ label: "Education", value: "Education" },
		{ label: "Housing", value: "Housing" },
		{ label: "Insurance", value: "Insurance" },
		{ label: "Utilities", value: "Utilities" },
		{ label: "Transportation", value: "Transportation" },
		{ label: "Miscellaneous", value: "Miscellaneous" },
		{ label: "Food", value: "Food" },
		{ label: "Hobby", value: "Hobby" },
		{ label: "Gift", value: "Gift" },
		{ label: "Investment", value: "Investment" },
		{ label: "Saving", value: "Saving" },
		{ label: "Entertainment", value: "Entertainment" },
		{ label: "Salary", value: "Salary" },
		{ label: "Other", value: "Other" },
		{ label: "Debt", value: "Debt" },
		{ label: "Tax", value: "Tax" },
		{ label: "Loan", value: "Loan" },
	];

	const realAmount = parseFloat(amount.replace(",", "."));

	const renderPrice = () => {
		return (
			<TextField
				label="Amount*"
				value={amount}
				placeholder="0.00"
				containerStyle={styles.textfield}
				style={{ color: "lightgrey" }}
				labelColor="grey"
			/>
		);
	};

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.main}>
				<Text
					style={{
						textAlign: "center",
						fontSize: 24,
						fontWeight: "400",
						marginBottom: 20,
						color: "lightgrey",
					}}
					onPress={() => Keyboard.dismiss()}
				>
					{txPayload ? "Edit" : "Add"} Transaction
				</Text>
				<TextField
					label="Name*"
					value={name}
					placeholder="New Transaction"
					onChangeText={(value) => setName(value)}
					containerStyle={styles.textfield}
					style={{ color: "lightgrey" }}
					labelColor="grey"
				/>
				<MaskedInput
					renderMaskedText={renderPrice}
					keyboardType={"numeric"}
					value={amount}
					onChangeText={(value) => {
						setAmount(value);
					}}
				/>
				<TextField
					label="Description"
					value={desc}
					placeholder="Some description..."
					onChangeText={(value) => setDesc(value)}
					containerStyle={styles.textfield}
					style={{ color: "lightgrey" }}
					labelColor="grey"
				/>
				<RadioGroup
					initialValue={type}
					onValueChange={(value: "expense" | "income") => setType(value)}
					style={{
						flexDirection: "row",
						marginHorizontal: 20,
						justifyContent: "space-evenly",
						marginBottom: 20,
						marginTop: 5,
					}}
				>
					<RadioButton
						color="lightgrey"
						labelStyle={{ color: "lightgrey" }}
						value="expense"
						label="Expense"
					/>
					<RadioButton
						color="lightgrey"
						labelStyle={{ color: "lightgrey" }}
						value="income"
						label="Income"
					/>
				</RadioGroup>
				<Picker
					title="Category"
					placeholder="Grocery"
					value={category}
					onChange={(value: any) => setCategory(value.value)}
					containerStyle={{ marginHorizontal: 20 }}
					searchStyle={{
						color: "lightgrey",
					}}
					showSearch={true}
					topBarProps={{
						title: "Category",
						useSafeArea: true,
						titleStyle: { color: "lightgrey" },
					}}
					pickerModalProps={{ overlayBackgroundColor: "#111" }}
					style={{ color: "lightgrey" }}
				>
					{options.map((option) => (
						<Picker.Item
							key={option.value}
							value={option.value}
							label={option.label}
							labelStyle={{ color: "grey" }}
							// @ts-ignore
							selectedIconColor="lightgrey"
						/>
					))}
				</Picker>
				<DateTimePicker
					// @ts-ignore
					containerStyle={{ marginHorizontal: 20 }}
					title={"Date"}
					placeholder={"Select a date"}
					dateFormat={"MMM D, YYYY"}
					onChange={(value) => setDate(value)}
					value={date}
					themeVariant="light"
					style={{ color: "lightgrey" }}
				/>
				<View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
					<Button backgroundColor="#333" label="Cancel" onPress={onCancel} />
					<Button backgroundColor="#333" label="Save" onPress={onSave} />
				</View>
			</SafeAreaView>
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
	textfield: {
		marginHorizontal: 20,
		marginBottom: 20,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderColor: "lightgrey",
	},
});
