// Latihan Ujian Interaktif - app.js (indikator warna jawaban benar/salah setelah periksa)


let questions = [];
let currentIndex = 0;
let userAnswers = [];
let userScores = [];
let quizFinished = false;

// --- Upload logic ---
const uploadSection = document.getElementById('upload-section');
const quizSection = document.getElementById('quiz-section');
const fileInput = document.getElementById('file-input');
const uploadError = document.getElementById('upload-error');

fileInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const data = JSON.parse(evt.target.result);
      if (!Array.isArray(data) || !data[0] || !data[0].question_text) {
        uploadError.textContent = 'Format file tidak valid!';
        return;
      }
      questions = data;
      // Set default poin jika belum ada (positif: 2, negatif: -1)
      questions.forEach(q => {
        if (typeof q.poin_benar !== 'number') q.poin_benar = 2;
        if (typeof q.poin_salah !== 'number') q.poin_salah = -1;
      });
      userAnswers = Array(questions.length).fill(null);
      userScores = Array(questions.length).fill(0);
      currentIndex = 0;
      quizFinished = false;
      // Reset feedback dan skor info
      document.getElementById('feedback').textContent = '';
      document.getElementById('score-info').textContent = '';
      document.getElementById('point-info').textContent = '';
      const endScore = document.getElementById('end-score');
      if (endScore) endScore.remove();
      // Sembunyikan upload, tampilkan quiz
      uploadSection.style.display = 'none';
      quizSection.style.display = '';
      // Langsung render quiz pertama
      renderQuestion();
      renderNav();
      updateScoreInfo();
    } catch (err) {
      uploadError.textContent = 'Gagal membaca file: ' + err.message;
    }
  };
  reader.readAsText(file);
});

function renderQuestion(showAnswer = false) {
  if (!questions.length) return;
  const q = questions[currentIndex];
  document.getElementById('question-number').textContent = `Soal ${currentIndex + 1} dari ${questions.length}`;
  document.getElementById('question-text').textContent = q.question_text;
  const form = document.getElementById('options-form');
  form.innerHTML = '';
  Object.entries(q.options).forEach(([key, opt]) => {
    const checked = userAnswers[currentIndex] && userAnswers[currentIndex].includes(key) ? 'checked' : '';
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.padding = '2px 6px';
    label.style.borderRadius = '5px';
    label.style.marginBottom = '4px';
    label.style.transition = 'background 0.2s';
    label.innerHTML = `<input type="checkbox" name="option" value="${key}" ${checked}> (${key.toUpperCase()}) ${opt}`;
    if (showAnswer) {
      if (q.correct_answers.includes(key)) {
        label.style.background = '#d4edda'; // hijau muda untuk jawaban benar
        label.style.border = '1px solid #28a745';
      }
      if (userAnswers[currentIndex] && userAnswers[currentIndex].includes(key) && !q.correct_answers.includes(key)) {
        label.style.background = '#f8d7da'; // merah muda untuk jawaban salah
        label.style.border = '1px solid #dc3545';
      }
    }
    form.appendChild(label);
    form.appendChild(document.createElement('br'));
  });
  document.getElementById('feedback').textContent = '';
  document.getElementById('point-info').textContent = `Poin: ${userScores[currentIndex]} (Benar: ${questions[currentIndex].poin_benar}, Salah: ${questions[currentIndex].poin_salah})`;

  // Listener agar jawaban user langsung tersimpan saat klik
  if (!showAnswer) {
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const checkedBoxes = Array.from(form.querySelectorAll('input[name="option"]:checked')).map(cb => cb.value);
        userAnswers[currentIndex] = checkedBoxes;
      });
    });
  }
}

function renderNav() {
  const nav = document.getElementById('question-nav');
  nav.innerHTML = '';
  if (!questions.length) return;
  for (let i = 0; i < questions.length; i++) {
    const btn = document.createElement('button');
    btn.textContent = i + 1;
    btn.disabled = (i === currentIndex);
    btn.onclick = () => {
      currentIndex = i;
      renderQuestion();
      renderNav();
      updateScoreInfo();
    };
    nav.appendChild(btn);
  }
}

