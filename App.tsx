import "intl";
import "intl/locale-data/jsonp/en";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import Home from "./screens/Home";
import Transactions from "./screens/Transactions";
import Overview from "./screens/Overview";
import AddTransaction from "./screens/AddTransaction";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarStyle: { height: 0 },
			}}
		>
			<Tab.Screen name="Home" component={Home} />
			<Tab.Screen name="Transactions" component={Transactions} />
			<Tab.Screen name="Overview" component={Overview} />
		</Tab.Navigator>
	);
};

const RootStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Root" component={TabNavigator} />
			<Stack.Group screenOptions={{ presentation: "modal" }}>
				<Stack.Screen name="AddTransaction" component={AddTransaction} />
			</Stack.Group>
		</Stack.Navigator>
	);
};

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<RootStack />
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
