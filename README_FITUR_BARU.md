# Fitur Upload JSON dan Tambah Mata Pelajaran

## Fitur Baru yang Ditambahkan

### 1. Form Tambah Mata Pelajaran Baru
Pada halaman utama, kini terdapat section "Tambah Mata Pelajaran Baru" yang memungkinkan pengguna untuk:

- **Input Nama Mata Pelajaran**: Field untuk memasukkan nama mata pelajaran baru (minimal 3 karakter)
- **Upload File JSON**: Fitur untuk mengupload file soal dalam format JSON
- **Preview JSON**: Tombol untuk melihat preview soal yang telah diupload
- **Validasi**: Sistem validasi untuk memastikan format JSON benar dan nama mata pelajaran valid

### 2. Struktur JSON yang Didukung

Aplikasi mendukung dua format JSON:

#### Format Lama:
```json
[
  {
    "id": 1,
    "soal": "Pertanyaan soal...",
    "pilihan": {
      "a": "Pilihan A",
      "b": "Pilihan B",
      "c": "Pilihan C",
      "d": "Pilihan D"
    },
    "correct_answers": ["a"],
    "poin_benar": 2,
    "poin_salah": -1
  }
]
```

#### Format Baru (yang digunakan aplikasi saat ini):
```json
[
  {
    "id": 1,
    "chapter_source": "Sumber soal",
    "question_text": "Pertanyaan soal...",
    "options": {
      "a": "Pilihan A",
      "b": "Pilihan B", 
      "c": "Pilihan C",
      "d": "Pilihan D"
    },
    "correct_answers": ["a"],
    "poin_benar": 2,
    "poin_salah": -1
  }
]
```

### 3. Cara Menggunakan

1. **Persiapkan File JSON**:
   - Buat file JSON dengan struktur soal yang benar
   - Pastikan file berekstensi `.json`
   - Minimal harus ada 1 soal dalam array

2. **Tambah Mata Pelajaran**:
   - Isi nama mata pelajaran di field "Nama Mata Pelajaran"
   - Klik "Choose File" dan pilih file JSON soal
   - (Opsional) Klik "Preview JSON" untuk melihat preview soal
   - Klik "Tambah Mata Pelajaran" untuk menambahkan

3. **Menggunakan Mata Pelajaran Baru**:
   - Mata pelajaran baru akan muncul dalam daftar dengan ikon ✨
   - Tombol mata pelajaran custom berwarna hijau
   - Klik tombol untuk memulai kuis

### 4. Validasi dan Error Handling

- **Validasi Nama**: Nama mata pelajaran minimal 3 karakter dan tidak boleh duplikat
- **Validasi File**: File harus berformat JSON dan memiliki struktur yang benar
- **Preview**: Fitur preview menampilkan jumlah soal dan contoh soal pertama
- **Error Messages**: Pesan error yang jelas untuk berbagai kondisi

### 5. Fitur Tambahan

- **Local Storage**: Data mata pelajaran custom disimpan di memory browser (sementara)
- **Responsive Design**: Form responsive untuk berbagai ukuran layar
- **User Feedback**: Pesan sukses dan error yang informatif

### 6. File yang Dimodifikasi

1. **index.html**: Menambahkan form upload dan input nama mata pelajaran
2. **style.css**: Menambahkan styling untuk form baru
3. **app.js**: Menambahkan logika untuk:
   - Upload dan validasi JSON
   - Preview JSON
   - Penambahan mata pelajaran baru
   - Penyimpanan data custom
   - Render tombol dengan styling berbeda

### 7. Contoh File JSON Test

File `example_test.json` telah dibuat sebagai contoh dengan 3 soal test yang bisa digunakan untuk mencoba fitur upload.

### 8. Fitur Feedback dan Motivasi Baru

#### Feedback untuk Jawaban Benar ✅
- Pesan apresiasi yang bervariasi dan memotivasi
- Contoh: "🎉 Fantastic! Jawaban Anda tepat sekali!"
- 10+ variasi pesan apresiasi yang berbeda
- Menampilkan poin yang diperoleh dengan jelas

#### Feedback untuk Jawaban Salah ❌
- Pesan motivasi untuk tetap semangat belajar
- Contoh: "💪 Jangan menyerah! Setiap kesalahan adalah langkah menuju pemahaman yang lebih baik!"
- 10+ variasi pesan motivasi yang berbeda
- Tetap menunjukkan poin untuk pembelajaran

