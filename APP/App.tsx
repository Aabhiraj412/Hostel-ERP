import React, { useEffect } from "react";
import Constants from "expo-constants";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "./Components/Landing";
import WardenLogin from "./Components/Warden/WardenLogin";
import Warden from "./Components/Warden/Warden";
import useStore from "./Store/Store";
import HostlerLogin from "./Components/Hostler/HostlerLogin";
import Hostler from "./Components/Hostler/Hostler";
import WardenDash from "./Components/Warden/WardenDash";
import AddHostler from "./Components/Warden/AddHostler";
import Hostlers from "./Components/Warden/Hostlers";
import Leaves from "./Components/Warden/Leaves";
import ViewAttendance from "./Components/Warden/ViewAttendance";
import MessMenu from "./Components/Warden/MessMenu";
import Notices from "./Components/Warden/Notices";
import PublishNotice from "./Components/Warden/PublishNotice";
import PublicGrivances from "./Components/Warden/PublicGrivances";
import HostlerDetails from "./Components/Warden/HostlerDetails";
import SplashScreen from "./Components/Components/SplashScreen";
import OutRegister from "./Components/Warden/OutRegister";
import PrivateGrivance from "./Components/Warden/PrivateGrivance";
import HostlerDash from "./Components/Hostler/HostlerDash";

const Stack = createStackNavigator();

const App: React.FC = () => {
	const { cookie, user, setLocalhost } = useStore();

	useEffect(() => {
		// Safely extract localhost
		const hostUri = Constants.manifest2?.extra?.expoClient?.hostUri;
		if (hostUri) {
			const localhost = hostUri.split(":")[0];
			setLocalhost(localhost); // Update the localhost in your store
		} else {
			console.warn("Host URI not found in Constants.");
		}
	}, [setLocalhost]); // Run effect when `setLocalhost` changes (unlikely)

	// Navigation stack
	return (
		<NavigationContainer>
			<Stack.Navigator
				id={undefined}
				initialRouteName="Hostler ERP"
				screenOptions={{
					headerStyle: {
						backgroundColor: "#2cb5a0", // Set the background color of the nav bar
					},
					headerTintColor: "#fff", // Set the color of the title and back button
					headerTitleStyle: {
						fontWeight: "bold", // Optionally customize the font style of the title
					},
				}}
			>
				<Stack.Screen name="Hostler ERP" component={SplashScreen} />
				<Stack.Screen name="Home" component={Landing} />

				<Stack.Screen name="Warden Login" component={WardenLogin} />
				<Stack.Screen name="Warden" component={Warden} />
				<Stack.Screen name="Warden Dashboard" component={WardenDash} />

				<Stack.Screen name="Add Hostler" component={AddHostler} />
				<Stack.Screen name="Hostlers" component={Hostlers} />
				<Stack.Screen
					name="Hostlers Attendance"
					component={ViewAttendance}
				/>
				<Stack.Screen name="Publish Notice" component={PublishNotice} />
				<Stack.Screen name="Leaves" component={Leaves} />
				<Stack.Screen name="Public Grievances" component={PublicGrivances} />
				<Stack.Screen name="Private Grievances" component={PrivateGrivance} />
				<Stack.Screen name="Mess Menu" component={MessMenu} />
				<Stack.Screen name="Notices" component={Notices} />
				<Stack.Screen name="Out Register" component={OutRegister} />
				<Stack.Screen
					name="Hostler Details"
					component={HostlerDetails}
				/>

				<Stack.Screen name="Hostler Login" component={HostlerLogin} />
				<Stack.Screen name="Hostler" component={Hostler} />

				<Stack.Screen name="Hostler Dashboard" component={HostlerDash} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
