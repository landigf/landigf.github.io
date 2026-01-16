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
    const exercise = selectWeightedRandom(weightedExercises);
    
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
    
    // Update UI
    document.getElementById('problemTitle').textContent = exercise.name;
    
    // Meta information
    const metaHtml = `
        ${exercise.week ? `<span class="badge badge-week">${exercise.week}</span>` : ''}
        ${exercise.complexity ? `<span class="badge badge-complexity">${exercise.complexity}</span>` : ''}
        ${exercise.methods ? `<span class="badge badge-method">${exercise.methods}</span>` : ''}
    `;
    document.getElementById('problemMeta').innerHTML = metaHtml;
    
    // Description
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateTotalStats();
});
