import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import useWarmUpBrowser from "../hooks/useWarmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
export default function Login() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  const handleLogin = async () => {
   try {
    const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("Hometabs"),
      });
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        console.log("gagal login ada masalah");
      }
   } catch (err){
    console.log(err,'something was error')
   }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FEECC8",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 40 }}>
        For a Better Batch Of Cookies{" "}
        <Ionicons name="cafe" size={40} color={"#AA7733"} />
      </Text>
      <Image
        source={require("../assets/LoginPage.jpeg")}
        style={{ height: 300, width: 300, borderRadius: 300 }}
      />
      <TouchableOpacity onPress={handleLogin}>
        <View
          style={{
            backgroundColor: "#AA7733",
            width: 300,
            height: 150,
            top: 200,
            alignItems: "center",
            justifyContent: "center",
            borderTopLeftRadius: 300,
            borderTopRightRadius: 300,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "white",
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            Get Started
          </Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
