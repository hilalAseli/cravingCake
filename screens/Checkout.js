import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { Button, Card, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import convertGoogleDrive from "../helper/ConvertGoogleDrive";
import PriceFormatter from "../helper/PriceFormatter";

export default function Checkout({ route }) {
  const { quantity, totalPrice, items } = route.params;
  const [allCheckout, setAllCheckout] = useState([]);
  const navigation = useNavigation();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState([]);
  const [province, setProvince] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const getProvince = async () => {
    try {
      const response = await axios.get(
        "https://ibnux.github.io/data-indonesia/provinsi.json"
      );
      setProvince(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckout = () => {
    navigation.navigate("Payment", { address, city, province });
  };

  const getCity = async () => {
    const id = selectedProvince;
    try {
      const response = await axios.get(
        `https://ibnux.github.io/data-indonesia/kabupaten/${id}.json`
      );
      setCity(response.data);
    } catch (err) {
      console.log("city error", err);
    }
  };

  useEffect(() => {
    getProvince();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getCity();
    } else {
      setCity([]);
    }
  }, [selectedProvince]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#FEECC8",
      }}
    >
      <View style={{ padding: 20, paddingBottom: "20%" }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Poppins_700Bold",
            marginBottom: 10,
          }}
        >
          Checkout
        </Text>

        <Card style={{ padding: 15, borderRadius: 15 }}>
          <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold" }}>
            Alamat Pengiriman
          </Text>
          <TextInput
            placeholder="Masukkan alamat lengkap"
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
              marginTop: 10,
            }}
            value={address}
            onChangeText={setAddress}
          />

          <Text style={{ marginTop: 10, fontFamily: "Poppins_400Regular" }}>
            Pilih Provinsi
          </Text>
          <Picker
            onValueChange={(value) => {
              setSelectedProvince(value);
              setSelectedCity("");
            }}
            selectedValue={selectedProvince}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              marginTop: 5,
            }}
          >
            <Picker.Item label="Pilih Provinsi" value={""} />
            {province.map((item) => (
              <Picker.Item label={item.nama} value={item.id} key={item.id} />
            ))}
          </Picker>

          <Text style={{ marginTop: 10, fontFamily: "Poppins_400Regular" }}>
            Pilih Kota
          </Text>
          <Picker
            onValueChange={(value) => setSelectedCity(value)}
            selectedValue={selectedCity}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              marginTop: 5,
            }}
            enabled={city.length > 0}
          >
            <Picker.Item label="Pilih Kota" value={""} />
            {city.map((item) => (
              <Picker.Item label={item.nama} value={item.nama} key={item.id} />
            ))}
          </Picker>
        </Card>

        <Divider style={{ marginVertical: 20 }} />

        <Card style={{ padding: 15, borderRadius: 15 }}>
          <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold" }}>
            Ringkasan Pesanan
          </Text>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Image
                  source={{ uri: convertGoogleDrive(item.productUrl) }}
                  style={{ width: 70, height: 70, borderRadius: 10 }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold" }}
                  >
                    {item.productName}
                  </Text>
                  <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold" }}>
                    {PriceFormatter(item.productPrice)}
                  </Text>
                  <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold" }}>
                    jumlah : {item.quantity}
                  </Text>
                </View>
              </View>
            )}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: 15,
            }}
          >
            <Text style={{ fontFamily: "Poppins_700Bold" }}>Total Payment</Text>
            <Text>{PriceFormatter(totalPrice)}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: 15,
            }}
          >
            <Text style={{ fontFamily: "Poppins_700Bold" }}>Total Jumlah</Text>
            <Text>{quantity}</Text>
          </View>
        </Card>

        <Button
          mode="contained"
          style={{
            backgroundColor: "#AA7733",
            marginTop: 20,
            borderRadius: 10,
          }}
          onPress={handleCheckout}
          disabled={!address || !province || !city}
        >
          Lanjut ke Pembayaran
        </Button>
      </View>
    </ScrollView>
  );
}
