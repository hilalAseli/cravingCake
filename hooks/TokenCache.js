import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
const createTokenCache = () => {
  return {
    getToken: async (key) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was locked`);
        } else {
          console.log(`no one ${key} can 🔒 here`);
        }
        return item;
      } catch (err) {
        console.log(err, "error");
        await SecureStore.deleteItemAsync(key);
      }
    },
    saveToken: async (token, key) => {
      await SecureStore.setItemAsync(token, key);
      console.log(`✅ Token "${key}" berhasil disimpan!`);
    },
  };
};
export const TokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;
