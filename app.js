import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// LOGIN
window.login = function() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "admin" && pass === "admin") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("formPage").style.display = "block";
  } else {
    alert("Username/Password salah!");
  }
};

// Upload file ke Firebase Storage
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
    customer_id: form.customer_id.value,
    address: form.address.value,
    phone: form.phone.value,
    email: form.email.value,
    ont_serial: form.ont_serial.value,
    fat_id: form.fat_id.value,
    port_allocation: form.port_allocation.value,
    signal_level: form.signal_level.value,
    photos: {}
  };

  // Upload foto
  data.photos.house = await uploadFile(form.photo_house.files[0], `wo/${data.wo_number}/house`);
  data.photos.selfie = await uploadFile(form.photo_selfie.files[0], `wo/${data.wo_number}/selfie`);
  data.photos.cable1 = await uploadFile(form.photo_cable1.files[0], `wo/${data.wo_number}/cable1`);
  data.photos.cable2 = await uploadFile(form.photo_cable2.files[0], `wo/${data.wo_number}/cable2`);
  data.photos.barcode = await uploadFile(form.photo_barcode.files[0], `wo/${data.wo_number}/barcode`);
  data.photos.signature_customer = await uploadFile(form.signature_customer.files[0], `wo/${data.wo_number}/signature_customer`);
  data.photos.signature_installer = await uploadFile(form.signature_installer.files[0], `wo/${data.wo_number}/signature_installer`);

  // Simpan ke Firestore
  await addDoc(collection(db, "workorders"), { ...data, created_at: new Date() });

  // Buat PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Work Order Installation", 10, 10);
  doc.text(`WO Number: ${data.wo_number}`, 10, 20);
  doc.text(`Customer: ${data.customer_name}`, 10, 30);
  doc.text(`Alamat: ${data.address}`, 10, 40);
  doc.text(`Phone: ${data.phone}`, 10, 50);
  doc.text(`ONT Serial: ${data.ont_serial}`, 10, 60);
  doc.text(`FAT ID: ${data.fat_id}`, 10, 70);
  doc.save(`WO_${data.wo_number}.pdf`);

  alert("Data berhasil disimpan & PDF dibuat!");
  form.reset();
});
