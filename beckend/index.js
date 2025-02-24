import express from "express";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  startAfter,
  where,
  limit as firestoreLimit,
  addDoc,
} from "firebase/firestore";
import { db } from "../config/firebase.js";
const app = express();
const port = 3000;
const docId = `admin`;
app.use(express.json());

app.get("/CookiesPremium", async (req, res) => {
  try {
    let { limit, page } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 3;

    let qref = query(collection(db, "CookiesPremium"), firestoreLimit(limit));
    if (page > 1) {
      const prevSnapshot = await getDocs(
        query(
          collection(db, "CookiesPremium"),
          firestoreLimit((page - 1) * limit)
        )
      );
      const lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];

      if (lastVisible) {
        qref = query(
          collection(db, "CookiesPremium"),
          startAfter(lastVisible),
          firestoreLimit(limit)
        );
      }
    }
    const tempData = [];
    const snapshot = await getDocs(qref);
    snapshot.forEach((doc) => {
      tempData.push({ id: doc.id, ...doc.data() });
    });
    res
      .status(200)
      .json({ message: `Success get data`, listProduct: tempData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Fail Get Data ${err}` });
  }
});

app.get("/CookiesPopular", async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 3;
    let qref = query(collection(db, "CookiesPopular"), firestoreLimit(limit));
    if (page > 1) {
      const prevSnapshot = await getDocs(
        query(
          collection(db, "CookiesPopular"),
          firestoreLimit((page - 1) * limit)
        )
      );
      const lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];

      if (lastVisible) {
        qref = query(
          collection(db, "CookiesPopular"),
          startAfter(lastVisible),
          firestoreLimit(limit)
        );
      }
    }
    const snapshot = await getDocs(qref);
    const tempData = [];
    snapshot.forEach((doc) => {
      tempData.push({ id: doc.id, ...doc.data() });
    });
    res
      .status(200)
      .json({ message: `Success get data`, listPopularProduct: tempData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Fail get data ${err}` });
  }
});