function updateScoreInfo() {
  if (!questions.length) return;
  const total = userScores.reduce((a, b) => a + b, 0);
  const maxTotal = questions.reduce((sum, q) => sum + (q.correct_answers ? q.correct_answers.length * (q.poin_benar || 2) : 0), 0);
  document.getElementById('score-info').textContent = `Total Poin: ${total} / ${maxTotal}`;
}


// Tombol quiz (hanya aktif setelah upload)
function setQuizButtonHandlers() {
  document.getElementById('prev-btn').onclick = (e) => {
    e.preventDefault();
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
      renderNav();
      updateScoreInfo();
    }
  };

  document.getElementById('next-btn').onclick = (e) => {
    e.preventDefault();
    if (quizFinished) return;
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
      renderNav();
      updateScoreInfo();
    } else if (currentIndex === questions.length - 1) {
      // Selesai, tampilkan skor akhir
      showFinalScore();
    }
  };

  document.getElementById('reset-btn').onclick = (e) => {
    e.preventDefault();
    userAnswers[currentIndex] = null;
    userScores[currentIndex] = 0;
    renderQuestion();
    updateScoreInfo();
  };

  document.getElementById('check-btn').onclick = (e) => {
    e.preventDefault();
    if (quizFinished) return;
    const form = document.getElementById('options-form');
    const checkboxes = form.querySelectorAll('input[name="option"]:checked');
    const feedback = document.getElementById('feedback');
    if (checkboxes.length === 0) {
      feedback.textContent = 'Silakan pilih jawaban dulu!';
      return;
    }
    // Ambil jawaban user (array of key)
    const ans = Array.from(checkboxes).map(cb => cb.value);
    userAnswers[currentIndex] = ans;
    const correct = questions[currentIndex].correct_answers;
    // Hitung skor: +poin_benar untuk setiap jawaban benar, +poin_salah untuk setiap jawaban salah
    let score = 0;
    ans.forEach(a => {
      if (correct.includes(a)) score += questions[currentIndex].poin_benar;
      else score += questions[currentIndex].poin_salah;
    });
    // Jika user tidak memilih semua jawaban benar, kurangi poin_benar untuk setiap jawaban benar yang tidak dipilih
    correct.forEach(c => {
      if (!ans.includes(c)) score += questions[currentIndex].poin_salah;
    });
    feedback.textContent = `Poin untuk soal ini: ${score} (Benar: ${questions[currentIndex].poin_benar}, Salah: ${questions[currentIndex].poin_salah})`;
    userScores[currentIndex] = score;
    document.getElementById('point-info').textContent = `Poin: ${score} (Benar: ${questions[currentIndex].poin_benar}, Salah: ${questions[currentIndex].poin_salah})`;
    updateScoreInfo();
    // Tampilkan warna indikator jawaban benar/salah
    renderQuestion(true);
  };

// Tampilkan skor akhir setelah quiz selesai
function showFinalScore() {
  quizFinished = true;
  // Disable tombol quiz
  document.getElementById('prev-btn').disabled = true;
  document.getElementById('next-btn').disabled = true;
  document.getElementById('reset-btn').disabled = true;
  document.getElementById('check-btn').disabled = true;
  // Tampilkan skor akhir
  const total = userScores.reduce((a, b) => a + b, 0);
  const maxTotal = questions.reduce((sum, q) => sum + (q.correct_answers ? q.correct_answers.length * (q.poin_benar || 2) : 0), 0);
  let endScore = document.getElementById('end-score');
  if (!endScore) {
    endScore = document.createElement('div');
    endScore.id = 'end-score';
    endScore.style.margin = '24px 0 0 0';
    endScore.style.textAlign = 'center';
    endScore.style.fontSize = '1.25em';
    endScore.style.fontWeight = 'bold';
    endScore.style.color = '#205b2a';
    quizSection.appendChild(endScore);
  }
  endScore.innerHTML = `Quiz selesai!<br>Skor akhir Anda: <span style="color:#17421d;">${total}</span> dari <span style="color:#254525;">${maxTotal}</span>`;
}
}

// Inisialisasi handler tombol quiz setelah DOM siap
setQuizButtonHandlers();