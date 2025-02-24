import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import convertGoogleDrive from "../helper/ConvertGoogleDrive";
import { Searchbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function Other({ route }) {
  const { otherWhere } = route.params;
  const [otherData, setOtherData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const getOtherData = async () => {
    setLoading(true);
    try {
      const cookiesPremium = await axios.get(
        `http://192.168.1.8:3000/CookiesPremium/?page=${page}&limit=3`
      );
      const cookiesPopular = await axios.get(
        `http://192.168.1.8:3000/CookiesPopular/?page=${page}&limit=3`
      );
      const url = otherWhere
        ? cookiesPremium.data.listProduct
        : cookiesPopular.data.listPopularProduct;
      setOtherData(url);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const searchCookies = async (q) => {
    setSearchValue(q);
    const formatedSearchValue = q.toLowerCase().replace(/\s+/g, "-");
    const response = await axios.get(
      `http://192.168.1.8:3000/searchCookies?queryString=${formatedSearchValue}`
    );
    setSearchQuery(response.data.resultSearch);
  };

  const loadMorePage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const cookiesPremium = await axios.get(
        `http://192.168.1.8:3000/CookiesPremium/?page=${page}&limit=3`
      );
      const cookiesPopular = await axios.get(
        `http://192.168.1.8:3000/CookiesPopular/?page=${page}&limit=3`
      );
      const url = otherWhere
        ? cookiesPremium.data.listProduct
        : cookiesPopular.data.listPopularProduct;
      const uniqeData = url.filter(
        (item) => !otherData.some((prev) => prev.id === item.id)
      );
      setOtherData((prevData) => [...prevData, ...uniqeData]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOtherData();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: "#fff",
        margin: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      }}
    >
      <Image
        source={{ uri: convertGoogleDrive(item.productUrl) || item.productUrl}}
        style={{ width: "100%", height: 200, borderRadius: 10 }}
      />
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
        {item.productName}
      </Text>
      <Text style={{ fontSize: 14, color: "gray", marginVertical: 5 }}>
        {item.productDescription}
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Detail", {
            premiumData: item.productLevel === "premium" ? true : false,
            detailId:item.id
          })
        }
        style={{
          backgroundColor: "#FF8C00",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Lihat Detail</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FEECC8", padding: 10 }}>
      <Searchbar
        value={searchValue}
        onChangeText={searchCookies}
        style={{ backgroundColor: "white" }}
        inputStyle={{ fontFamily: "Poppins_400Regular" }}
        placeholder="Search..."
      />
      <FlatList
        ListFooterComponent={
          loading ? <ActivityIndicator size={"large"} color={"red"} /> : null
        }
        onEndReached={loadMorePage}
        onEndReachedThreshold={0.5}
        data={searchValue ? searchQuery : otherData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
