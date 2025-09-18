import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

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

// Upload file ke Storage
async function uploadFile(file, path) {
  if (!file) return null;
  const storageRef = ref(storage, path + "/" + file.name);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Submit Form
document.getElementById("woForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const wo_number = document.getElementById("wo_number").value;
    const customer_name = document.getElementById("customer_name").value;
    const address = document.getElementById("address").value;
    const photo_house = document.getElementById("photo_house").files[0];

    const data = {
      wo_number,
      customer_name,
      address,
      created_at: new Date(),
      photos: {}
    };

    // Upload Foto Rumah
    if (photo_house) {
      data.photos.house = await uploadFile(photo_house, `wo/${wo_number}/house`);
    }

    // Simpan ke Firestore
    await addDoc(collection(db, "workorders"), data);

    alert("✅ Data berhasil dikirim ke Firebase!");
    document.getElementById("woForm").reset();

  } catch (error) {
    console.error("❌ Error saat submit:", error);
    alert("❌ Terjadi error, cek Console untuk detail.");
  }
});
