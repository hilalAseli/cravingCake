import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import { Ionicons } from "@expo/vector-icons";
import Cart from "../screens/Cart";
const Tab = createBottomTabNavigator();
export default function Hometabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#AA7733",
        tabBarInactiveTintColor: "#AA7733",
        tabBarStyle: {
          height: 70,
          position: "absolute",
        },
        tabBarItemStyle: {
          padding: 15,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? "bag" : "bag-outline"}
              color={color}
              size={size}
            />
          ),
          headerShown: true,
          headerTitleAlign: "center",
          headerTitleStyle:{
            fontFamily:'Poppins_700Bold',
            color: "#333", 
          }
        }}
      />
    </Tab.Navigator>
  );
}