#### Feedback untuk Jawaban Sebagian Benar ⚖️
- Pesan khusus untuk jawaban yang benar sebagian
- Memberikan informasi berapa jawaban yang benar
- Mendorong untuk analisis lebih dalam

#### Statistik Akhir Komprehensif 📊
Setelah menyelesaikan semua soal, akan ditampilkan:

**Ringkasan Lengkap:**
- Total skor yang diperoleh
- Jumlah dan persentase jawaban benar/salah
- Detail poin dari jawaban benar dan salah
- Skor maksimal yang mungkin diperoleh

**Sistem Grading:**
- 90-100%: 🌟 EXCELLENT! (Hijau)
- 80-89%: 🎯 VERY GOOD! (Biru)
- 70-79%: 👍 GOOD! (Kuning)
- 60-69%: 📈 FAIR! (Orange)
- <60%: 💪 KEEP TRYING! (Merah)

**Pesan Motivasi Akhir:**
- Disesuaikan dengan performa
- Mendorong semangat belajar
- Memberikan saran untuk peningkatan

### 9. Contoh Tampilan Feedback

#### Jawaban Benar:
```
🎉 Fantastic! Jawaban Anda tepat sekali!
✅ Poin yang diperoleh: +3
```

#### Jawaban Salah:
```
💪 Jangan menyerah! Setiap kesalahan adalah langkah menuju pemahaman yang lebih baik!
❌ Poin: -1 | Jangan patah semangat!
```

#### Jawaban Sebagian Benar:
```
👍 Good attempt! Anda sudah benar sebagian, terus semangat!
⚖️ Benar: 2/4 | Poin: +3
```

#### Statistik Akhir:
```
🎉 UJIAN SELESAI! 🎉
Total Skor: 12

📊 Statistik Jawaban:
✅ Jawaban Benar: 4 soal (80%)
❌ Jawaban Salah: 1 soal (20%)
📝 Total Soal: 5 soal

🎯 Detail Poin:
💎 Poin dari Jawaban Benar: +14
💔 Poin Berkurang dari Salah: -2
🏆 Skor Maksimal Possible: 16

🎯 VERY GOOD! Hasil yang Sangat Memuaskan!
Hebat! Anda hampir sempurna. Sedikit lagi untuk mencapai level expert! Terus semangat! 💪
```

### 10. Fitur Penyimpanan Permanen 💾

#### LocalStorage Integration
- **Auto-Save**: Mata pelajaran yang diupload tersimpan otomatis
- **Persistent**: Data tidak hilang saat browser di-refresh atau ditutup
- **Auto-Load**: Mata pelajaran custom dimuat otomatis saat aplikasi dibuka

#### Management Features  
- **Individual Delete**: Tombol hapus (🗑️) untuk setiap mata pelajaran custom
- **Bulk Delete**: Hapus semua mata pelajaran custom sekaligus
- **Confirmation Dialogs**: Double-check sebelum menghapus data

#### Visual Indicators
- **Custom Badge**: Mata pelajaran custom ditandai dengan ✨ dan warna hijau
- **Tooltip**: Hover untuk melihat status "💾 Tersimpan Permanen"
- **Info Box**: Notifikasi di form upload tentang penyimpanan permanen

### 11. Workflow Penggunaan

#### Untuk Guru/Pengajar:
1. **Setup Awal**: Upload soal sekali di awal semester
2. **Penggunaan Berulang**: Akses soal kapan saja tanpa upload ulang
3. **Maintenance**: Tambah/hapus soal sesuai kebutuhan
4. **Persistensi**: Data tetap ada meskipun browser ditutup

#### Untuk Siswa:
1. **Koleksi Personal**: Kumpulkan soal dari berbagai sumber
2. **Bank Soal**: Build library soal untuk latihan mandiri
3. **Akses Mudah**: Tidak perlu upload ulang setiap kali belajar
4. **Organisasi**: Kelompokkan soal per mata pelajaran

## Catatan

- Data mata pelajaran custom disimpan sementara di memory browser
- Jika browser di-refresh, data custom akan hilang
- Untuk penyimpanan permanen, perlu implementasi backend atau localStorage
