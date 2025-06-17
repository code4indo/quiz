# Panduan Format JSON untuk Soal Ujian

## 📋 Pengantar

Dokumen ini menjelaskan format JSON yang harus dipatuhi untuk membuat file soal ujian yang kompatibel dengan aplikasi **Latihan Ujian Interaktif**. Pastikan untuk mengikuti struktur dan aturan yang dijelaskan di bawah ini agar file JSON dapat dimuat dengan benar.

## 🏗️ Struktur Dasar JSON

File JSON harus berupa **array** yang berisi objek-objek soal. Setiap objek soal mewakili satu pertanyaan dalam ujian.

```json
[
  {
    // Soal pertama
  },
  {
    // Soal kedua
  },
  {
    // Dan seterusnya...
  }
]
```

## 📝 Format Objek Soal

Setiap objek soal **WAJIB** memiliki properti-properti berikut:

### Properti Wajib

| Properti | Tipe Data | Deskripsi | Contoh |
|----------|-----------|-----------|---------|
| `id` | number | ID unik untuk setiap soal | `1`, `2`, `3` |
| `question_text` | string | Teks pertanyaan soal | `"Apa ibu kota Indonesia?"` |
| `options` | object | Objek berisi pilihan jawaban | `{"a": "Jakarta", "b": "Bandung"}` |
| `correct_answers` | array | Array berisi kunci jawaban yang benar | `["a"]` atau `["a", "c"]` |

### Properti Opsional

| Properti | Tipe Data | Default | Deskripsi |
|----------|-----------|---------|-----------|
| `chapter_source` | string | `""` | Sumber atau bab asal soal |
| `poin_benar` | number | `2` | Poin yang didapat untuk jawaban benar |
| `poin_salah` | number | `-1` | Poin yang dikurangi untuk jawaban salah |

## ✅ Contoh Format JSON yang Benar

### Contoh 1: Soal Pilihan Tunggal
```json
[
  {
    "id": 1,
    "chapter_source": "Bab 1: Geografi Indonesia",
    "question_text": "Apa ibu kota Indonesia?",
    "options": {
      "a": "Bandung",
      "b": "Jakarta",
      "c": "Surabaya",
      "d": "Medan"
    },
    "correct_answers": ["b"],
    "poin_benar": 2,
    "poin_salah": -1
  }
]
```

### Contoh 2: Soal Pilihan Ganda (Multiple Choice)
```json
[
  {
    "id": 2,
    "chapter_source": "Bab 2: Pulau-pulau Indonesia",
    "question_text": "Manakah yang termasuk pulau besar di Indonesia? (Pilih lebih dari satu)",
    "options": {
      "a": "Jawa",
      "b": "Sumatra",
      "c": "Kalimantan",
      "d": "Bali",
      "e": "Papua"
    },
    "correct_answers": ["a", "b", "c", "e"],
    "poin_benar": 1,
    "poin_salah": -0.5
  }
]
```

### Contoh 3: File JSON Lengkap dengan Beberapa Soal
```json
[
  {
    "id": 1,
    "chapter_source": "Sejarah Indonesia",
    "question_text": "Siapa proklamator kemerdekaan Indonesia?",
    "options": {
      "a": "Soekarno dan Hatta",
      "b": "Soeharto dan Habibie",
      "c": "Megawati dan SBY",
      "d": "Jokowi dan Prabowo"
    },
    "correct_answers": ["a"],
    "poin_benar": 3,
    "poin_salah": -1
  },
  {
    "id": 2,
    "chapter_source": "Geografi Indonesia",
    "question_text": "Indonesia terletak di antara dua benua, yaitu:",
    "options": {
      "a": "Asia dan Afrika",
      "b": "Asia dan Australia",
      "c": "Australia dan Amerika",
      "d": "Asia dan Eropa"
    },
    "correct_answers": ["b"],
    "poin_benar": 2,
    "poin_salah": -1
  },
  {
    "id": 3,
    "chapter_source": "Ekonomi Indonesia", 
    "question_text": "Berikut yang termasuk sumber daya alam Indonesia adalah: (Pilih semua yang benar)",
    "options": {
      "a": "Minyak bumi",
      "b": "Gas alam", 
      "c": "Batubara",
      "d": "Emas",
      "e": "Uranium"
    },
    "correct_answers": ["a", "b", "c", "d"],
    "poin_benar": 1,
    "poin_salah": -0.25
  }
]
```

## ⚠️ Aturan dan Batasan

### 1. Struktur Dasar
- File harus berformat JSON yang valid
- Root element harus berupa array `[]`
- Minimal harus ada 1 soal dalam array
- Maksimal direkomendasikan 100 soal per file

### 2. ID Soal
- Harus berupa angka (number)
- Harus unik dalam satu file
- Direkomendasikan urut dari 1, 2, 3, dst.

