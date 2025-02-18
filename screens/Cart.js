import {
  View,
  Text,
  FlatList,
  Image,
  ToastAndroid,
  ScrollView,
} from "react-native";
import React, { useCallback, useState } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import PriceFormatter from "../helper/PriceFormatter";
import { Button, Divider, IconButton, List } from "react-native-paper";

export default function Cart() {
  const [AllProduct, setAllProduct] = useState([]);

  const getCartList = async () => {
    try {
      const response = await axios.get("http://192.168.1.8:3000/itemCart");
      const productId = response.data.cartList[0]?.userCartList || [];
      const qtty = response.data.cartList[0].quantityUserAdd;
      const tempData = [];
      for (let id of productId) {
        const [popularRes, premiumRes] = await Promise.allSettled([
          axios.get(`http://192.168.1.8:3000/CookiesPopular/${id}`),
          axios.get(`http://192.168.1.8:3000/CookiesPremium/${id}`),
        ]);
        const popular =
          popularRes.status === "fulfilled"
            ? popularRes.value.data.productDetail
            : {};
        const premium =
          premiumRes.status === "fulfilled"
            ? premiumRes.value.data.productDetail
            : {};
        tempData.push({
          ...popular,
          ...premium,
          quantity: qtty,
        });
      }
      setAllProduct(tempData);
    } catch (err) {
      console.log(err);
    }
  };

  const convertGoogleDrive = (url) => {
    if (!url) return null;
    const convertProcess = url.split("/file/d/")[1]?.split("/")[0];
    return `https://drive.google.com/uc?export=view&id=${convertProcess}`;
  };

  const updateQuantity = (index, change) => {
    setAllProduct((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const deleteId = async (itemId) => {
    try {
      await axios.delete(`http://192.168.1.8:3000/deleteCookies/${itemId}`);
      await getCartList();
      ToastAndroid.show(
        "Item berhasil dihapus dari keranjang",
        ToastAndroid.BOTTOM
      );
    } catch (err) {
      console.log("Error detail:", err.response?.data);
      ToastAndroid.show(
        err.response?.data?.message || "Gagal menghapus item dari keranjang",
        ToastAndroid.BOTTOM
      );
    }
  };

  const calculateTotalPrice = () => {
    return AllProduct.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
  };
  const calculateAllQuantity = () => {
    return AllProduct.reduce((total, item) => total + item.quantity, 0);
  };
  useFocusEffect(
    useCallback(() => {
      getCartList();
    }, [])
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FEECC8", padding: 20 }}>
      {AllProduct.length === 0 ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 10,
            padding: 20,
            marginTop:150
          }}
        >
          <Image
            source={require("../assets/emptyCart.png")}
            style={{ height: 200, width: 200, marginBottom: 15 }}
          />
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "#333",
              textAlign: "center",
            }}
          >
            Anda belum menambahkan apapun ke keranjang
          </Text>
        </View>
      ) : (
        <FlatList
          data={AllProduct}
          renderItem={({ item, index }) => (
            <>
              <List.Item
                style={{
                  backgroundColor: "white",
                  borderRadius: 15,
                  padding: 10,
                  marginBottom: 10,
                  elevation: 3,
                }}
                left={() => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      flex: 1,
                    }}
                  >
                    <Image
                      source={{ uri: convertGoogleDrive(item.productUrl) }}
                      style={{ width: 100, height: 100, borderRadius: 10 }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: "Poppins_600SemiBold",
                          color: "#333",
                        }}
                      >
                        {item.productName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: "Poppins_700Bold",
                          color: "#333",
                        }}
                      >
                        {PriceFormatter(item.productPrice)}
                      </Text>
                    </View>
                  </View>
                )}
                right={() => (
                  <View style={{ alignItems: "center", gap: 5 }}>
                    <IconButton
                      icon="delete-outline"
                      iconColor="red"
                      size={24}
                      onPress={() => deleteId(item.id)}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <IconButton
                        icon="plus"
                        iconColor="white"
                        size={15}
                        style={{ backgroundColor: "black" }}
                        onPress={() => updateQuantity(index, 1)}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: "Poppins_600SemiBold",
                          color: "#333",
                        }}
                      >
                        {item.quantity}
                      </Text>
                      <IconButton
                        icon="minus"
                        iconColor="white"
                        size={15}
                        style={{ backgroundColor: "black" }}
                        onPress={() => updateQuantity(index, -1)}
                      />
                    </View>
                  </View>
                )}
              />
            </>
          )}
        />
      )}
      {AllProduct.length !== 0 && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            width: "100%",
            height: 200,
            borderRadius: 10,
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontFamily: "Poppins_700Bold" }}>
              Total Quantity
            </Text>
            <Text>{calculateAllQuantity()}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontFamily: "Poppins_700Bold" }}>Total Payment</Text>
            <Text>{PriceFormatter(calculateTotalPrice())}</Text>
          </View>
          <Button
            mode="contained"
            style={{ backgroundColor: "#AA7733", width: "70%" }}
          >
            Checkout
          </Button>
        </View>
      )}
    </ScrollView>
  );
}
