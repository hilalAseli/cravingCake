import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PriceFormatter from "../helper/PriceFormatter";
import convertGoogleDrive from "../helper/ConvertGoogleDrive";
import { IconButton, List } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function Favorite() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const navigation = useNavigation();
  const deleteId = async (id) => {
    try {
      await axios.delete(`http://192.168.1.8:3000/deleteCookiesFavorite/${id}`);
      ToastAndroid.show(
        "item telah di hapus dari favorit",
        ToastAndroid.BOTTOM
      );
      getFavoriteList();
    } catch (err) {
      ToastAndroid.show(
        "item Gagal di hapus dari favorit",
        ToastAndroid.BOTTOM
      );
      console.log(err);
    }
  };

  const getFavoriteList = async () => {
    try {
      const response = await axios.get("http://192.168.1.8:3000/itemFav");
      const pickId =
        response.data.favoriteList[0]?.userFavList.map(
          (item) => item.heartId
        ) || [];
      const tempData = [];
      for (let id of pickId) {
        const [popularFav, premiumFav] = await Promise.allSettled([
          axios.get(`http://192.168.1.8:3000/CookiesPremium/${id}`),
          axios.get(`http://192.168.1.8:3000/CookiesPopular/${id}`),
        ]);
        const popular =
          popularFav.status === "fulfilled"
            ? popularFav.value.data.productDetail
            : {};
        const premium =
          premiumFav.status === "fulfilled"
            ? premiumFav.value.data.productDetail
            : {};
        tempData.push({ ...popular, ...premium });
      }
      setFavoriteProducts(tempData);
    } catch (err) {
      console.log(err);
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

  useFocusEffect(
    useCallback(() => {
      getFavoriteList();
    }, [])
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FEECC8", padding: 20 }}>
      {favoriteProducts.length === 0 ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 10,
            padding: 20,
            marginTop: 150,
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
            Anda belum menambahkan apapun ke favorit
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteProducts}
          renderItem={({ item }) => (
            <List.Item
              onPress={() =>
                navigation.navigate("Detail", {
                  detailId: item.id,
                  premiumData: item.productLevel ? true : false,
                })
              }
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
                    source={{
                      uri:
                        convertGoogleDrive(item.productUrl) || item.productUrl,
                    }}
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
                <>
                  <IconButton
                    onPress={() => handleCart(item.id)}
                    icon={"cart-plus"}
                    iconColor="white"
                    style={{ backgroundColor: "black" }}
                    size={15}
                  />
                  <IconButton
                    onPress={() => deleteId(item.id)}
                    icon={"minus"}
                    iconColor="white"
                    style={{ backgroundColor: "black" }}
                    size={15}
                  />
                </>
              )}
            />
          )}
        />
      )}
    </ScrollView>
  );
}
