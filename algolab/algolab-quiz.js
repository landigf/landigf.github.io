// AlgoLab Quiz Game Logic with Progress Tracking

// State management
let currentQuestion = null;
let selectedOption = null;
let sessionStats = {
    correct: 0,
    incorrect: 0,
    streak: 0
};

// Progress tracking using localStorage (Anki-style)
class ProgressTracker {
    constructor() {
        this.storageKey = 'algolab_quiz_progress';
        this.load();
    }

    load() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            this.data = JSON.parse(saved);
        } else {
            this.data = {
                totalCorrect: 0,
                totalIncorrect: 0,
                totalAttempted: 0,
                bestStreak: 0,
                currentStreak: 0,
                exercises: {}
            };
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    recordAnswer(exerciseName, isCorrect) {
        // Initialize exercise tracking if needed
        if (!this.data.exercises[exerciseName]) {
            this.data.exercises[exerciseName] = {
                attempts: 0,
                correct: 0,
                incorrect: 0,
                lastAttempt: null,
                consecutiveCorrect: 0,
                consecutiveIncorrect: 0
            };
        }

        const ex = this.data.exercises[exerciseName];
        ex.attempts++;
        ex.lastAttempt = new Date().toISOString();

        if (isCorrect) {
            this.data.totalCorrect++;
            ex.correct++;
            ex.consecutiveCorrect++;
            ex.consecutiveIncorrect = 0;
            this.data.currentStreak++;
            if (this.data.currentStreak > this.data.bestStreak) {
                this.data.bestStreak = this.data.currentStreak;
            }
        } else {
            this.data.totalIncorrect++;
            ex.incorrect++;
            ex.consecutiveIncorrect++;
            ex.consecutiveCorrect = 0;
            this.data.currentStreak = 0;
        }

        this.data.totalAttempted++;
        this.save();
    }

    getExerciseData(exerciseName) {
        return this.data.exercises[exerciseName] || null;
    }

    // Get exercises that need more practice (weighted random selection)
    getWeightedExercises() {
        return exercises.map(ex => {
            const data = this.getExerciseData(ex.name);
            let weight = 1.0;

            if (data) {
                // Increase weight for exercises answered incorrectly
                if (data.incorrect > 0) {
                    weight += data.incorrect * 0.5;
                }
                
                // Increase weight for exercises not seen recently
                const daysSinceLastAttempt = data.lastAttempt 
                    ? (Date.now() - new Date(data.lastAttempt).getTime()) / (1000 * 60 * 60 * 24)
                    : 999;
                weight += Math.min(daysSinceLastAttempt * 0.1, 2.0);
                
                // Decrease weight for exercises with high success rate
                const successRate = data.correct / (data.correct + data.incorrect);
                if (successRate > 0.8 && data.consecutiveCorrect >= 3) {
                    weight *= 0.3;
                }
            } else {
                // New exercises get higher weight
                weight = 2.0;
            }

            return { exercise: ex, weight: weight };
        });
    }

    reset() {
        localStorage.removeItem(this.storageKey);
        this.data = {
            totalCorrect: 0,
            totalIncorrect: 0,
            totalAttempted: 0,
            bestStreak: 0,
            currentStreak: 0,
            exercises: {}
        };
        this.save();
    }
}

const progressTracker = new ProgressTracker();

// Weighted random selection
function selectWeightedRandom(weightedExercises) {
    const totalWeight = weightedExercises.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of weightedExercises) {
        random -= item.weight;
        if (random <= 0) {
            return item.exercise;
        }
    }
    
    return weightedExercises[weightedExercises.length - 1].exercise;
}

