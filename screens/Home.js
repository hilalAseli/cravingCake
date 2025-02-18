import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { List, Searchbar } from "react-native-paper";
import axios from "axios";
import PriceFormater from "../helper/PriceFormatter";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [cookiesPremiumData, setCookiesPremiumData] = useState([]);
  const [cookiesPopularData, setCookiesPopularData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState([]);
  const navigation = useNavigation();
  const handleSearch = async (q) => {
    setSearchValue(q);
    if (!q.trim()) {
      setSearchQuery([]);
      return;
    }
    setLoading(true);
    try {
      const formatedSearchValue = q.toLowerCase().replace(/\s+/g, "-");
      const response = await axios.get(
        `http://192.168.1.8:3000/searchCookies?queryString=${formatedSearchValue}`
      );
      setSearchQuery(response.data.resultSearch);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getCp = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.8:3000/CookiesPremium"
      );
      setCookiesPremiumData(response.data.listProduct);
    } catch (err) {
      console.log(err, "gagal fetch di fe");
    }
  };

  const getPopularCookies = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.8:3000/CookiesPopular"
      );
      setCookiesPopularData(response.data.listPopularProduct);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getCp(), getPopularCookies()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const extractGoogleDriveUrl = (url) => {
    const splitId = url.split("/file/d/")[1]?.split("/")[0];
    return `https://drive.google.com/uc?export=view&id=${splitId}`;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "#FEECC8" }}
    >
      <View
        style={{
          backgroundColor: "#FEECC8",
          padding: 20,
          gap: 20,
          flex: 1,
          paddingBottom: "20%",
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 30,
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold" }}>
              Hello, Imran👋
            </Text>
            <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium" }}>
              What you want to cookies today?
            </Text>
          </View>
          <Image
            source={require("../assets/DummyProfile.jpeg")}
            style={{ width: 50, height: 50, borderRadius: 10 }}
          />
        </View>

        <View>
          <Searchbar
            placeholder="Search Items"
            placeholderTextColor="gray"
            iconColor="gray"
            inputStyle={{ fontFamily: "Poppins_400Regular" }}
            style={{ backgroundColor: "white" }}
            onChangeText={handleSearch}
            value={searchValue}
          />
        </View>

        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            }}
          >
            <ActivityIndicator size="large" color="#FF5733" />
          </View>
        ) : (
          <>
            {searchQuery.length > 0 && searchValue.length > 0 && (
              <View style={{ gap: 20 }}>
                <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 22 }}>
                  Hasil Pencarian
                </Text>
                <FlatList
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  data={searchQuery}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        backgroundColor: "white",
                        borderRadius: 20,
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        padding: 20,
                        marginBottom: 10,
                      }}
                    >
                      <Image
                        source={{ uri: extractGoogleDriveUrl(item.productUrl) }}
                        style={{ width: 100, height: 100, borderRadius: 100 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: "Poppins_600SemiBold",
                            fontSize: 14,
                          }}
                        >
                          {item.productName}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Poppins_700Bold",
                            fontSize: 18,
                          }}
                        >
                          {PriceFormater(item.productPrice)}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{
                            fontFamily: "Poppins_400Regular",
                            fontSize: 12,
                            color: "gray",
                          }}
                        >
                          {item.productDescription}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            )}

            {/* Cookies Premium */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 22 }}>
                Cookies Premium 🔥
              </Text>
              <Ionicons name="ellipsis-horizontal" size={24} color="black" />
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={cookiesPremiumData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Detail", {
                      detailId: item.id,
                      premiumData: true,
                    })
                  }
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: 30,
                      margin: 5,
                      alignItems: "center",
                      padding: 20,
                      gap: 10,
                      width: 250,
                      height: 250,
                    }}
                  >
                    <Image
                      source={{ uri: extractGoogleDriveUrl(item.productUrl) }}
                      style={{ width: 150, height: 150, borderRadius: 100 }}
                    />
                    <Text
                      style={{
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: 14,
                      }}
                    >
                      {item.productName}
                    </Text>
                    <Text
                      style={{ fontFamily: "Poppins_700Bold", fontSize: 18 }}
                    >
                      {PriceFormater(item.productPrice)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            {/* Cookies Popular */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 22 }}>
                Popular Now 🔥
              </Text>
              <Ionicons name="ellipsis-horizontal" size={24} color="black" />
            </View>
            <FlatList
              data={cookiesPopularData}
              renderItem={({ item }) => (
                <List.Item
                  onPress={() =>
                    navigation.navigate("Detail", {
                      detailId: item.id,
                      premiumData: false,
                    })
                  }
                  left={() => (
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 10,
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          borderRadius: 20,
                          width: 200,
                          height: 100,
                          alignItems: "center",
                          padding: 20,
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={{
                            uri: extractGoogleDriveUrl(item.productUrl),
                          }}
                          style={{ width: 80, height: 80, borderRadius: 100 }}
                        />
                      </View>
                      <View style={{ gap: 10 }}>
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
                          {item.productType}
                        </Text>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={2}
                          style={{
                            fontFamily: "Poppins_600SemiBold",
                            fontSize: 14,
                          }}
                        >
                          {item.productName}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Poppins_700Bold",
                            fontSize: 16,
                          }}
                        >
                          {PriceFormater(item.productPrice)}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              )}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}
