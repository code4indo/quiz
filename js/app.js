// Latihan Ujian Interaktif - app.js (Subject Menu & Load by Code)

let allQuestions = []; // Store all loaded questions if needed, or just the current set
let questions = []; // Current active questions for the selected subject
let currentIndex = 0;
let userAnswers = [];
let userScores = [];
let quizFinished = false;

// --- DOM Elements ---
const subjectMenuSection = document.getElementById('subject-menu');
const subjectButtonsContainer = document.getElementById('subject-buttons');
const uploadSection = document.getElementById('upload-section'); // Keep reference if needed later
const quizSection = document.getElementById('quiz-section');
const fileInput = document.getElementById('file-input'); // Keep reference if needed later
const uploadError = document.getElementById('upload-error'); // Keep reference if needed later
const scoreInfo = document.getElementById('score-info');
const questionNav = document.getElementById('question-nav');
const questionBox = document.getElementById('question-box');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const optionsForm = document.getElementById('options-form');
const feedback = document.getElementById('feedback');
const pointInfo = document.getElementById('point-info');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');
const checkBtn = document.getElementById('check-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');

// --- Subject Data ---
const subjects = [
    { name: "Alqur'an Hadis", code: "001", file: "001_alquran_hadis2.json" },
    { name: "Akidah Akhlak", code: "002", file: "002_akhlak.json" }, // Placeholder filename
    { name: "Fikih", code: "003", file: "003_fikih.json" }, // Placeholder filename
    { name: "Sejarah Kebudayaan Islam", code: "004", file: "004_ski.json" }, // Placeholder filename
    { name: "Bahasa Indonesia", code: "005", file: "005_bindo2.json" },
    { name: "Matematika", code: "006", file: "006_mtk.json" }, // Placeholder filename
    { name: "IPA", code: "007", file: "007_ipa.json" }, // Placeholder filename
    { name: "IPS", code: "008", file: "008_ips.json" }, // Placeholder filename
    { name: "Pendidikan Pancasila", code: "009", file: "009_pancasila.json" }, // Placeholder filename
    { name: "Bahasa Inggris", code: "010", file: "010_bing.json" } // Placeholder filename
];

// --- Initialization ---
function initializeApp() {
    renderSubjectMenu();
    setupEventListeners();
    showSubjectMenu(); // Start by showing the menu
}

function renderSubjectMenu() {
    subjectButtonsContainer.innerHTML = ''; // Clear existing buttons
    subjects.forEach(subject => {
        const button = document.createElement('button');
        button.textContent = subject.name;
        button.dataset.subjectCode = subject.code;
        button.dataset.subjectFile = subject.file; // Store filename
        button.addEventListener('click', handleSubjectSelection);
        subjectButtonsContainer.appendChild(button);
    });
}

function setupEventListeners() {
    prevBtn.onclick = handlePrevClick;
    nextBtn.onclick = handleNextClick;
    resetBtn.onclick = handleResetClick;
    checkBtn.onclick = handleCheckClick;
    backToMenuBtn.onclick = showSubjectMenu; // Go back to menu
    // Remove or comment out file input listener if not used
    // fileInput.addEventListener('change', handleFileSelect);
}

// --- UI State Management ---
function showSubjectMenu() {
    subjectMenuSection.style.display = 'block';
    quizSection.style.display = 'none';
    uploadSection.style.display = 'none'; // Ensure upload is hidden
    resetQuizState(); // Clear previous quiz data when returning to menu
}

function showQuiz() {
    subjectMenuSection.style.display = 'none';
    quizSection.style.display = 'block';
    uploadSection.style.display = 'none';
}

