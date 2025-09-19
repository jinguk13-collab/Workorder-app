import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// HAPUS import untuk Firebase Storage:
// import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// HAPUS inisialisasi Storage:
// const storage = getStorage(app);

// URL Web App dari Google Apps Script Anda
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyEjLmA2JARxEUeynqe3Is2EAlvyaNZGumlh0vZiOpN/dev"; // GANTI DENGAN URL WEB APP ANDA

// HAPUS fungsi uploadFile ke Storage:
// async function uploadFile(file, path) {
//   if (!file) return null;
//   const storageRef = ref(storage, path + "/" + file.name);
//   await uploadBytes(storageRef, file);
//   return await getDownloadURL(storageRef);
// }

// LOGIN
document.getElementById("loginBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "admin") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("formPage").style.display = "block";
  } else {
    alert("Username / Password salah!");
  }
});

// Submit Form
document.getElementById("woForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const wo_number = document.getElementById("wo_number").value;
    const customer_name = document.getElementById("customer_name").value;
    const address = document.getElementById("address").value;
    const photo_house = document.getElementById("photo_house").files[0];

    // Data teks untuk Firestore
    const firestoreData = {
      wo_number,
      customer_name,
      address,
      created_at: new Date(),
      photos: {}
    };

    // Proses dan kirim foto ke Google Apps Script
    if (photo_house) {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(photo_house);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
      });
      
      const photoData = {
        base64Image: base64Image,
        fileName: photo_house.name,
        wo_number: wo_number
      };
      
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photoData),
      });
      
      const result = await response.text();
      console.log("Respons dari Apps Script:", result);
      
      // Ambil URL foto dari respons (jika skrip mengembalikan URL)
      const photoUrl = result.match(/https?:\/\/\S+/)?.[0];
      if (photoUrl) {
        firestoreData.photos.house = photoUrl;
      }
    }

    // Simpan data teks dan URL foto ke Firestore
    await addDoc(collection(db, "workorders"), firestoreData);

    alert("✅ Data berhasil dikirim ke Google Sheet & Firestore!");
    document.getElementById("woForm").reset();

  } catch (error) {
    console.error("❌ Error saat submit:", error);
    alert("❌ Terjadi error, cek Console untuk detail.");
  }
});