// Generate wrong answers that are plausible
function generateWrongAnswers(correctAnswer, allExercises, field = 'solution') {
    const wrongAnswers = [];
    const usedAnswers = new Set([correctAnswer]);
    
    // Get values from other exercises
    const otherValues = allExercises
        .filter(ex => ex[field] && ex[field] !== correctAnswer)
        .map(ex => ex[field]);
    
    // Shuffle and pick unique wrong answers
    const shuffled = otherValues.sort(() => Math.random() - 0.5);
    
    for (const value of shuffled) {
        if (!usedAnswers.has(value) && wrongAnswers.length < 3) {
            wrongAnswers.push(value);
            usedAnswers.add(value);
        }
        if (wrongAnswers.length === 3) break;
    }
    
    // If we don't have enough, add generic wrong answers based on field type
    while (wrongAnswers.length < 3) {
        let generic;
        if (field === 'solution') {
            generic = [
                "Use brute force O(n^3) enumeration to check all possible combinations",
                "Apply divide and conquer with recursive splitting until base case is reached",
                "Use hash map to store all elements and perform linear scan for solution",
                "Sort the input and use two pointers technique to find the answer",
                "Build a segment tree and query ranges to compute the result"
            ];
        } else if (field === 'methods') {
            generic = [
                "Backtracking",
                "Divide and Conquer",
                "Sliding Window",
                "Union Find",
                "Segment Tree",
                "Trie",
                "Bit Manipulation"
            ];
        }
        const candidate = generic[Math.floor(Math.random() * generic.length)];
        if (!usedAnswers.has(candidate)) {
            wrongAnswers.push(candidate);
            usedAnswers.add(candidate);
        }
    }
    
    return wrongAnswers;
}

// Generate wrong complexity answers
function generateWrongComplexityAnswers(correctComplexity) {
    const complexities = [
        "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", 
        "O(n^2 log n)", "O(n^3)", "O(2^n)", "O(n!)"
    ];
    
    const wrongAnswers = [];
    const usedAnswers = new Set([correctComplexity]);
    
    // Shuffle and pick 3 different complexities
    const shuffled = complexities
        .filter(c => c !== correctComplexity)
        .sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
        wrongAnswers.push(shuffled[i]);
    }
    
    return wrongAnswers;
}

