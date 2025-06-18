# Fitur Nomor Soal Berwarna

## Deskripsi Fitur
Fitur ini menambahkan indikator visual berupa perubahan warna pada nomor soal berdasarkan status jawaban user:

### Warna Status:
- **🔴 Merah** - Jawaban salah (incorrect)
- **🟢 Hijau** - Jawaban benar (correct) 
- **⚫ Abu-abu** - Belum dijawab (unanswered)

## Implementasi

### 1. CSS Classes yang Ditambahkan
Di file `css/style.css`:
```css
/* Status classes untuk nomor soal */
#question-number.correct-answer {
  color: #28a745;
  font-weight: 600;
}

#question-number.incorrect-answer {
  color: #dc3545;
  font-weight: 600;
}

#question-number.unanswered {
  color: #7b8b6f;
}

/* CSS untuk tombol navigasi */
#question-nav button.nav-correct {
  background: #d4edda;
  border: 1px solid #28a745;
  color: #205b2a;
  font-weight: bold;
}

#question-nav button.nav-incorrect {
  background: #f8d7da;
  border: 1px solid #dc3545;
  color: #a12d2d;
  font-weight: bold;
}

#question-nav button.nav-unanswered {
  background: #e0e8db;
  color: #3a4d39;
}
```

### 2. JavaScript Logic yang Ditambahkan
Di file `js/app.js`:

#### Variabel Tracking Status
```javascript
let questionStatuses = []; // Track answer status for each question: 'correct', 'incorrect', 'unanswered'
```

#### Fungsi Update Status
```javascript
function updateQuestionNumberStatus() {
    // Remove all status classes first
    questionNumber.classList.remove('correct-answer', 'incorrect-answer', 'unanswered');
    
    // Get current question status
    const status = questionStatuses[currentIndex] || 'unanswered';
    
    // Add appropriate class
    questionNumber.classList.add(status);
}
```

#### Update di handleCheckClick
```javascript
// Update question status for visual feedback
questionStatuses[currentIndex] = isCorrectAnswer ? 'correct-answer' : 'incorrect-answer';
```

### 3. Integrasi dengan Sistem Navigasi
- Tombol navigasi soal juga menampilkan warna sesuai status
- Konsistensi visual antara nomor soal dan navigasi
- Reset status ketika user reset jawaban

## Cara Kerja
1. Saat user menjawab soal dan menekan "Periksa Jawaban"
2. Sistem mengevaluasi jawaban benar/salah
3. Status disimpan di array `questionStatuses[currentIndex]`
4. Fungsi `updateQuestionNumberStatus()` dipanggil di `renderQuestion()`
5. CSS class yang sesuai ditambahkan ke element nomor soal
6. Navigasi soal juga diupdate dengan warna yang sama

## Fitur Tambahan
- Animasi transisi halus dengan `transition: color 0.3s ease`
- Font weight lebih tebal untuk jawaban yang sudah diperiksa
- Konsistensi dengan sistem scoring yang sudah ada
- Reset status saat user reset jawaban individual

## Manfaat
- **Visual Feedback**: User dapat langsung melihat status jawaban
- **Navigasi Mudah**: Identifikasi cepat soal mana yang salah/benar
- **Progress Tracking**: Memudahkan review jawaban
- **UX Enhancement**: Interface lebih informatif dan user-friendly
