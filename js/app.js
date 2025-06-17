// Latihan Ujian Interaktif - app.js (Subject Menu & Load by Code)

let allQuestions = []; // Store all loaded questions if needed, or just the current set
let questions = []; // Current active questions for the selected subject
let currentIndex = 0;
let userAnswers = [];
let userScores = [];
let quizFinished = false;

// Timer variables
let questionStartTime = 0;
let totalStartTime = 0;
let questionTimerInterval = null;
let totalTimerInterval = null;
let questionTimes = []; // Store time spent on each question
let totalTimeSpent = 0;

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
const explanationBox = document.getElementById('explanation-box');
const explanationContent = document.getElementById('explanation-content');
const questionTimer = document.getElementById('question-timer');
const totalTimer = document.getElementById('total-timer');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');
const checkBtn = document.getElementById('check-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');

// New subject form elements
const subjectNameInput = document.getElementById('subject-name');
const jsonFileInput = document.getElementById('json-file');
const addSubjectBtn = document.getElementById('add-subject-btn');
const previewJsonBtn = document.getElementById('preview-json-btn');
const addSubjectError = document.getElementById('add-subject-error');
const addSubjectSuccess = document.getElementById('add-subject-success');

// --- Subject Data ---
let subjects = [
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

// Storage for uploaded JSON data
let uploadedSubjects = new Map(); // Store uploaded JSON data by subject name

// --- Initialization ---
function initializeApp() {
    loadCustomSubjectsFromStorage(); // Load custom subjects from localStorage
    renderSubjectMenu();
    setupEventListeners();
    showSubjectMenu(); // Start by showing the menu
}

function renderSubjectMenu() {
    subjectButtonsContainer.innerHTML = ''; // Clear existing buttons
    subjects.forEach(subject => {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.marginBottom = '8px';
        buttonContainer.style.gap = '8px';
        
        const button = document.createElement('button');
        button.textContent = subject.name;
        button.dataset.subjectCode = subject.code;
        button.dataset.subjectFile = subject.file; // Store filename
        button.dataset.isCustom = subject.isCustom || false; // Mark if it's custom
        
        // Add different styling for custom subjects
        if (subject.isCustom) {
            button.classList.add('custom-subject');
            button.style.backgroundColor = '#28a745';
            button.style.color = 'white';
            button.title = 'Mata pelajaran yang ditambahkan pengguna (tersimpan permanen)';
            
            // Add delete button for custom subjects
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.title = `Hapus mata pelajaran "${subject.name}"`;
            deleteBtn.style.backgroundColor = '#dc3545';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.borderRadius = '4px';
            deleteBtn.style.padding = '5px 8px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.fontSize = '14px';
            
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Apakah Anda yakin ingin menghapus mata pelajaran "${subject.name}"?\n\nData soal akan hilang permanen.`)) {
                    deleteCustomSubjectFromStorage(subject.name);
                    renderSubjectMenu();
                    showSuccess(`Mata pelajaran "${subject.name}" berhasil dihapus.`);
                }
            };
            
            buttonContainer.appendChild(button);
            buttonContainer.appendChild(deleteBtn);
        } else {
            buttonContainer.appendChild(button);
        }
        
        button.addEventListener('click', handleSubjectSelection);
        subjectButtonsContainer.appendChild(buttonContainer);
    });
    
    // Add management buttons for custom subjects
    if (subjects.some(subject => subject.isCustom)) {
        const managementContainer = document.createElement('div');
        managementContainer.style.marginTop = '20px';
        managementContainer.style.textAlign = 'center';
        managementContainer.style.borderTop = '1px solid #ddd';
        managementContainer.style.paddingTop = '15px';
        
        const clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = '🗑️ Hapus Semua Mata Pelajaran Custom';
        clearAllBtn.style.backgroundColor = '#dc3545';
        clearAllBtn.style.color = 'white';
        clearAllBtn.style.border = 'none';
        clearAllBtn.style.padding = '8px 15px';
        clearAllBtn.style.borderRadius = '5px';
        clearAllBtn.style.cursor = 'pointer';
        clearAllBtn.style.fontSize = '14px';
        
        clearAllBtn.onclick = () => {
            const customCount = subjects.filter(s => s.isCustom).length;
            if (confirm(`Apakah Anda yakin ingin menghapus SEMUA ${customCount} mata pelajaran custom?\n\nSemua data soal akan hilang permanen.`)) {
                clearAllCustomSubjects();
                renderSubjectMenu();
                showSuccess('Semua mata pelajaran custom berhasil dihapus.');
            }
        };
        
        managementContainer.appendChild(clearAllBtn);
        subjectButtonsContainer.appendChild(managementContainer);
    }
}

function setupEventListeners() {
    prevBtn.onclick = handlePrevClick;
    nextBtn.onclick = handleNextClick;
    resetBtn.onclick = handleResetClick;
    checkBtn.onclick = handleCheckClick;
    backToMenuBtn.onclick = () => {
        // Stop all timers when going back to menu
        stopQuestionTimer();
        stopTotalTimer();
        showSubjectMenu();
    };
    
    // Add new subject form event listeners
    addSubjectBtn.onclick = handleAddSubject;
    previewJsonBtn.onclick = handlePreviewJson;
    jsonFileInput.addEventListener('change', handleJsonFileSelect);
    
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
    const subjectName = event.target.textContent;
    const isCustom = event.target.dataset.isCustom === 'true';
    
    console.log(`Selected Subject Code: ${subjectCode}, File: ${subjectFile}, Custom: ${isCustom}`);

    // Check if it's a custom uploaded subject
    if (isCustom && uploadedSubjects.has(subjectName)) {
        const data = uploadedSubjects.get(subjectName);
        initializeQuiz(data);
        return;
    }

    // Basic check if a filename exists for regular subjects
    if (!subjectFile || subjectFile.includes("Placeholder")) {
        alert(`File soal untuk mata pelajaran ini (${subjectName}) belum tersedia.`);
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
    
    // Stop timer for current question before moving
    stopQuestionTimer();
    
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion(quizFinished); // Pass quizFinished status
        renderNav();
        // Start timer for new question (only if quiz not finished)
        if (!quizFinished) {
            startQuestionTimer();
        }
    }
}

function handleNextClick(e) {
    e.preventDefault();
    
    // Stop timer for current question before moving
    stopQuestionTimer();
    
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
        // Start timer for new question
        startQuestionTimer();
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
    // });    // Ensure score doesn't go below zero if that's a rule
    // score = Math.max(0, score);
    
    userScores[currentIndex] = score;
    
    // Debug logging
    console.log(`Question ${currentIndex + 1}:`, {
        userAnswer: currentAnswer,
        correctAnswers: correct,
        score: score,
        pointsCorrect: pointsCorrect,
        pointsIncorrect: pointsIncorrect,
        correctCount: correctCount,
        incorrectCount: incorrectCount
    });    // Determine if answer is correct and provide appropriate feedback
    const isCorrectAnswer = correctCount > 0 && incorrectCount === 0 && correctCount === correct.length;
    const feedbackMessage = generateFeedbackMessage(isCorrectAnswer, score, correctCount, incorrectCount, correct.length);
      feedback.innerHTML = feedbackMessage.text;
    feedback.style.color = feedbackMessage.color;
    
    // Show explanation in side panel and legacy box if available
    const explanation = questions[currentIndex].explanation;
    updateExplanationPanel(explanation, true);
    
    // Legacy explanation box support
    if (explanationBox) {
        if (explanation && explanation.trim() !== '') {
            explanationBox.innerHTML = `
                <div style="margin-top: 15px; padding: 15px; background-color: #e8f4f8; border-left: 4px solid #17a2b8; border-radius: 5px;">
                    <div style="margin-bottom: 8px;">
                        <strong style="color: #17a2b8; font-size: 16px;">💡 Penjelasan:</strong>
                    </div>
                    <div style="color: #2c3e50; line-height: 1.6; font-size: 15px;">
                        ${explanation}
                    </div>
                </div>
            `;
            explanationBox.style.display = 'block';
        } else {
            explanationBox.style.display = 'none';
        }
    }
    
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
    
    // Start timers when quiz begins
    startTotalTimer();
    startQuestionTimer();
}

function resetQuizState() {
    currentIndex = 0;
    userAnswers = new Array(questions.length).fill([]); // Initialize with empty arrays
    userScores = new Array(questions.length).fill(0);
    quizFinished = false;    // Re-enable buttons if they were disabled
    checkBtn.disabled = false;
    resetBtn.disabled = false;
    feedback.textContent = '';
    pointInfo.textContent = '';
    // Reset old explanation box (legacy)
    if (explanationBox) explanationBox.style.display = 'none';
    scoreInfo.textContent = ''; // Clear score initially
    
    // Reset timers and side panel
    resetTimers();
    clearExplanationPanel();
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
    pointInfo.textContent = `Poin: ${showAnswer ? userScores[currentIndex] : 0} (Benar: ${pointsCorrect}, Salah: ${pointsIncorrect})`;    // Clear feedback if not showing answers
    if (!showAnswer) {
        feedback.textContent = '';
        // Clear old explanation box (legacy support)
        if (explanationBox) explanationBox.style.display = 'none';
        // Update side panel
        updateExplanationPanel(null, false);
    } else {
        // Show explanation in side panel if available and answers are being shown
        const explanation = q.explanation;
        updateExplanationPanel(explanation, true);
        
        // Legacy explanation box support (keep for backward compatibility)
        if (explanationBox) {
            if (explanation && explanation.trim() !== '') {
                explanationBox.innerHTML = `
                    <div style="margin-top: 15px; padding: 15px; background-color: #e8f4f8; border-left: 4px solid #17a2b8; border-radius: 5px;">
                        <div style="margin-bottom: 8px;">
                            <strong style="color: #17a2b8; font-size: 16px;">💡 Penjelasan:</strong>
                        </div>
                        <div style="color: #2c3e50; line-height: 1.6; font-size: 15px;">
                            ${explanation}
                        </div>
                    </div>
                `;
                explanationBox.style.display = 'block';
            } else {
                explanationBox.style.display = 'none';
            }
        }
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
        }        btn.onclick = () => {
            // Stop timer for current question before moving
            stopQuestionTimer();
            
            currentIndex = i;
            renderQuestion(quizFinished); // Show answers if quiz is finished
            renderNav(); // Re-render nav to update disabled state
            
            // Start timer for new question (only if quiz not finished)
            if (!quizFinished) {
                startQuestionTimer();
            }
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
    // Stop all timers when quiz finishes
    stopQuestionTimer();
    stopTotalTimer();
    
    updateScoreInfo(); // Ensure final score is displayed
    
    // Calculate comprehensive statistics including timing
    const stats = calculateFinalStatistics();
    
    // Calculate timing statistics
    const avgTimePerQuestion = totalTimeSpent > 0 ? Math.round(totalTimeSpent / questions.length) : 0;
    const totalTimeFormatted = formatTime(totalTimeSpent);
    
    // Create detailed final score message with timing
    const finalMessage = `
        <div style="text-align: center; padding: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #f8f9fa; margin: 10px 0;">
            <h3 style="color: #007bff; margin-bottom: 15px;">🎉 UJIAN SELESAI! 🎉</h3>
            
            <div style="margin: 15px 0;">
                <strong style="font-size: 1.2em; color: #28a745;">Total Skor: ${stats.totalScore}</strong>
            </div>
            
            <div style="margin: 15px 0; padding: 10px; border-radius: 8px; ${stats.passStatus.style}">
                <strong style="font-size: 1.1em;">${stats.passStatus.icon} ${stats.passStatus.text}</strong>
            </div>
            
            <div style="margin: 15px 0; padding: 10px; background-color: white; border-radius: 5px;">
                <div style="margin: 5px 0;"><strong>📊 Statistik Jawaban:</strong></div>
                <div style="margin: 5px 0;">✅ Jawaban Benar: ${stats.correctQuestions} soal (${stats.correctPercentage}%)</div>
                <div style="margin: 5px 0;">❌ Jawaban Salah: ${stats.incorrectQuestions} soal (${stats.incorrectPercentage}%)</div>
                <div style="margin: 5px 0;">📝 Total Soal: ${stats.totalQuestions} soal</div>
            </div>
            
            <div style="margin: 15px 0; padding: 10px; background-color: white; border-radius: 5px;">
                <div style="margin: 5px 0;"><strong>⏱️ Statistik Waktu:</strong></div>
                <div style="margin: 5px 0;">🕐 Total Waktu: ${totalTimeFormatted}</div>
                <div style="margin: 5px 0;">⏰ Rata-rata per Soal: ${formatTime(avgTimePerQuestion)}</div>
                <div style="margin: 5px 0;">🎯 Waktu Tercepat: ${formatTime(Math.min(...questionTimes.filter(t => t > 0)))}</div>
                <div style="margin: 5px 0;">🐌 Waktu Terlama: ${formatTime(Math.max(...questionTimes))}</div>
            </div>
            
            <div style="margin: 15px 0; padding: 10px; background-color: white; border-radius: 5px;">
                <div style="margin: 5px 0;"><strong>🎯 Detail Poin:</strong></div>
                <div style="margin: 5px 0;">💎 Poin dari Jawaban Benar: +${stats.pointsFromCorrect}</div>
                <div style="margin: 5px 0;">💔 Poin Berkurang dari Salah: ${stats.pointsFromIncorrect}</div>
                <div style="margin: 5px 0;">🏆 Skor Maksimal Possible: ${stats.maxPossibleScore}</div>
            </div>
            
            <div style="margin: 15px 0; padding: 10px; border-radius: 5px; ${stats.gradeStyle}">
                <strong>${stats.gradeMessage}</strong>
            </div>
            
            <div style="margin: 10px 0; font-style: italic; color: #666;">
                ${stats.motivationalMessage}
            </div>
        </div>
    `;
    
    feedback.innerHTML = finalMessage;
    feedback.style.color = '#333';
}

// Calculate comprehensive final statistics
function calculateFinalStatistics() {
    const totalQuestions = questions.length;
    let correctQuestions = 0;
    let incorrectQuestions = 0;
    let pointsFromCorrect = 0;
    let pointsFromIncorrect = 0;
    let maxPossibleScore = 0;
    
    // Calculate statistics for each question
    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index] || [];
        const correctAnswers = question.correct_answers || [];
        const score = userScores[index] || 0;
        const pointsCorrect = question.poin_benar || 2;
        const pointsIncorrect = question.poin_salah || -1;
        
        // Calculate max possible score for this question
        maxPossibleScore += correctAnswers.length * pointsCorrect;
        
        // Check if answer is completely correct
        const isCompletelyCorrect = userAnswer.length === correctAnswers.length && 
                                   userAnswer.every(ans => correctAnswers.includes(ans)) &&
                                   correctAnswers.every(ans => userAnswer.includes(ans));
        
        if (isCompletelyCorrect) {
            correctQuestions++;
            pointsFromCorrect += score;
        } else {
            incorrectQuestions++;
            if (score < 0) {
                pointsFromIncorrect += score;
            } else if (score > 0) {
                pointsFromCorrect += score;
            }
        }
    });    const totalScore = userScores.reduce((sum, score) => sum + score, 0);
    const correctPercentage = Math.round((correctQuestions / totalQuestions) * 100);
    const incorrectPercentage = 100 - correctPercentage;
    
    // Debug logging
    console.log('Final Statistics:', {
        userScores: userScores,
        totalScore: totalScore,
        correctQuestions: correctQuestions,
        incorrectQuestions: incorrectQuestions,
        correctPercentage: correctPercentage,
        pointsFromCorrect: pointsFromCorrect,
        pointsFromIncorrect: pointsFromIncorrect,
        maxPossibleScore: maxPossibleScore
    });
    
    // Determine pass/fail status (90% threshold)
    const isPass = correctPercentage >= 90;
    const passStatus = {
        text: isPass ? "LULUS" : "TIDAK LULUS",
        icon: isPass ? "🎓" : "📚",
        style: isPass 
            ? "background-color: #d4edda; color: #155724; border: 2px solid #c3e6cb;" 
            : "background-color: #f8d7da; color: #721c24; border: 2px solid #f5c6cb;"
    };
    
    // Determine grade and styling
    let gradeMessage, gradeStyle, motivationalMessage;
      if (correctPercentage >= 90) {
        gradeMessage = "🌟 EXCELLENT! Prestasi Luar Biasa!";
        gradeStyle = "background-color: #d4edda; color: #155724; border: 2px solid #c3e6cb;";
        motivationalMessage = "Fantastis! Anda menguasai materi dengan sangat baik dan berhasil LULUS dengan nilai sempurna! Pertahankan semangat belajar yang luar biasa ini! 🚀";
    } else if (correctPercentage >= 80) {
        gradeMessage = "🎯 VERY GOOD! Hasil yang Sangat Memuaskan!";
        gradeStyle = "background-color: #d1ecf1; color: #0c5460; border: 2px solid #bee5eb;";
        motivationalMessage = "Hebat! Anda hampir sempurna. Sedikit lagi untuk mencapai level expert dan meraih status LULUS! Terus semangat! 💪";
    } else if (correctPercentage >= 70) {
        gradeMessage = "👍 GOOD! Hasil yang Baik!";
        gradeStyle = "background-color: #fff3cd; color: #856404; border: 2px solid #ffeaa7;";
        motivationalMessage = "Bagus! Anda sudah memahami sebagian besar materi. Terus berlatih untuk mencapai target LULUS (90%)! 📚";
    } else if (correctPercentage >= 60) {
        gradeMessage = "📈 FAIR! Masih Bisa Ditingkatkan!";
        gradeStyle = "background-color: #ffeaa7; color: #856404; border: 2px solid #fdcb6e;";
        motivationalMessage = "Jangan menyerah! Anda masih perlu belajar lebih giat untuk mencapai target LULUS (90%). Setiap kesalahan adalah pelajaran berharga! 🌱";
    } else {
        gradeMessage = "💪 KEEP TRYING! Semangat Belajar!";
        gradeStyle = "background-color: #f8d7da; color: #721c24; border: 2px solid #f5c6cb;";
        motivationalMessage = "Tidak apa-apa! Yang penting sudah berusaha. Untuk mencapai status LULUS (90%), mari belajar lebih intensif. Belajar adalah proses, bukan hasil instan! 🌈";
    }
      return {
        totalQuestions,
        correctQuestions,
        incorrectQuestions,
        totalScore,
        pointsFromCorrect,
        pointsFromIncorrect,
        maxPossibleScore,
        correctPercentage,
        incorrectPercentage,
        passStatus,
        gradeMessage,
        gradeStyle,
        motivationalMessage
    };
}

// Generate feedback message for individual questions
function generateFeedbackMessage(isCorrect, score, correctCount, incorrectCount, totalCorrectAnswers) {
    const appreciationMessages = [
        "🎉 Fantastic! Jawaban Anda tepat sekali!",
        "✨ Excellent! Anda memahami materi dengan baik!",
        "🌟 Perfect! Luar biasa, teruskan!",
        "👏 Outstanding! Jawaban yang brilliant!",
        "🚀 Amazing! Anda sedang on fire!",
        "💎 Superb! Pengetahuan Anda mengagumkan!",
        "🎯 Bullseye! Jawaban yang sangat akurat!",
        "⭐ Wonderful! Anda menguasai topik ini!",
        "🏆 Spectacular! Prestasi yang membanggakan!",
        "💫 Incredible! Terus pertahankan semangat ini!"
    ];
    
    const motivationMessages = [
        "💪 Jangan menyerah! Setiap kesalahan adalah langkah menuju pemahaman yang lebih baik!",
        "🌱 Tidak apa-apa! Belajar adalah proses. Anda sedang berkembang!",
        "🎯 Keep going! Fokus dan coba analisis jawaban yang benar!",
        "📚 Great effort! Ulangi materi dan Anda pasti bisa lebih baik!",
        "🌈 Stay positive! Kesalahan hari ini adalah kesuksesan hari esok!",
        "⚡ Don't give up! Anda lebih kuat dari yang Anda kira!",
        "🔥 Keep fighting! Semangat belajar Anda sangat menginspirasi!",
        "💡 Think again! Anda sudah dekat dengan jawaban yang tepat!",
        "🌟 Believe in yourself! Potensi Anda sangat besar!",
        "🚀 Next time! Pengalaman ini akan membuat Anda lebih bijak!"
    ];
    
    const partialMessages = [
        "👍 Good attempt! Anda sudah benar sebagian, terus semangat!",
        "📈 Getting there! Beberapa jawaban Anda tepat, tingkatkan lagi!",
        "⚖️ Mixed result! Ada yang benar dan salah, analisis lebih dalam ya!",
        "🎯 Close enough! Anda di jalur yang tepat, sedikit lagi!",
        "💭 Partial success! Pemahaman Anda berkembang dengan baik!"
    ];
    
    let message, color;
    
    if (isCorrect) {
        // Perfect answer - all correct, no incorrect
        const randomAppreciation = appreciationMessages[Math.floor(Math.random() * appreciationMessages.length)];
        message = `${randomAppreciation}<br><span style="font-size: 0.9em;">✅ Poin yang diperoleh: <strong>+${score}</strong></span>`;
        color = '#155724';
    } else if (correctCount > 0 && incorrectCount > 0) {
        // Partial answer - some correct, some incorrect
        const randomPartial = partialMessages[Math.floor(Math.random() * partialMessages.length)];
        message = `${randomPartial}<br><span style="font-size: 0.9em;">⚖️ Benar: ${correctCount}/${totalCorrectAnswers} | Poin: ${score > 0 ? '+' : ''}${score}</span>`;
        color = '#856404';
    } else if (correctCount > 0) {
        // Some correct but missing answers
        message = `👍 Bagus! Jawaban Anda benar tapi belum lengkap.<br><span style="font-size: 0.9em;">📝 Anda menjawab ${correctCount} dari ${totalCorrectAnswers} jawaban benar | Poin: +${score}</span>`;
        color = '#0c5460';
    } else {
        // Completely wrong
        const randomMotivation = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
        message = `${randomMotivation}<br><span style="font-size: 0.9em;">❌ Poin: ${score > 0 ? '+' : ''}${score} | Jangan patah semangat!</span>`;
        color = '#721c24';
    }
    
    return { text: message, color: color };
}

// --- New Subject Management Functions ---
let selectedJsonData = null; // Store the parsed JSON data temporarily

function handleJsonFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        previewJsonBtn.style.display = 'none';
        selectedJsonData = null;
        return;
    }
    
    if (!file.name.toLowerCase().endsWith('.json')) {
        showError('File harus berformat .json');
        event.target.value = '';
        previewJsonBtn.style.display = 'none';
        selectedJsonData = null;
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            selectedJsonData = JSON.parse(e.target.result);
            
            // Validate JSON structure
            if (!validateJsonStructure(selectedJsonData)) {
                showError('Format JSON tidak valid. Pastikan file memiliki struktur soal yang benar.');
                previewJsonBtn.style.display = 'none';
                selectedJsonData = null;
                return;
            }
            
            previewJsonBtn.style.display = 'inline-block';
            showSuccess(`File JSON berhasil dimuat! Ditemukan ${selectedJsonData.length} soal.`);
            
        } catch (error) {
            showError('Gagal membaca file JSON. Pastikan format file benar.');
            previewJsonBtn.style.display = 'none';
            selectedJsonData = null;
        }
    };
    
    reader.onerror = function() {
        showError('Gagal membaca file.');
        previewJsonBtn.style.display = 'none';
        selectedJsonData = null;
    };
    
    reader.readAsText(file);
}

function validateJsonStructure(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return false;
    }
    
    // Check if at least the first question has required properties
    const firstQuestion = data[0];
    
    // Support both formats: old format (soal, pilihan) and new format (question_text, options)
    const hasOldFormat = firstQuestion && 
                        typeof firstQuestion.soal === 'string' &&
                        typeof firstQuestion.pilihan === 'object' &&
                        Array.isArray(firstQuestion.correct_answers);
                        
    const hasNewFormat = firstQuestion && 
                        typeof firstQuestion.question_text === 'string' &&
                        typeof firstQuestion.options === 'object' &&
                        Array.isArray(firstQuestion.correct_answers);
    
    // Check if explanation field exists (optional)
    const hasExplanation = firstQuestion && typeof firstQuestion.explanation === 'string';
    console.log('JSON Validation:', { hasOldFormat, hasNewFormat, hasExplanation });
                        
    return hasOldFormat || hasNewFormat;
}

function handlePreviewJson() {
    if (!selectedJsonData) {
        showError('Tidak ada file JSON yang dimuat.');
        return;
    }
    
    // Create a simple preview modal or alert
    let preview = `Preview JSON - ${selectedJsonData.length} soal:\n\n`;
    
    const firstQuestion = selectedJsonData[0];
    const questionText = firstQuestion.question_text || firstQuestion.soal || 'No question text';
    const choices = firstQuestion.options || firstQuestion.pilihan || {};
    const explanation = firstQuestion.explanation || '';
    
    preview += `Soal pertama:\n"${questionText}"\n\n`;
    preview += `Pilihan jawaban:\n`;
    
    Object.keys(choices).forEach(key => {
        preview += `${key}: ${choices[key]}\n`;
    });
    
    preview += `\nJawaban benar: ${firstQuestion.correct_answers.join(', ')}`;
    
    if (explanation) {
        preview += `\n\nPenjelasan: ${explanation}`;
    }
    
    // Count questions with explanations
    const questionsWithExplanation = selectedJsonData.filter(q => q.explanation && q.explanation.trim() !== '').length;
    preview += `\n\n📊 Info: ${questionsWithExplanation}/${selectedJsonData.length} soal memiliki penjelasan`;
    
    alert(preview);
}

function handleAddSubject() {
    const subjectName = subjectNameInput.value.trim();
    
    // Clear previous messages
    hideMessages();
    
    // Validate input
    if (!subjectName) {
        showError('Nama mata pelajaran harus diisi.');
        return;
    }
    
    if (subjectName.length < 3) {
        showError('Nama mata pelajaran minimal 3 karakter.');
        return;
    }
    
    if (!selectedJsonData) {
        showError('File JSON soal harus dipilih.');
        return;
    }
    
    // Check if subject already exists
    const existingSubject = subjects.find(subject => 
        subject.name.toLowerCase() === subjectName.toLowerCase()
    );
    
    if (existingSubject) {
        showError('Mata pelajaran dengan nama tersebut sudah ada.');
        return;
    }
    
    // Generate new code
    const newCode = String(subjects.length + 1).padStart(3, '0');
    
    // Add new subject
    const newSubject = {
        name: subjectName,
        code: newCode,
        file: `custom_${newCode}_${subjectName.toLowerCase().replace(/\s+/g, '_')}.json`,
        isCustom: true
    };
      subjects.push(newSubject);
    uploadedSubjects.set(subjectName, selectedJsonData);
    
    // Save to localStorage for persistence
    saveCustomSubjectsToStorage();
    
    // Re-render subject menu
    renderSubjectMenu();
    
    // Clear form
    subjectNameInput.value = '';
    jsonFileInput.value = '';
    previewJsonBtn.style.display = 'none';
    selectedJsonData = null;
      showSuccess(`Mata pelajaran "${subjectName}" berhasil ditambahkan dan disimpan permanen! ✅`);
}

function showError(message) {
    addSubjectError.textContent = message;
    addSubjectError.style.display = 'block';
    addSubjectSuccess.style.display = 'none';
}

function showSuccess(message) {
    addSubjectSuccess.textContent = message;
    addSubjectSuccess.style.display = 'block';
    addSubjectError.style.display = 'none';
}

function hideMessages() {
    addSubjectError.style.display = 'none';
    addSubjectSuccess.style.display = 'none';
}

// --- LocalStorage Management Functions ---
function saveCustomSubjectsToStorage() {
    try {
        // Get only custom subjects
        const customSubjects = subjects.filter(subject => subject.isCustom);
        
        // Create storage object with subjects and their data
        const storageData = {
            subjects: customSubjects,
            subjectData: {}
        };
        
        // Save the JSON data for each custom subject
        customSubjects.forEach(subject => {
            if (uploadedSubjects.has(subject.name)) {
                storageData.subjectData[subject.name] = uploadedSubjects.get(subject.name);
            }
        });
        
        localStorage.setItem('customQuizSubjects', JSON.stringify(storageData));
        console.log('Custom subjects saved to localStorage:', storageData);
        
    } catch (error) {
        console.error('Error saving custom subjects to localStorage:', error);
    }
}

function loadCustomSubjectsFromStorage() {
    try {
        const storedData = localStorage.getItem('customQuizSubjects');
        if (!storedData) return;
        
        const parsedData = JSON.parse(storedData);
        
        if (parsedData.subjects && Array.isArray(parsedData.subjects)) {
            // Add custom subjects to the subjects array
            parsedData.subjects.forEach(customSubject => {
                // Check if subject already exists (avoid duplicates)
                const exists = subjects.some(subject => subject.name === customSubject.name);
                if (!exists) {
                    subjects.push(customSubject);
                }
            });
            
            // Restore the JSON data for each custom subject
            if (parsedData.subjectData) {
                Object.keys(parsedData.subjectData).forEach(subjectName => {
                    uploadedSubjects.set(subjectName, parsedData.subjectData[subjectName]);
                });
            }
            
            console.log('Custom subjects loaded from localStorage:', parsedData);
        }
        
    } catch (error) {
        console.error('Error loading custom subjects from localStorage:', error);
        // If there's an error, clear the corrupted data
        localStorage.removeItem('customQuizSubjects');
    }
}

function deleteCustomSubjectFromStorage(subjectName) {
    try {
        // Remove from subjects array
        subjects = subjects.filter(subject => subject.name !== subjectName);
        
        // Remove from uploadedSubjects
        uploadedSubjects.delete(subjectName);
        
        // Update localStorage
        saveCustomSubjectsToStorage();
        
        console.log(`Custom subject "${subjectName}" deleted from storage`);
        
    } catch (error) {
        console.error('Error deleting custom subject from localStorage:', error);
    }
}

function clearAllCustomSubjects() {
    try {
        // Remove all custom subjects from subjects array
        subjects = subjects.filter(subject => !subject.isCustom);
        
        // Clear uploadedSubjects
        uploadedSubjects.clear();
        
        // Clear localStorage
        localStorage.removeItem('customQuizSubjects');
        
        console.log('All custom subjects cleared from storage');
        
    } catch (error) {
        console.error('Error clearing custom subjects:', error);
    }
}

// --- Timer Functions ---
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startQuestionTimer() {
    questionStartTime = Date.now();
    let questionSeconds = 0;
    
    // Clear any existing interval
    if (questionTimerInterval) {
        clearInterval(questionTimerInterval);
    }
    
    questionTimerInterval = setInterval(() => {
        questionSeconds = Math.floor((Date.now() - questionStartTime) / 1000);
        if (questionTimer) {
            questionTimer.textContent = formatTime(questionSeconds);
        }
    }, 1000);
}

function stopQuestionTimer() {
    if (questionTimerInterval) {
        clearInterval(questionTimerInterval);
        questionTimerInterval = null;
    }
    
    // Record time spent on current question
    if (questionStartTime > 0) {
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
        questionTimes[currentIndex] = (questionTimes[currentIndex] || 0) + timeSpent;
        questionStartTime = 0;
    }
}

function startTotalTimer() {
    totalStartTime = Date.now();
    
    // Clear any existing interval
    if (totalTimerInterval) {
        clearInterval(totalTimerInterval);
    }
    
    totalTimerInterval = setInterval(() => {
        const totalSeconds = Math.floor((Date.now() - totalStartTime) / 1000);
        if (totalTimer) {
            totalTimer.textContent = formatTime(totalSeconds);
        }
    }, 1000);
}

function stopTotalTimer() {
    if (totalTimerInterval) {
        clearInterval(totalTimerInterval);
        totalTimerInterval = null;
    }
    
    if (totalStartTime > 0) {
        totalTimeSpent = Math.floor((Date.now() - totalStartTime) / 1000);
    }
}

function resetTimers() {
    stopQuestionTimer();
    stopTotalTimer();
    questionTimes = [];
    totalTimeSpent = 0;
    
    if (questionTimer) questionTimer.textContent = '00:00';
    if (totalTimer) totalTimer.textContent = '00:00';
}

// --- Side Panel Explanation Functions ---
function updateExplanationPanel(explanation = null, isAnswerChecked = false) {
    if (!explanationContent) return;
    
    if (explanation && explanation.trim() !== '' && isAnswerChecked) {
        explanationContent.innerHTML = `
            <div class="explanation-active">
                <div class="explanation-title">
                    💡 Penjelasan Jawaban
                </div>
                <div class="explanation-text">
                    ${explanation}
                </div>
            </div>
        `;
    } else {
        explanationContent.innerHTML = `
            <div class="no-explanation">
                <p>${isAnswerChecked ? 'Tidak ada penjelasan untuk soal ini.' : 'Silakan jawab soal dan klik "Periksa Jawaban" untuk melihat penjelasan.'}</p>
            </div>
        `;
    }
}

function clearExplanationPanel() {
    updateExplanationPanel(null, false);
}

// --- Start the App ---
initializeApp();