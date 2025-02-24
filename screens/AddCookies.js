import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";

export default function AddCookies() {
  const [imageUrl, setImage] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productType, setProductType] = useState("");
  const [jenisProduk, setJenisProduk] = useState(null);

  const itemsPicker = [
    { label: "Premium", value: "premium" },
    { label: "Popular", value: "popular" },
  ];

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        !imageUrl ||
        !productName ||
        !productDescription ||
        !productPrice ||
        !productType ||
        !jenisProduk
      ) {
        return ToastAndroid.show(
          "Field harus diisi lengkap!",
          ToastAndroid.BOTTOM
        );
      }
      const productData = {
        imageUrl,
        productName,
        productDescription,
        productPrice: Number(productPrice),
        productType,
        jenisProduk,
      };
      await axios.post(`http://192.168.1.8:3000/addNewCookies`, productData);
      ToastAndroid.show("Produk berhasil ditambahkan!", ToastAndroid.SHORT);
      setImage("");
      setProductDescription("");
      setProductName("");
      setProductPrice("");
      setProductType("");
      setJenisProduk(null);
    } catch (err) {
      console.log("error di fe", err);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FEECC8",
        padding: 20,
        gap: 15,
        justifyContent: "center",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={selectImage}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 150, height: 150, borderRadius: 10 }}
            />
          ) : (
            <Image
              source={require("../assets/addImage.png")}
              style={{ width: 150, height: 150 }}
            />
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Nama Produk"
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />
      <TextInput
        placeholder="Deskripsi Produk"
        value={productDescription}
        onChangeText={setProductDescription}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Harga Produk"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Tipe Produk"
        value={productType}
        onChangeText={setProductType}
        style={styles.input}
      />

      <RNPickerSelect
        onValueChange={(value) => setJenisProduk(value)}
        items={itemsPicker}
        placeholder={{ label: "Pilih jenis produk...", value: null }}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
        }}
      />

      <Button title="Tambah Produk" onPress={handleSubmit} color="#D2691E" />
    </View>
  );
}

const styles = {
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
};