### 3. Pertanyaan (`question_text`)
- Tidak boleh kosong
- Maksimal 1000 karakter
- Boleh menggunakan karakter khusus dan emoji
- Boleh menggunakan format HTML sederhana (bold, italic)

### 4. Pilihan Jawaban (`options`)
- Minimal 2 pilihan (a, b)
- Maksimal 8 pilihan (a, b, c, d, e, f, g, h)
- Key harus berupa huruf kecil (a, b, c, d, dst.)
- Value tidak boleh kosong
- Setiap pilihan maksimal 500 karakter

### 5. Jawaban Benar (`correct_answers`)
- Harus berupa array, meskipun hanya 1 jawaban
- Key yang disebutkan harus ada di `options`
- Minimal 1 jawaban benar
- Maksimal semua pilihan bisa benar

### 6. Sistem Poin
- `poin_benar`: Angka positif atau 0
- `poin_salah`: Biasanya negatif atau 0
- Boleh menggunakan desimal (contoh: 1.5, -0.5)

## 🎯 Fitur Feedback dan Motivasi

Aplikasi akan memberikan feedback yang berbeda berdasarkan hasil jawaban:

### Jenis Feedback
1. **Jawaban Benar (100%)**: Pesan apresiasi dengan emoji celebrasi
2. **Jawaban Sebagian Benar**: Pesan motivasi untuk melengkapi
3. **Jawaban Salah**: Pesan motivasi untuk tetap semangat
4. **Statistik Akhir**: Ringkasan komprehensif dengan grading

### Sistem Poin untuk Feedback
```json
{
  "poin_benar": 3,    // Poin positif untuk jawaban benar
  "poin_salah": -1    // Poin negatif untuk jawaban salah
}
```

**Tips**: Atur `poin_benar` dan `poin_salah` sesuai tingkat kesulitan soal.

## ❌ Contoh Format JSON yang Salah

### ❌ Salah: Missing Required Fields
```json
[
  {
    "id": 1,
    "question_text": "Pertanyaan tanpa options dan correct_answers"
  }
]
```

### ❌ Salah: Wrong Data Types
```json
[
  {
    "id": "1",  // ❌ Harus number, bukan string
    "question_text": 123,  // ❌ Harus string, bukan number
    "options": "a,b,c,d",  // ❌ Harus object, bukan string
    "correct_answers": "a"  // ❌ Harus array, bukan string
  }
]
```

### ❌ Salah: Invalid Structure
```json
{  // ❌ Root harus array, bukan object
  "soal1": {
    "id": 1,
    "question_text": "Pertanyaan 1"
  }
}
```

## 🔧 Tools untuk Validasi JSON

### 1. Online JSON Validators
- [JSONLint](https://jsonlint.com/)
- [JSON Formatter & Validator](https://jsonformatter.curiousconcept.com/)

### 2. Text Editors dengan JSON Support
- Visual Studio Code
- Sublime Text
- Notepad++

### 3. Command Line Tools
```bash
# Validasi dengan Python
python -m json.tool file.json

# Validasi dengan Node.js
node -e "JSON.parse(require('fs').readFileSync('file.json'))"
```

## 📁 Contoh Penamaan File

Gunakan penamaan file yang deskriptif:
- `001_matematika_kelas_10.json`
- `002_fisika_semester_1.json`
- `geografi_indonesia.json`
- `test_bahasa_inggris.json`

## 🎯 Tips Praktis

1. **Gunakan Editor dengan Syntax Highlighting**: VS Code, Sublime Text
2. **Validasi Sebelum Upload**: Selalu cek format JSON sebelum mengupload
3. **Backup File**: Simpan backup file JSON Anda
4. **Consistent Formatting**: Gunakan indentasi yang konsisten (2 atau 4 spasi)
5. **Unicode Support**: File mendukung karakter Unicode (Arab, Jawa, dll.)

## 🚀 Template Kosong

Berikut template kosong yang bisa Anda gunakan:

```json
[
  {
    "id": 1,
    "chapter_source": "",
    "question_text": "",
    "options": {
      "a": "",
      "b": "",
      "c": "",
      "d": ""
    },
    "correct_answers": [""],
    "poin_benar": 2,
    "poin_salah": -1
  }
]
```

## 📞 Support

Jika mengalami masalah dengan format JSON:
1. Periksa kembali struktur sesuai panduan ini
2. Gunakan JSON validator online
3. Lihat contoh file JSON yang sudah ada di aplikasi
4. Pastikan encoding file adalah UTF-8

---

**Catatan**: Panduan ini berlaku untuk aplikasi Latihan Ujian Interaktif versi terbaru. Selalu gunakan format terbaru untuk kompatibilitas optimal.