// Load a new question
function loadQuestion() {
    const weightedExercises = progressTracker.getWeightedExercises();
    let exercise = selectWeightedRandom(weightedExercises);
    
    // Apply any local edits
    const exercisesWithEdits = getExercisesWithEdits();
    const editedExercise = exercisesWithEdits.find(ex => ex.name === exercise.name);
    if (editedExercise) {
        exercise = editedExercise;
    }
    
    currentQuestion = exercise;
    selectedOption = null;
    
    // Randomly choose question type: 50% solution, 30% method, 20% complexity/week
    const rand = Math.random();
    let questionType;
    if (rand < 0.5) {
        questionType = 'solution';
    } else if (rand < 0.8 && exercise.methods) {
        questionType = 'method';
    } else if (exercise.complexity) {
        questionType = 'complexity';
    } else {
        questionType = 'solution';
    }
    
    currentQuestion.questionType = questionType;
    
    // Description (metadata badges removed as requested)
    document.getElementById('problemDescription').textContent = exercise.description;
    
    // Generate question based on type
    let correctAnswer, wrongAnswers, questionPrompt;
    
    if (questionType === 'solution') {
        questionPrompt = 'What is the correct solution approach?';
        correctAnswer = exercise.solution;
        wrongAnswers = generateWrongAnswers(correctAnswer, exercises, 'solution');
    } else if (questionType === 'method') {
        questionPrompt = 'What technique/method is primarily used to solve this problem?';
        correctAnswer = exercise.methods;
        wrongAnswers = generateWrongAnswers(correctAnswer, exercises, 'methods');
    } else if (questionType === 'complexity') {
        questionPrompt = 'What is the time complexity of the optimal solution?';
        correctAnswer = exercise.complexity;
        wrongAnswers = generateWrongComplexityAnswers(correctAnswer);
    }
    
    document.getElementById('questionPrompt').textContent = questionPrompt;
    
    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    const optionsHtml = allOptions.map((option, index) => {
        const label = String.fromCharCode(65 + index); // A, B, C, D
        return `
            <div class="option" onclick="selectOption(${index}, '${label}')" data-option="${index}">
                <span class="option-label">${label}</span>
                <span class="option-text">${option}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('options').innerHTML = optionsHtml;
    
    // Store correct answer index
    currentQuestion.correctIndex = allOptions.indexOf(correctAnswer);
    currentQuestion.options = allOptions;
    currentQuestion.correctAnswer = correctAnswer;
    
    // Reset UI state
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('checkBtn').disabled = true;
    document.getElementById('nextBtn').classList.add('hidden');
}

// Select an option
function selectOption(index, label) {
    if (selectedOption !== null) return; // Already answered
    
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Mark new selection
    const optionEl = document.querySelector(`[data-option="${index}"]`);
    optionEl.classList.add('selected');
    
    selectedOption = index;
    document.getElementById('checkBtn').disabled = false;
}

// Check the answer
function checkAnswer() {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    
    // Disable all options
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.add('disabled');
        opt.onclick = null;
    });
    
    // Mark correct/incorrect
    const selectedEl = document.querySelector(`[data-option="${selectedOption}"]`);
    const correctEl = document.querySelector(`[data-option="${currentQuestion.correctIndex}"]`);
    
    if (isCorrect) {
        selectedEl.classList.add('correct');
        sessionStats.correct++;
        sessionStats.streak++;
    } else {
        selectedEl.classList.add('incorrect');
        correctEl.classList.add('correct');
        sessionStats.incorrect++;
        sessionStats.streak = 0;
    }
    
    // Update session stats
    updateSessionStats();
    
    // Record in progress tracker
    progressTracker.recordAnswer(currentQuestion.name, isCorrect);
    
    // Show feedback
    const feedbackEl = document.getElementById('feedback');
    feedbackEl.className = 'feedback show ' + (isCorrect ? 'correct' : 'incorrect');
    
    const exerciseData = progressTracker.getExerciseData(currentQuestion.name);
    const accuracyText = exerciseData 
        ? ` Your accuracy: ${exerciseData.correct}/${exerciseData.attempts} (${Math.round(100 * exerciseData.correct / exerciseData.attempts)}%)`
        : '';
    
    let feedbackContent = `
        <div class="feedback-title">${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</div>
    `;
    
    // Add question-type specific feedback
    if (currentQuestion.questionType === 'solution') {
        feedbackContent += `<div><strong>Solution:</strong> ${currentQuestion.solution}</div>`;
        if (!isCorrect && currentQuestion.methods) {
            feedbackContent += `<div style="margin-top:10px"><strong>Method:</strong> ${currentQuestion.methods}</div>`;
        }
    } else if (currentQuestion.questionType === 'method') {
        feedbackContent += `<div><strong>Correct Method:</strong> ${currentQuestion.correctAnswer}</div>`;
        if (!isCorrect) {
            feedbackContent += `<div style="margin-top:10px"><strong>Solution Approach:</strong> ${currentQuestion.solution}</div>`;
        }
    } else if (currentQuestion.questionType === 'complexity') {
        feedbackContent += `<div><strong>Correct Complexity:</strong> ${currentQuestion.correctAnswer}</div>`;
        if (!isCorrect && currentQuestion.inputSize) {
            feedbackContent += `<div style="margin-top:10px"><strong>Input Size:</strong> ${currentQuestion.inputSize}</div>`;
        }
    }
    
    feedbackContent += `<div style="margin-top:10px; font-size:0.9em; opacity:0.8">${accuracyText}</div>`;
    
    feedbackEl.innerHTML = feedbackContent;
    
    // Update buttons
    document.getElementById('checkBtn').classList.add('hidden');
    document.getElementById('nextBtn').classList.remove('hidden');
}

// Load next question
function nextQuestion() {
    document.getElementById('checkBtn').classList.remove('hidden');
    document.getElementById('nextBtn').classList.add('hidden');
    loadQuestion();
}

// Update session statistics
function updateSessionStats() {
    document.getElementById('sessionCorrect').textContent = sessionStats.correct;
    document.getElementById('sessionIncorrect').textContent = sessionStats.incorrect;
    document.getElementById('streak').textContent = sessionStats.streak;
}

// Update total statistics
function updateTotalStats() {
    document.getElementById('totalCorrect').textContent = progressTracker.data.totalCorrect;
    document.getElementById('totalIncorrect').textContent = progressTracker.data.totalIncorrect;
    document.getElementById('totalAttempted').textContent = progressTracker.data.totalAttempted;
    document.getElementById('currentStreak').textContent = progressTracker.data.currentStreak;
}

// Start quiz
function startQuiz() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    
    sessionStats = { correct: 0, incorrect: 0, streak: 0 };
    updateSessionStats();
    loadQuestion();
}

// Reset progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        progressTracker.reset();
        sessionStats = { correct: 0, incorrect: 0, streak: 0 };
        updateTotalStats();
        updateSessionStats();
        alert('Progress has been reset!');
    }
}

// === Browse Mode Functions ===============================================

let currentEditExercise = null;

function showBrowseMode() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('browseScreen').classList.remove('hidden');
    
    // Populate method filter
    const methods = new Set();
    exercises.forEach(ex => {
        if (ex.methods) {
            ex.methods.split(',').forEach(m => methods.add(m.trim()));
        }
    });
    
    const methodFilter = document.getElementById('filterMethod');
    methodFilter.innerHTML = '<option value="all">All Methods</option>';
    Array.from(methods).sort().forEach(method => {
        const opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        methodFilter.appendChild(opt);
    });
    
    // Add event listeners
    document.getElementById('filterMethod').addEventListener('change', renderBrowseList);
    document.getElementById('filterStatus').addEventListener('change', renderBrowseList);
    document.getElementById('sortBy').addEventListener('change', renderBrowseList);
    
    renderBrowseList();
}

function renderBrowseList() {
    const container = document.getElementById('browseList');
    const filterMethod = document.getElementById('filterMethod').value;
    const filterStatus = document.getElementById('filterStatus').value;
    const sortBy = document.getElementById('sortBy').value;
    
    let filtered = getExercisesWithEdits().filter(ex => {
        // Filter by method
        if (filterMethod !== 'all') {
            const methods = ex.methods ? ex.methods.toLowerCase().split(',').map(m => m.trim()) : [];
            if (!methods.includes(filterMethod.toLowerCase())) return false;
        }
        
        // Filter by status
        if (filterStatus !== 'all') {
            const data = progressTracker.getExerciseData(ex.name);
            if (filterStatus === 'unattempted' && data) return false;
            if (filterStatus === 'correct' && (!data || data.correct === 0)) return false;
            if (filterStatus === 'incorrect' && (!data || data.incorrect === 0)) return false;
        }
        
        return true;
    });
    
    // Sort
    filtered.sort((a, b) => {
        const dataA = progressTracker.getExerciseData(a.name);
        const dataB = progressTracker.getExerciseData(b.name);
        
        switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'date-desc':
                const dateA = dataA?.lastAttempt ? new Date(dataA.lastAttempt) : new Date(0);
                const dateB = dataB?.lastAttempt ? new Date(dataB.lastAttempt) : new Date(0);
                return dateB - dateA;
            case 'date-asc':
                const dateA2 = dataA?.lastAttempt ? new Date(dataA.lastAttempt) : new Date(0);
                const dateB2 = dataB?.lastAttempt ? new Date(dataB.lastAttempt) : new Date(0);
                return dateA2 - dateB2;
            case 'accuracy-asc':
                const accA = dataA ? (dataA.correct / (dataA.correct + dataA.incorrect) || 0) : 0;
                const accB = dataB ? (dataB.correct / (dataB.correct + dataB.incorrect) || 0) : 0;
                return accA - accB;
            case 'accuracy-desc':
                const accA2 = dataA ? (dataA.correct / (dataA.correct + dataA.incorrect) || 0) : 0;
                const accB2 = dataB ? (dataB.correct / (dataB.correct + dataB.incorrect) || 0) : 0;
                return accB2 - accA2;
            default:
                return 0;
        }
    });
    
    container.innerHTML = '';
    
    filtered.forEach(ex => {
        const data = progressTracker.getExerciseData(ex.name);
        const accuracy = data ? Math.round(100 * data.correct / (data.correct + data.incorrect)) : 0;
        const lastDate = data?.lastAttempt ? new Date(data.lastAttempt).toLocaleDateString() : 'Never';
        
        const card = document.createElement('div');
        card.style.cssText = 'background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 15px; border: 2px solid #e9ecef;';
        
        const statusBadge = data ? 
            (data.correct > 0 ? '✅' : (data.incorrect > 0 ? '❌' : '⭕')) : '⭕';
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 5px 0; font-size: 1.2em;">${statusBadge} ${ex.name}</h3>
                    <div style="color: #6c757d; font-size: 0.9em; margin-bottom: 8px;">${ex.methods || 'No methods'}</div>
                    <div style="color: #495057; margin-bottom: 10px;">${ex.description}</div>
                    <div style="background: #fff; padding: 10px; border-radius: 8px; border-left: 3px solid #667eea;">
                        <strong>Solution:</strong> ${ex.solution}
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 20px; font-size: 0.9em; color: #6c757d; margin-bottom: 10px;">
                ${data ? `
                    <span>📊 ${data.attempts} attempts</span>
                    <span>✅ ${data.correct} correct</span>
                    <span>❌ ${data.incorrect} incorrect</span>
                    <span>🎯 ${isNaN(accuracy) ? 0 : accuracy}% accuracy</span>
                    <span>📅 Last: ${lastDate}</span>
                ` : '<span>Not attempted yet</span>'}
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="editExercise('${ex.name.replace(/'/g, "\\'")}')" 
                        style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    ✏️ Edit
                </button>
                ${ex.cppFile ? `
                    <button onclick="viewCppCode('${ex.name.replace(/'/g, "\\'")}', '${ex.cppFile}')" 
                            style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        💻 View C++ Solution
                    </button>
                ` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}

function backToStart() {
    document.getElementById('browseScreen').classList.add('hidden');
    document.getElementById('editScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}

// === Edit Functions ======================================================

function editExercise(name) {
    const exercise = getExercisesWithEdits().find(ex => ex.name === name);
    if (!exercise) return;
    
    currentEditExercise = exercise;
    
    document.getElementById('editDescription').value = exercise.description;
    document.getElementById('editSolution').value = exercise.solution;
    document.getElementById('editMethods').value = exercise.methods || '';
    
    document.getElementById('browseScreen').classList.add('hidden');
    document.getElementById('editScreen').classList.remove('hidden');
}

function saveEdit() {
    if (!currentEditExercise) return;
    
    const edits = {
        description: document.getElementById('editDescription').value,
        solution: document.getElementById('editSolution').value,
        methods: document.getElementById('editMethods').value
    };
    
    // Save to localStorage
    const editsKey = 'algolab_quiz_edits';
    let allEdits = {};
    try {
        const saved = localStorage.getItem(editsKey);
        if (saved) allEdits = JSON.parse(saved);
    } catch(e) {}
    
    allEdits[currentEditExercise.name] = edits;
    localStorage.setItem(editsKey, JSON.stringify(allEdits));
    
    alert('Changes saved locally!');
    
    // Go back to browse
    document.getElementById('editScreen').classList.add('hidden');
    document.getElementById('browseScreen').classList.remove('hidden');
    renderBrowseList();
}

function cancelEdit() {
    document.getElementById('editScreen').classList.add('hidden');
    document.getElementById('browseScreen').classList.remove('hidden');
}

function resetToOriginal() {
    if (!currentEditExercise) return;
    
    if (confirm('Reset this question to its original version?')) {
        const editsKey = 'algolab_quiz_edits';
        try {
            const saved = localStorage.getItem(editsKey);
            if (saved) {
                let allEdits = JSON.parse(saved);
                delete allEdits[currentEditExercise.name];
                localStorage.setItem(editsKey, JSON.stringify(allEdits));
            }
        } catch(e) {}
        
        alert('Reset to original!');
        cancelEdit();
        renderBrowseList();
    }
}

function getExercisesWithEdits() {
    const editsKey = 'algolab_quiz_edits';
    let allEdits = {};
    try {
        const saved = localStorage.getItem(editsKey);
        if (saved) allEdits = JSON.parse(saved);
    } catch(e) {}
    
    return exercises.map(ex => {
        if (allEdits[ex.name]) {
            return { ...ex, ...allEdits[ex.name] };
        }
        return ex;
    });
}

// === C++ Code Viewer Functions ===========================================

async function viewCppCode(name, filename) {
    const exercise = exercises.find(ex => ex.name === name);
    if (!exercise) return;
    
    const modal = document.getElementById('cppModal');
    const title = document.getElementById('cppModalTitle');
    const codeElement = document.getElementById('cppCode');
    
    title.textContent = `C++ Solution: ${name}`;
    codeElement.textContent = 'Loading C++ code...';
    modal.style.display = 'block';
    
    // Try to fetch the C++ file from the problems folder
    const weekNum = exercise.week.replace('Week ', '');
    const weekFolder = weekNum.padStart(2, '0');
    const cppUrl = `/Algolab-2023-main/problems/week ${weekFolder}/${name}/${filename}`;
    
    try {
        const response = await fetch(cppUrl);
        if (response.ok) {
            const code = await response.text();
            codeElement.textContent = code;
        } else {
            codeElement.textContent = `// C++ solution file not available\n// Expected file: ${filename}\n// Week: ${exercise.week}\n// Problem: ${name}\n\n// You can find the solution at:\n// https://github.com/lorenzo-asquini/Algolab-2023/tree/main/problems/week%20${weekFolder}/${encodeURIComponent(name)}`;
        }
    } catch (error) {
        codeElement.textContent = `// Error loading C++ file\n// The solution files are in the attached Algolab-2023 folder\n// Week ${exercise.week}: ${name}\n// File: ${filename}\n\n// GitHub: https://github.com/lorenzo-asquini/Algolab-2023/tree/main/problems/week%20${weekFolder}/${encodeURIComponent(name)}`;
    }
}

