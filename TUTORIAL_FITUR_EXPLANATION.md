# 🎯 Tutorial: Menggunakan Fitur Explanation

## Langkah-Langkah Menggunakan Fitur Explanation

### 1. **Persiapkan File JSON dengan Field Explanation**

Pastikan file JSON Anda memiliki field `explanation` seperti contoh berikut:

```json
{
  "id": 1,
  "question_text": "Kata manakah yang TIDAK sama dengan kata-kata yang lain?",
  "options": {
    "a": "Biola",
    "b": "Gitar", 
    "c": "Piano",
    "d": "Seruling",
    "e": "Radio"
  },
  "correct_answers": ["e"],
  "poin_benar": 1,
  "poin_salah": 0,
  "explanation": "Biola, Gitar, Piano, dan Seruling adalah alat musik yang dimainkan untuk menghasilkan suara/musik. Radio adalah alat elektronik untuk menerima siaran suara, bukan alat musik yang dimainkan secara langsung."
}
```

### 2. **Upload dan Mulai Ujian**

1. Buka aplikasi di browser: `http://localhost:8000`
2. Di bagian "Tambah Mata Pelajaran Baru":
   - Masukkan nama mata pelajaran (misal: "Ujian MTs")
   - Klik "Pilih File" dan upload file JSON Anda
   - Klik "Tambah Mata Pelajaran"
3. Klik tombol mata pelajaran yang baru ditambahkan

### 3. **Menjawab Soal**

1. Pilih jawaban yang menurut Anda benar
2. Klik tombol **"Periksa Jawaban"**
3. **Explanation akan muncul** di bawah feedback jawaban

### 4. **Tampilan Explanation**

Setelah menekan "Periksa Jawaban", Anda akan melihat:

```
✅ BENAR! Jawaban Anda tepat! (+1 poin)

💡 Penjelasan:
Biola, Gitar, Piano, dan Seruling adalah alat musik yang dimainkan 
untuk menghasilkan suara/musik. Radio adalah alat elektronik untuk 
menerima siaran suara, bukan alat musik yang dimainkan secara langsung.
```

### 5. **Navigasi dengan Explanation**

- Explanation akan **tetap tampil** saat Anda navigasi ke soal lain yang sudah diperiksa
- Explanation akan **hilang** saat Anda pindah ke soal yang belum diperiksa
- Explanation akan **muncul kembali** saat Anda kembali ke soal yang sudah diperiksa

## Contoh Penggunaan Complete

### File JSON Lengkap:
```json
[
  {
    "id": 1,
    "chapter_source": "ujian_mts",
    "question_text": "Kata manakah yang TIDAK sama dengan kata-kata yang lain?",
    "options": {
      "a": "Biola",
      "b": "Gitar",
      "c": "Piano", 
      "d": "Seruling",
      "e": "Radio"
    },
    "correct_answers": ["e"],
    "poin_benar": 1,
    "poin_salah": 0,
    "explanation": "Biola, Gitar, Piano, dan Seruling adalah alat musik yang dimainkan untuk menghasilkan suara/musik. Radio adalah alat elektronik untuk menerima siaran suara, bukan alat musik yang dimainkan secara langsung."
  }
]
```

### Alur Complete:
1. **Upload** → File JSON dengan explanation
2. **Pilih** → Mata pelajaran baru
3. **Jawab** → Soal dengan memilih option
4. **Periksa** → Klik "Periksa Jawaban"
5. **Baca** → Explanation yang muncul
6. **Lanjut** → Ke soal berikutnya atau navigasi bebas

## Tips dan Best Practices

### ✅ **Format Explanation yang Baik:**
- Jelaskan **mengapa** jawaban benar
- Berikan **konteks** atau **latar belakang**
- Gunakan bahasa yang **mudah dipahami**
- Singkat tapi **informatif** (1-3 kalimat)

### ✅ **Contoh Explanation yang Efektif:**

**Untuk Soal Matematika:**
```json
"explanation": "Bilangan prima hanya dapat dibagi oleh 1 dan dirinya sendiri. Dari pilihan yang ada, hanya 17 yang merupakan bilangan prima. Yang lain: 15 (3×5), 21 (3×7), 25 (5×5), 27 (3×9)."
```

**Untuk Soal IPA:**
```json  
"explanation": "Sistem peredaran darah memiliki fungsi utama mengangkut oksigen, nutrisi, dan zat-zat penting lainnya ke seluruh tubuh, serta membuang sisa metabolisme."
```

**Untuk Soal Sejarah:**
```json
"explanation": "Thomas Alva Edison adalah penemu lampu pijar yang praktis dan tahan lama pada tahun 1879. Meskipun ada inventor lain sebelumnya, Edison yang berhasil membuatnya komersial."
```

## Testing dan Validasi

### Cara Test Fitur:
1. Upload file JSON contoh: `contoh_soal_dengan_explanation.json`
2. Mulai ujian dan jawab soal pertama
3. Klik "Periksa Jawaban"
4. Pastikan explanation muncul dengan styling yang benar
5. Navigasi ke soal lain dan kembali - pastikan explanation tetap tampil

### Troubleshooting:
- **Explanation tidak muncul?** → Cek field `explanation` di JSON
- **Styling rusak?** → Refresh browser dan cek CSS
- **Teks terpotong?** → Kurangi panjang explanation

---

## 🚀 Fitur Sudah Ready!

**Fitur explanation sudah terintegrasi penuh** dan siap digunakan. Anda tinggal:
1. ✅ Membuat file JSON dengan field `explanation`
2. ✅ Upload ke aplikasi
3. ✅ Mulai ujian dan nikmati pengalaman pembelajaran yang lebih baik!

**Happy Learning!** 📚✨
