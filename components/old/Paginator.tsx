import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

export default function Paginator(props: any) {
	const { page, totalPages } = props;
	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				position: "absolute",
				bottom: 12,
				width: "100%",
			}}
		></View>
	);
}