function closeCppModal() {
    document.getElementById('cppModal').style.display = 'none';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCppModal();
    }
});

// Close modal when clicking outside
document.getElementById('cppModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'cppModal') {
        closeCppModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateTotalStats();
});

// === Analysis Training Mode Functions ===================================

let currentAnalysisExercise = null;
let analysisSelectedType = null;
let analysisSelectedMethod = null;
let analysisSelectedComplexity = null;
let currentAnalysisStage = 1;

// Common problem types for training
const problemTypes = [
    "Max Flow", "Min-Cost Max-Flow", "Min-Cut", "Shortest Path", "Minimum Spanning Tree",
    "Maximum Matching", "Bipartite Matching", "Graph Coloring", "Strong Connected Components",
    "Interval Scheduling", "Knapsack Problem", "Longest Common Subsequence",
    "Tree DP", "Game Theory DP", "Bitmask DP", "Two Pointers + DP",
    "Circular Interval Scheduling", "Geometric Coverage", "Line Separation",
    "Triangulation Problem", "Voronoi Diagram", "Convex Hull",
    "Time-Expanded Network", "Constrained Path Finding", "Assignment Problem"
];

function startAnalysisTraining() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('analysisTrainingScreen').classList.remove('hidden');
    currentAnalysisStage = 1;
    loadAnalysisQuestion();
}