// --- Event Handlers ---
async function handleSubjectSelection(event) {
    const subjectCode = event.target.dataset.subjectCode;
    const subjectFile = event.target.dataset.subjectFile;
    console.log(`Selected Subject Code: ${subjectCode}, File: ${subjectFile}`);

    // Basic check if a filename exists
    if (!subjectFile || subjectFile.includes("Placeholder")) {
        alert(`File soal untuk mata pelajaran ini (${event.target.textContent}) belum tersedia.`);
        return;
    }

    try {
        // Attempt to fetch the JSON file relative to the current HTML file
        const response = await fetch(subjectFile); // Assumes JSON files are in the same directory or accessible path
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Could not load ${subjectFile}`);
        }
        const data = await response.json();
        initializeQuiz(data); // Initialize quiz with fetched data
    } catch (error) {
        console.error("Error loading or parsing quiz file:", error);
        alert(`Gagal memuat file soal (${subjectFile}). Periksa konsol untuk detail.`);
        // Optionally show upload section as fallback or just stay on menu
        // showUpload(); // Or handle error differently
    }
}

// Comment out or remove handleFileSelect if file upload is removed
/*
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const data = JSON.parse(evt.target.result);
      initializeQuiz(data);
    } catch (err) {
      console.error("Error parsing JSON file:", err);
      uploadError.textContent = 'Gagal memproses file JSON. Pastikan formatnya benar.';
      showUpload(); // Or handle error differently
    }
  };
  reader.onerror = function() {
      console.error("Error reading file:", reader.error);
      uploadError.textContent = 'Gagal membaca file.';
      showUpload();
  };
  reader.readAsText(file);
}
*/

function handlePrevClick(e) {
    e.preventDefault();
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion(quizFinished); // Pass quizFinished status
        renderNav();
    }
}

function handleNextClick(e) {
    e.preventDefault();
    if (quizFinished) {
        // If quiz is finished, maybe cycle through answers or go back to menu?
        // For now, just allow moving if not at the end
        if (currentIndex < questions.length - 1) {
             currentIndex++;
             renderQuestion(true); // Show answers
             renderNav();
        }
        return; // Don't check answers again
    }

    if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
        renderNav();
    } else {
        // Reached the end, maybe offer to check all or finish?
        // For now, just stay on the last question until checked.
        // Or automatically trigger a final check/summary?
        alert("Ini adalah soal terakhir. Periksa jawaban Anda atau kembali ke menu.");
        // Consider adding a "Finish Quiz" button
    }
}

function handleResetClick(e) {
    e.preventDefault();
    if (quizFinished) return; // Don't reset if already checked final answers

    userAnswers[currentIndex] = []; // Reset answers for current question
    userScores[currentIndex] = 0; // Reset score for current question
    renderQuestion(); // Re-render without checked state or feedback
    updateScoreInfo();
}

function handleCheckClick(e) {
    e.preventDefault();
    if (quizFinished) return; // Don't re-check if already finished

    const checkboxes = optionsForm.querySelectorAll('input[name="option"]:checked');
    if (checkboxes.length === 0) {
        feedback.textContent = 'Silakan pilih setidaknya satu jawaban.';
        feedback.style.color = 'orange';
        return;
    }

    // Get user answers (array of keys)
    const currentAnswer = Array.from(checkboxes).map(cb => cb.value);
    userAnswers[currentIndex] = currentAnswer;

    const correct = questions[currentIndex].correct_answers || [];
    const pointsCorrect = questions[currentIndex].poin_benar || 2; // Default points
    const pointsIncorrect = questions[currentIndex].poin_salah || -1; // Default penalty

    // --- Scoring Logic ---
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    currentAnswer.forEach(ans => {
        if (correct.includes(ans)) {
            score += pointsCorrect;
            correctCount++;
        } else {
            score += pointsIncorrect; // Apply penalty for wrong selections
            incorrectCount++;
        }
    });

    // Optional: Penalize for missing correct answers if required by rules
    // correct.forEach(corrAns => {
    //     if (!currentAnswer.includes(corrAns)) {
    //         // Decide if there's a penalty for *missing* a correct answer
    //         // score += pointsMissed; // Example: pointsMissed could be 0 or negative
    //     }
    // });

    // Ensure score doesn't go below zero if that's a rule
    // score = Math.max(0, score);

    userScores[currentIndex] = score;

    // Provide feedback and update score display
    feedback.textContent = `Jawaban diperiksa. Poin untuk soal ini: ${score}`;
    feedback.style.color = '#4b6e4b'; // Green for success feedback
    pointInfo.textContent = `Poin: ${score} (Benar: ${pointsCorrect}, Salah: ${pointsIncorrect})`;
    updateScoreInfo(); // Update total score

    // Re-render the question showing correct/incorrect feedback
    renderQuestion(true); // Pass true to show answer highlights

    // Check if this was the last question
    if (currentIndex === questions.length - 1) {
        quizFinished = true;
        // Optionally disable check button, show final score, etc.
        checkBtn.disabled = true;
        resetBtn.disabled = true;
        showFinalScore();
    }
}


// --- Quiz Logic ---
function initializeQuiz(quizData) {
    if (!Array.isArray(quizData) || quizData.length === 0) {
        console.error("Invalid or empty quiz data received.");
        alert("Data soal tidak valid atau kosong.");
        showSubjectMenu(); // Go back if data is bad
        return;
    }
    questions = quizData.map((q, index) => ({
        ...q,
        // Assign default points if missing
        poin_benar: q.poin_benar !== undefined ? q.poin_benar : 2,
        poin_salah: q.poin_salah !== undefined ? q.poin_salah : -1,
        // Ensure options is an object
        options: q.options || {},
        // Ensure correct_answers is an array
        correct_answers: Array.isArray(q.correct_answers) ? q.correct_answers : []
    }));

    resetQuizState(); // Reset answers/scores for the new quiz
    showQuiz(); // Display the quiz section
    renderQuestion();
    renderNav();
    updateScoreInfo();
}

function resetQuizState() {
    currentIndex = 0;
    userAnswers = new Array(questions.length).fill([]); // Initialize with empty arrays
    userScores = new Array(questions.length).fill(0);
    quizFinished = false;
    // Re-enable buttons if they were disabled
    checkBtn.disabled = false;
    resetBtn.disabled = false;
    feedback.textContent = '';
    pointInfo.textContent = '';
    scoreInfo.textContent = ''; // Clear score initially
}


function renderQuestion(showAnswer = false) {
    if (!questions || questions.length === 0 || currentIndex >= questions.length) {
        console.warn("Attempted to render question with invalid state.");
        // Optionally display a message or go back to menu
        questionText.textContent = "Tidak ada soal untuk ditampilkan.";
        optionsForm.innerHTML = '';
        return;
    }

    const q = questions[currentIndex];
    questionNumber.textContent = `Soal ${currentIndex + 1} dari ${questions.length}`;
    questionText.textContent = q.question_text || "Teks soal tidak tersedia."; // Handle missing text
    optionsForm.innerHTML = ''; // Clear previous options

    const currentSelection = userAnswers[currentIndex] || [];
    const correctAnswers = q.correct_answers || [];

    // Check if options exist and is an object
    if (q.options && typeof q.options === 'object') {
        Object.entries(q.options).forEach(([key, opt]) => {
            const isChecked = currentSelection.includes(key);
            const isCorrect = correctAnswers.includes(key);

            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = 'option';
            input.value = key;
            input.checked = isChecked;
            input.disabled = showAnswer; // Disable checkboxes after checking

            label.appendChild(input);
            label.appendChild(document.createTextNode(` (${key.toUpperCase()}) ${opt}`));

            // Apply styling based on whether answers are shown
            if (showAnswer) {
                if (isChecked && isCorrect) {
                    label.style.background = '#d4edda'; // Green for correct selection
                    label.style.borderColor = '#c3e6cb';
                } else if (isChecked && !isCorrect) {
                    label.style.background = '#f8d7da'; // Red for incorrect selection
                    label.style.borderColor = '#f5c6cb';
                } else if (!isChecked && isCorrect) {
                    label.style.background = '#fff3cd'; // Yellow/Orange for missed correct answer
                    label.style.borderColor = '#ffeeba';
                } else {
                     // Style for options that were neither selected nor correct (optional)
                     label.style.background = '#f0f5eb'; // Default background
                     label.style.borderColor = '#e0e8db';
                }
            } else {
                 // Default style when not showing answers
                 label.style.background = '#f0f5eb';
                 label.style.borderColor = '#e0e8db';
            }

            // Common label styles (apply regardless of showAnswer state)
            label.style.display = 'block';
            label.style.marginBottom = '7px';
            label.style.cursor = showAnswer ? 'default' : 'pointer'; // Change cursor when disabled
            label.style.padding = '7px 10px';
            label.style.borderRadius = '6px';
            label.style.transition = 'background 0.2s, border 0.2s';

            // Hover effect only when not showing answers
            if (!showAnswer) {
                label.onmouseover = () => { if (!showAnswer) label.style.background = '#e5eddf'; };
                label.onmouseout = () => { if (!showAnswer) label.style.background = '#f0f5eb'; }; // Revert to default on mouse out
            }


            optionsForm.appendChild(label);
        });
    } else {
        optionsForm.innerHTML = 'Opsi jawaban tidak tersedia untuk soal ini.';
    }


    // Update point info text
    const pointsCorrect = q.poin_benar !== undefined ? q.poin_benar : 2;
    const pointsIncorrect = q.poin_salah !== undefined ? q.poin_salah : -1;
    pointInfo.textContent = `Poin: ${showAnswer ? userScores[currentIndex] : 0} (Benar: ${pointsCorrect}, Salah: ${pointsIncorrect})`;

    // Clear feedback if not showing answers
    if (!showAnswer) {
        feedback.textContent = '';
    }

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === questions.length - 1 && !quizFinished; // Disable next on last question only if quiz not finished
}


function renderNav() {
    questionNav.innerHTML = ''; // Clear previous nav buttons
    if (!questions || questions.length === 0) return;

    for (let i = 0; i < questions.length; i++) {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.disabled = (i === currentIndex); // Disable button for current question

        // Add styling based on answered status (optional)
        if (userAnswers[i] && userAnswers[i].length > 0) {
             // Maybe add a class or style if answered
             btn.style.fontWeight = 'bold'; // Example: bold if answered
        }
        if (quizFinished) {
             // Style based on correctness after finishing
             const correct = questions[i].correct_answers || [];
             const answered = userAnswers[i] || [];
             const isFullyCorrect = answered.length === correct.length && answered.every(a => correct.includes(a));
             if (isFullyCorrect) {
                 btn.style.backgroundColor = '#d4edda'; // Green if correct
             } else if (answered.length > 0) {
                 btn.style.backgroundColor = '#f8d7da'; // Red if answered but incorrect
             }
        }


        btn.onclick = () => {
            currentIndex = i;
            renderQuestion(quizFinished); // Show answers if quiz is finished
            renderNav(); // Re-render nav to update disabled state
        };
        questionNav.appendChild(btn);
    }
}

function updateScoreInfo() {
    if (!questions || questions.length === 0) {
        scoreInfo.textContent = '';
        return;
    };
    const totalScore = userScores.reduce((a, b) => a + b, 0);
    // Calculate max possible score based on defined points
    const maxTotalScore = questions.reduce((sum, q) => {
        const pointsCorrect = q.poin_benar !== undefined ? q.poin_benar : 2;
        const correctAnswersCount = Array.isArray(q.correct_answers) ? q.correct_answers.length : 0;
        return sum + (correctAnswersCount * pointsCorrect);
    }, 0);

    scoreInfo.textContent = `Total Poin: ${totalScore} / ${maxTotalScore}`;
}


// Tampilkan skor akhir setelah quiz selesai
function showFinalScore() {
    updateScoreInfo(); // Ensure final score is displayed
    feedback.textContent = `Ujian Selesai! Skor Akhir Anda: ${userScores.reduce((a, b) => a + b, 0)}`;
    feedback.style.color = '#17a2b8'; // Info color
    // Optionally, disable navigation buttons or change their behavior
    // nextBtn.disabled = true; // Example
}


// --- Start the App ---
initializeApp();