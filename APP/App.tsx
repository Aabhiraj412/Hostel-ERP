// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './Components/Landing';
import Test from './Components/Warden';
import Card from './Components/Cards';
import WardenLogin from './Components/Warden/WardenLogin';
import useStore from './Store/Store';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const {cookie, user} = useStore();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={cookie?user==="Warden"?"Warden":user==="Hostler"?"hostler":"Landing":"Landing"}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="WardenLogin" component={WardenLogin}/>
        <Stack.Screen name="Warden" component={Test} />
        {/* <Stack.Screen name="Hostler" component={HostlerScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
