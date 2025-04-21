// Latihan Ujian Interaktif - app.js (indikator warna jawaban benar/salah setelah periksa)

let questions = [];
let currentIndex = 0;
let userAnswers = [];
let userScores = [];

fetch('exam.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    userAnswers = Array(questions.length).fill(null);
    userScores = Array(questions.length).fill(0);
    renderQuestion();
    renderNav();
    updateScoreInfo();
  });

function renderQuestion(showAnswer = false) {
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
    label.innerHTML = `<input type=\"checkbox\" name=\"option\" value=\"${key}\" ${checked}> (${key.toUpperCase()}) ${opt}`;
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
  document.getElementById('point-info').textContent = `Poin: ${userScores[currentIndex]} / ${questions[currentIndex].correct_answers.length}`;

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
  const total = userScores.reduce((a, b) => a + b, 0);
  const maxTotal = questions.reduce((sum, q) => sum + (q.correct_answers ? q.correct_answers.length : 0), 0);
  document.getElementById('score-info').textContent = `Total Poin: ${total} / ${maxTotal}`;
}

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
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
    renderNav();
    updateScoreInfo();
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
  // Hitung skor: +1 untuk setiap jawaban benar, -1 untuk setiap jawaban salah
  let score = 0;
  ans.forEach(a => {
    if (correct.includes(a)) score += 1;
    else score -= 1;
  });
  feedback.textContent = `Poin untuk soal ini: ${score} dari ${correct.length}`;
  userScores[currentIndex] = score;
  document.getElementById('point-info').textContent = `Poin: ${score} / ${correct.length}`;
  updateScoreInfo();
  // Tampilkan warna indikator jawaban benar/salah
  renderQuestion(true);
};