import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Hometabs from "./Hometabs";
import Detail from "../screens/[Detail]";
const Stack = createStackNavigator();
export default function Route() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen component={Hometabs} name="Hometabs"/>
            <Stack.Screen component={Detail} name="Detail"/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}
