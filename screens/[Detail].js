import { View, Text, Image, ScrollView, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import PriceFormater from "../helper/PriceFormatter";
import convertGoogleDrive from "../helper/ConvertGoogleDrive";

export default function Detail({ route }) {
  const { detailId, premiumData } = route.params;
  const [detailData, setDetailData] = useState({});
  const [heartUi, setHeartUi] = useState(false);
  const navigation = useNavigation();

  const handleHeart = async (item) => {
    try {
      await axios.post("http://192.168.1.8:3000/addToFavorite", {
        favItemId: item,
      });
    } catch (err) {
      setHeartUi(false);
      console.log(err);
    } finally {
      console.log("item berhasil di tambahkan (fe)");
      setHeartUi(true);
      ToastAndroid.show("Item di tambahkan ke favorite", ToastAndroid.BOTTOM);
    }
  };

  const handleCart = async (item) => {
    try {
      await axios.post("http://192.168.1.8:3000/addToCart", {
        addItemId: item,
        quantity: 1,
      });
      console.log("berhasil Add Data");
      ToastAndroid.show("item di tambahkan ke cart", ToastAndroid.BOTTOM);
    } catch (err) {
      console.log("gagal add data", err);
    }
  };

  const detailLoad = async () => {
    try {
      const url = premiumData
        ? `http://192.168.1.8:3000/CookiesPremium/${detailId}`
        : `http://192.168.1.8:3000/CookiesPopular/${detailId}`;
      const response = await axios.get(url);
      setDetailData(response.data.productDetail);
    } catch (err) {
      console.log("gagal get detail", err);
    }
  };

  useEffect(() => {
    detailLoad();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#FEECC8" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: "20%" }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              position: "absolute",
              zIndex: 10,
              width: "100%",
              padding: 20,
            }}
          >
            <IconButton
              icon={"chevron-left"}
              onPress={() => navigation.goBack()}
              size={30}
              iconColor="white"
            />
            <IconButton
              icon={heartUi ? "heart" : "heart-outline"}
              size={30}
              iconColor={heartUi ? "red" : "white"}
              onPress={() => handleHeart({heartId : detailId})}
            />
          </View>
          <Image
            source={{
              uri:
                convertGoogleDrive(detailData?.productUrl) ||
                detailData.productUrl,
            }}
            style={{ height: 350, width: "100%" }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View style={{ flex: 1, gap: 10 }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20,
                color: "#333",
              }}
            >
              {detailData.productName}
            </Text>
            <Text
              style={{
                backgroundColor: "#67481f",
                paddingHorizontal: 10,
                paddingVertical: 5,
                alignSelf: "flex-start",
                color: "white",
                borderRadius: 99,
                fontFamily: "Poppins_400Regular",
              }}
            >
              {detailData.productType}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 22,
              color: "#E44D26",
            }}
          >
            {PriceFormater(detailData.productPrice)}
          </Text>
        </View>
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: "#555",
              lineHeight: 24,
            }}
          >
            {detailData.productDescription}
          </Text>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#67481f",
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        }}
      >
        <IconButton
          icon={"cart-plus"}
          size={30}
          iconColor="white"
          onPress={() => handleCart(detailId)}
        />
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 18,
            color: "white",
          }}
        >
          Masukkan Keranjang
        </Text>
      </View>
    </View>
  );
}
