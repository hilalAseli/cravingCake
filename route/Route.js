import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Hometabs from "./Hometabs";
import Detail from "../screens/[Detail]";
import Login from "../screens/Login";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { TokenCache } from "../hooks/TokenCache";
import Other from "../screens/Other";
import Checkout from "../screens/Checkout";
const Stack = createStackNavigator();
export default function Route() {
  const Linking = {
    prefixes: ["cravingCake://"],
    config: {
      screens: {
        Hometabs: "Hometabs",
        Login: "Login",
      },
    },
  };
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={TokenCache}
    >
      <NavigationContainer linking={Linking}>
        <SignedIn>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen component={Hometabs} name="Hometabs" />
            <Stack.Screen component={Detail} name="Detail" />
            <Stack.Screen component={Other} name="Other" options={{headerShown:true,title:"Temukan lebih banyak"}}/>
            <Stack.Screen component={Checkout} name="Checkout" options={{headerShown:true,title:"Selesaikan Pembayaran"}}/>
          </Stack.Navigator>
        </SignedIn>
        <SignedOut>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen component={Login} name="Login" />
          </Stack.Navigator>
        </SignedOut>
      </NavigationContainer>
    </ClerkProvider>
  );
}
