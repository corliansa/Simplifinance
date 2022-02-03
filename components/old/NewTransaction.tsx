import { useState } from "react";
import Dialog from "react-native-dialog";
import { TouchableOpacity, View, Text } from "react-native";
import FloatingButton from "../FloatingButton";
import {
	MaskedInput,
	DateTimePicker,
	RadioGroup,
	RadioButton,
	Picker,
} from "react-native-ui-lib";
import { formatMoney } from "../../libraries";

export default function NewTransaction({ navigation }: any) {
	const [visible, setVisible] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const [desc, setDesc] = useState<string>("");
	const [amount, setAmount] = useState<string>("");
	const [type, setType] = useState<"expense" | "income">("expense");
	const [category, setCategory] = useState<string>("Grocery");
	const [date, setDate] = useState<Date>(new Date());

	const onSave = () => {
		setVisible(false);
	};

	const onCancel = () => {
		setVisible(false);
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
		return <Dialog.Input label="Amount" value={amount} />;
	};

	return (
		<>
			<FloatingButton icon="add" onPress={() => setVisible(true)} />
			<Dialog.Container visible={visible}>
				<Dialog.Title>Add Transaction</Dialog.Title>
				<Dialog.Input
					label="Name"
					value={name}
					onChangeText={(value) => setName(value)}
				/>
				<MaskedInput
					renderMaskedText={renderPrice}
					keyboardType={"numeric"}
					onChangeText={(value) => {
						setAmount(value);
					}}
				/>
				<Dialog.Input
					label="Description"
					value={desc}
					onChangeText={(value) => setDesc(value)}
				/>
				<RadioGroup
					initialValue={type}
					onValueChange={(value: "expense" | "income") => setType(value)}
					style={{
						flexDirection: "row",
						marginHorizontal: 20,
						justifyContent: "space-evenly",
						marginBottom: 20,
					}}
				>
					<RadioButton value="expense" label="Expense" />
					<RadioButton value="income" label="Income" />
				</RadioGroup>
				<Picker
					title="Category"
					placeholder="Grocery"
					value={category}
					onChange={(value: string) => setCategory(value)}
					containerStyle={{ marginHorizontal: 20 }}
					showSearch={true}
				>
					{options.map((option) => (
						<Picker.Item
							key={option.value}
							value={option.value}
							label={option.label}
							isSelected={category === option.value}
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
				/>
				<Dialog.Button label="Cancel" onPress={onCancel} />
				<Dialog.Button label="Save" onPress={onSave} />
			</Dialog.Container>
		</>
	);
}
