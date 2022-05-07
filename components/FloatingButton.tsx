import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FloatingButton(props: any) {
	return (
		<TouchableOpacity
			style={{
				position: "absolute",
				bottom: 20,
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
			onPress={props.onPress}
			testID={props.testID || "floatingButton"}
		>
			<Ionicons name={props.icon} size={32} color="#041C32" />
		</TouchableOpacity>
	);
}