app.get("/CookiesPopular/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, "CookiesPopular", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ message: "Product Not Found" });
    } else {
      res.status(200).json({
        message: "success get product",
        productDetail: { id: docSnap.id, ...docSnap.data() },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Fail get product detail ${err}` });
  }
});

app.get("/CookiesPremium/:id", async (req, res) => {
  const { id } = req.params;
  const docRef = doc(db, "CookiesPremium", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return res.status(404).json({ message: "Premium Cookies Not found !" });
  }
  res.status(200).json({
    message: "Success get detail premium cookies !",
    productDetail: { id: docSnap.id, ...docSnap.data() },
  });
});

app.post("/addNewCookies", async (req, res) => {
  try {
    const {
      imageUrl,
      productName,
      productDescription,
      productPrice,
      productType,
      jenisProduk,
    } = req.body;
    if (
      !imageUrl ||
      !productName ||
      !productDescription ||
      !productPrice ||
      !productType ||
      !jenisProduk
    ) {
      return res.status(400).json({ message: "semua field harus diisi !" });
    }
    if (isNaN(productPrice)) {
      return res.status(400).json({ message: "price harus berupa angka!" });
    }
    const validationJenis =
      jenisProduk === "premium" ? "CookiesPremium" : "CookiesPopular";
    await addDoc(collection(db, validationJenis), {
      productName,
      productDescription,
      productPrice: Number(productPrice),
      productType,
      imageUrl,
      slug: productName.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date(),
      productLevel: jenisProduk,
    });
    res.status(200).json({ message: "berhasil add data baru" });
  } catch (err) {
    res.status(500).json({ message: "gagal add data baru" });
  }
});

app.get("/searchCookies", async (req, res) => {
  try {
    const { queryString } = req.query;
    const lowerQuery = queryString.toLowerCase();
    const resultSearch = [];
    const Qpremium = query(
      collection(db, "CookiesPremium"),
      where("slug", ">=", lowerQuery),
      where("slug", "<=", lowerQuery + "\uf8ff")
    );

    const snapshotPremium = await getDocs(Qpremium);
    snapshotPremium.forEach((doc) => {
      const { id } = doc.id;
      if (!resultSearch.some((item) => item.id === id)) {
        resultSearch.push({ id: doc.id, ...doc.data() });
      }
    });

    const Qpopular = query(
      collection(db, "CookiesPopular"),
      where("slug", ">=", lowerQuery),
      where("slug", "<=", lowerQuery + "\uf8ff")
    );
    const snapshotPopular = await getDocs(Qpopular);
    snapshotPopular.forEach((doc) => {
      const { id } = doc.id;
      if (!resultSearch.some((item) => item.id == id)) {
        resultSearch.push({ id: doc.id, ...doc.data() });
      }
    });

    if (resultSearch.length > 0) {
      res.status(200).json({ message: "search succes", resultSearch });
    } else {
      res.status(404).json({ message: "No Products found for your search" });
    }
  } catch (err) {
    res.status(500).json({ message: "api search error" });
  }
});

app.delete("/deleteCookies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = query(collection(db, "cartAddUser"));
    const docSnap = await getDocs(docRef);
    for (const document of docSnap.docs) {
      const data = document.data();
      if (data.userCartList && data.userCartList.includes(id)) {
        await setDoc(
          doc(db, "cartAddUser", document.id),
          {
            userCartList: data.userCartList.filter((item) => item !== id),
          },
          { merge: true }
        );
      }
      console.log("Tes2");
    }

    res.status(200).json({ message: "berhasil hapus data" });
  } catch (err) {
    res.status(500).json({ message: "gagal hapus data" });
    console.log(err);
  }
});

app.delete("/deleteCookiesFavorite/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = query(collection(db, "addToFav"));
    const docFavSnap = await getDocs(docRef);
    for (const document of docFavSnap.docs) {
      const data = document.data();
      if (data.userFavList) {
        await setDoc(
          doc(db, "addToFav", document.id),
          {
            userFavList: data.userFavList.filter((item) => item.heartId !== id),
          },
          { merge: true }
        );
      }
      console.log("Tes");
    }

    res.status(200).json({ message: "berhasil hapus data" });
  } catch (err) {
    res.status(500).json({ message: "gagal hapus data" });
    console.log(err);
  }
});

app.post("/addToCart", async (req, res) => {
  try {
    const { addItemId, quantity } = req.body;
    if (!addItemId) {
      return res.status(500).json({ message: "Add Item Required" });
    }
    await setDoc(
      doc(db, "cartAddUser", docId),
      {
        userCartList: arrayUnion(addItemId),
        createdAt: new Date().toISOString(),
        quantityUserAdd: quantity,
      },
      { merge: true }
    );
    res.status(200).json({ message: "User Berhasil Add Ke Cart" });
  } catch (err) {
    console.log(err);
  }
});

app.get("/itemCart", async (req, res) => {
  try {
    const q = query(collection(db, "cartAddUser"));
    const snapshot = await getDocs(q);
    const tempData = [];
    snapshot.forEach((doc) => {
      tempData.push({ id: doc.id, ...doc.data() });
    });
    res
      .status(200)
      .json({ message: "success get data cart", cartList: tempData });
  } catch (err) {
    console.log(err);
  }
});

app.post("/addToFavorite", async (req, res) => {
  try {
    const { favItemId } = req.body;
    if (!favItemId) {
      return res.status(500).json({ message: "Add Item Required!" });
    }
    await setDoc(
      doc(db, "addToFav", docId),
      {
        userFavList: arrayUnion(favItemId),
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
    res.status(200).json({ message: "Item success add to favorite" });
  } catch (err) {
    res.status(500).status({ message: "Gagal Add Ke Favorite (be)" });
  }
});

app.get("/itemFav", async (req, res) => {
  try {
    const response = query(collection(db, "addToFav"));
    const snapshot = await getDocs(response);
    const tempData = [];
    snapshot.forEach((doc) => {
      tempData.push({ id: doc.id, ...doc.data() });
    });
    res
      .status(200)
      .json({ message: "Berhasil Load item Favorite", favoriteList: tempData });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