function loadAnalysisQuestion() {
    // Get random exercise
    const exercise = exercises[Math.floor(Math.random() * exercises.length)];
    currentAnalysisExercise = exercise;
    
    // Reset state
    analysisSelectedType = null;
    analysisSelectedMethod = null;
    analysisSelectedComplexity = null;
    currentAnalysisStage = 1;
    
    // Update description
    document.getElementById('analysisProblemDescription').textContent = exercise.description;
    document.getElementById('analysisQuestionNumber').textContent = `Problem: ${exercise.name} (${exercise.week})`;
    
    // Reset stages
    document.getElementById('analysisStage1').classList.remove('hidden');
    document.getElementById('analysisStage2').classList.add('hidden');
    document.getElementById('analysisStage3').classList.add('hidden');
    document.getElementById('analysisNextBtn').classList.add('hidden');
    document.getElementById('analysisFeedback').classList.remove('show');
    
    // Load Stage 1: Problem Type
    loadAnalysisTypeOptions();
}

function loadAnalysisTypeOptions() {
    const container = document.getElementById('analysisTypeOptions');
    const correctType = currentAnalysisExercise.problemType || "General Problem";
    
    // Get 3 random wrong types
    let wrongTypes = problemTypes
        .filter(t => t !== correctType)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    // Mix with correct answer
    const allOptions = [correctType, ...wrongTypes].sort(() => Math.random() - 0.5);
    
    container.innerHTML = allOptions.map((type, index) => {
        const label = String.fromCharCode(65 + index);
        return `
            <div class="option" onclick="selectAnalysisType(${index}, '${type.replace(/'/g, "\\'")}')">
                <span class="option-label">${label}</span>
                <span class="option-text">${type}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('checkTypeBtn').disabled = true;
}

function selectAnalysisType(index, type) {
    analysisSelectedType = type;
    
    // Remove previous selections
    document.querySelectorAll('#analysisTypeOptions .option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Mark as selected
    document.querySelectorAll('#analysisTypeOptions .option')[index].classList.add('selected');
    document.getElementById('checkTypeBtn').disabled = false;
}

function checkAnalysisType() {
    const correctType = currentAnalysisExercise.problemType || "General Problem";
    const feedback = document.getElementById('analysisFeedback');
    
    if (analysisSelectedType === correctType) {
        feedback.className = 'feedback show correct';
        feedback.innerHTML = `
            <div class="feedback-title">✅ Correct!</div>
            <p><strong>Problem Type:</strong> ${correctType}</p>
            <p><strong>Key Insight:</strong> ${currentAnalysisExercise.keyInsight || 'Good job identifying the pattern!'}</p>
        `;
        
        // Move to next stage
        setTimeout(() => {
            document.getElementById('analysisStage1').classList.add('hidden');
            document.getElementById('analysisStage2').classList.remove('hidden');
            feedback.classList.remove('show');
            loadAnalysisMethodOptions();
        }, 2000);
    } else {
        feedback.className = 'feedback show incorrect';
        feedback.innerHTML = `
            <div class="feedback-title">❌ Not quite</div>
            <p>The correct type is: <strong>${correctType}</strong></p>
            <p>${currentAnalysisExercise.keyInsight || ''}</p>
            <p>Try again!</p>
        `;
    }
}

function loadAnalysisMethodOptions() {
    const container = document.getElementById('analysisMethodOptions');
    const correctMethods = currentAnalysisExercise.methods;
    
    // Common methods
    const allMethods = [
        "Dynamic Programming", "Greedy", "BFS/DFS", "Dijkstra", "Bellman-Ford",
        "Max Flow", "Min-Cost Max-Flow", "Binary Search", "Two Pointers",
        "Sliding Window", "Delaunay Triangulation", "CGAL Geometry",
        "Linear Programming", "Backtracking", "Divide and Conquer",
        "Union Find", "Segment Tree", "Trie", "Bitmask DP"
    ];
    
    // Get 3 random wrong methods
    let wrongMethods = allMethods
        .filter(m => m !== correctMethods && !correctMethods.includes(m))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    const allOptions = [correctMethods, ...wrongMethods].sort(() => Math.random() - 0.5);
    
    container.innerHTML = allOptions.map((method, index) => {
        const label = String.fromCharCode(65 + index);
        return `
            <div class="option" onclick="selectAnalysisMethod(${index}, '${method.replace(/'/g, "\\'")}')">
                <span class="option-label">${label}</span>
                <span class="option-text">${method}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('checkMethodBtn').disabled = true;
}

function selectAnalysisMethod(index, method) {
    analysisSelectedMethod = method;
    
    document.querySelectorAll('#analysisMethodOptions .option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    document.querySelectorAll('#analysisMethodOptions .option')[index].classList.add('selected');
    document.getElementById('checkMethodBtn').disabled = false;
}

function checkAnalysisMethod() {
    const correctMethods = currentAnalysisExercise.methods;
    const feedback = document.getElementById('analysisFeedback');
    
    if (analysisSelectedMethod === correctMethods) {
        feedback.className = 'feedback show correct';
        feedback.innerHTML = `
            <div class="feedback-title">✅ Correct!</div>
            <p><strong>Method:</strong> ${correctMethods}</p>
            <p>Now let's verify the complexity!</p>
        `;
        
        setTimeout(() => {
            document.getElementById('analysisStage2').classList.add('hidden');
            document.getElementById('analysisStage3').classList.remove('hidden');
            feedback.classList.remove('show');
            loadAnalysisComplexityOptions();
        }, 2000);
    } else {
        feedback.className = 'feedback show incorrect';
        feedback.innerHTML = `
            <div class="feedback-title">❌ Not quite</div>
            <p>The correct method is: <strong>${correctMethods}</strong></p>
            <p>${currentAnalysisExercise.solution}</p>
        `;
    }
}

function loadAnalysisComplexityOptions() {
    const container = document.getElementById('analysisComplexityOptions');
    const correctComplexity = currentAnalysisExercise.complexity;
    
    const complexities = [
        "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", 
        "O(n^2 log n)", "O(n^3)", "O(2^n)", "O(n!)",
        "O(V + E)", "O((V + E) log V)", "O(V * E^2)", "O(n * m)"
    ];
    
    let wrongComplexities = complexities
        .filter(c => c !== correctComplexity)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    const allOptions = [correctComplexity, ...wrongComplexities].sort(() => Math.random() - 0.5);
    
    container.innerHTML = allOptions.map((complexity, index) => {
        const label = String.fromCharCode(65 + index);
        return `
            <div class="option" onclick="selectAnalysisComplexity(${index}, '${complexity.replace(/'/g, "\\'")}')">
                <span class="option-label">${label}</span>
                <span class="option-text">${complexity}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('checkComplexityBtn').disabled = true;
}

function selectAnalysisComplexity(index, complexity) {
    analysisSelectedComplexity = complexity;
    
    document.querySelectorAll('#analysisComplexityOptions .option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    document.querySelectorAll('#analysisComplexityOptions .option')[index].classList.add('selected');
    document.getElementById('checkComplexityBtn').disabled = false;
}

function checkAnalysisComplexity() {
    const correctComplexity = currentAnalysisExercise.complexity;
    const feedback = document.getElementById('analysisFeedback');
    
    if (analysisSelectedComplexity === correctComplexity) {
        feedback.className = 'feedback show correct';
        feedback.innerHTML = `
            <div class="feedback-title">🎉 Perfect! You nailed all 3 steps!</div>
            <p><strong>Complete Solution:</strong></p>
            <p>1. Problem Type: ${currentAnalysisExercise.problemType || 'General'}</p>
            <p>2. Method: ${currentAnalysisExercise.methods}</p>
            <p>3. Complexity: ${correctComplexity}</p>
            <p style="margin-top: 15px;"><strong>Solution:</strong> ${currentAnalysisExercise.solution}</p>
        `;
        
        document.getElementById('analysisNextBtn').classList.remove('hidden');
    } else {
        feedback.className = 'feedback show incorrect';
        feedback.innerHTML = `
            <div class="feedback-title">❌ Not quite</div>
            <p>The correct complexity is: <strong>${correctComplexity}</strong></p>
            <p>Consider the input size and operations performed.</p>
        `;
    }
}

function nextAnalysisQuestion() {
    loadAnalysisQuestion();
}

