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
  const form = e.target;

  const data = {
    wo_number: form.wo_number.value,
    customer_name: form.customer_name.value,
    address: form.address.value,
    created_at: new Date(),
    photos: {}
  };

  // Upload Foto Rumah
  data.photos.house = await uploadFile(form.photo_house.files[0], `wo/${data.wo_number}/house`);

  // Simpan ke Firestore
  await addDoc(collection(db, "workorders"), data);

  alert("Data berhasil dikirim ke Firebase!");
  form.reset();
});
