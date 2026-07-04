class PapuaQuizGame {
    constructor() {
        this.questions = [
            {
                id: 1,
                q: {
                    id: "Apa nama rumah adat khas pegunungan Papua yang berbentuk lingkaran dengan atap jerami melingkar?",
                    en: "What is the name of the traditional circular Papuan highland house with a conical straw roof?"
                },
                choices: [
                    { id: "Honai", en: "Honai", isCorrect: true },
                    { id: "Kariwari", en: "Kariwari", isCorrect: false },
                    { id: "Joglo", en: "Joglo", isCorrect: false },
                    { id: "Gadang", en: "Gadang", isCorrect: false }
                ]
            },
            {
                id: 2,
                q: {
                    id: "Di wilayah manakah letak kepulauan Raja Ampat yang terkenal dengan keanekaragaman hayati laut terkaya di dunia?",
                    en: "Where is the Raja Ampat archipelago, famous for the world's richest marine biodiversity, located?"
                },
                choices: [
                    { id: "Papua Barat", en: "West Papua", isCorrect: true },
                    { id: "Papua Selatan", en: "South Papua", isCorrect: false },
                    { id: "Papua Tengah", en: "Central Papua", isCorrect: false },
                    { id: "Papua Pegunungan", en: "Highland Papua", isCorrect: false }
                ]
            },
            {
                id: 3,
                q: {
                    id: "Apa kuliner pokok tradisional Papua yang terbuat dari pati sagu dan memiliki tekstur kenyal serta lengket?",
                    en: "What traditional Papuan staple food is made from sago starch and has a chewy, sticky texture?"
                },
                choices: [
                    { id: "Papeda", en: "Papeda", isCorrect: true },
                    { id: "Sagu Lempeng", en: "Sagu Lempeng", isCorrect: false },
                    { id: "Keladi Tumbuk", en: "Mashed Taro", isCorrect: false },
                    { id: "Nasi Uduk", en: "Nasi Uduk", isCorrect: false }
                ]
            },
            {
                id: 4,
                q: {
                    id: "Apa nama alat musik perkusi khas Papua yang mirip kendang berukuran ramping dan berbentuk jam pasir?",
                    en: "What is the name of the traditional Papuan percussion instrument similar to a slender hourglass drum?"
                },
                choices: [
                    { id: "Tifa", en: "Tifa", isCorrect: true },
                    { id: "Sasando", en: "Sasando", isCorrect: false },
                    { id: "Angklung", en: "Angklung", isCorrect: false },
                    { id: "Gamelan", en: "Gamelan", isCorrect: false }
                ]
            },
            {
                id: 5,
                q: {
                    id: "Burung eksotis manakah yang dijuluki 'Bird of Paradise' dan menjadi ikon keindahan alam Papua?",
                    en: "Which exotic bird is nicknamed the 'Bird of Paradise' and serves as the icon of Papua's nature?"
                },
                choices: [
                    { id: "Cendrawasih", en: "Cendrawasih (Bird of Paradise)", isCorrect: true },
                    { id: "Kakatua", en: "Cockatoo", isCorrect: false },
                    { id: "Merak", en: "Peacock", isCorrect: false },
                    { id: "Jalak Bali", en: "Bali Myna", isCorrect: false }
                ]
            },
            {
                id: 6,
                q: {
                    id: "Tari Yospan adalah singkatan dari tari rakyat pergaulan di Papua. Apa kepanjangan dari Yospan?",
                    en: "Yospan Dance is a popular social dance in Papua. What does 'Yospan' stand for?"
                },
                choices: [
                    { id: "Yosem dan Pancar", en: "Yosem and Pancar", isCorrect: true },
                    { id: "Yosudarso dan Pantai", en: "Yosudarso and Pantai", isCorrect: false },
                    { id: "Yowen dan Papua", en: "Yowen and Papua", isCorrect: false },
                    { id: "Yotefa dan Suku Paniai", en: "Yotefa and Suku Paniai", isCorrect: false }
                ]
            },
            {
                id: 7,
                q: {
                    id: "Apa nama tradisi memasak bersama menggunakan tumpukan batu membara untuk mengungkapkan rasa syukur dan perdamaian?",
                    en: "What is the name of the cooking ceremony using hot stones to celebrate gratitude and tribal peace?"
                },
                choices: [
                    { id: "Bakar Batu", en: "Bakar Batu", isCorrect: true },
                    { id: "Potong Jari", en: "Finger Cutting", isCorrect: false },
                    { id: "Tanam Sasi", en: "Tanam Sasi", isCorrect: false },
                    { id: "Iki Palek", en: "Iki Palek", isCorrect: false }
                ]
            },
            {
                id: 8,
                q: {
                    id: "Puncak gunung tertinggi di Indonesia yang diselimuti salju abadi terletak di Papua. Apa namanya?",
                    en: "The highest mountain peak in Indonesia, capped with eternal snow, is in Papua. What is its name?"
                },
                choices: [
                    { id: "Puncak Jaya (Carstensz Pyramid)", en: "Jaya Peak (Carstensz Pyramid)", isCorrect: true },
                    { id: "Gunung Rinjani", en: "Mount Rinjani", isCorrect: false },
                    { id: "Gunung Semeru", en: "Mount Semeru", isCorrect: false },
                    { id: "Gunung Kerinci", en: "Mount Kerinci", isCorrect: false }
                ]
            },
            {
                id: 9,
                q: {
                    id: "Rumah adat Kariwari di Jayapura memiliki ciri khas atap kerucut yang terdiri dari berapa tingkat?",
                    en: "The Kariwari traditional house in Jayapura features a conical roof. How many tiers does it have?"
                },
                choices: [
                    { id: "Tiga tingkat", en: "Three tiers", isCorrect: true },
                    { id: "Dua tingkat", en: "Two tiers", isCorrect: false },
                    { id: "Satu tingkat", en: "One tier", isCorrect: false },
                    { id: "Empat tingkat", en: "Four tiers", isCorrect: false }
                ]
            },
            {
                id: 10,
                q: {
                    id: "Di wilayah manakah Wasur National Park yang terkenal dengan sarang rayap Musamus raksasa berada?",
                    en: "Where is Wasur National Park, famous for giant Musamus termite mounds, located?"
                },
                choices: [
                    { id: "Merauke", en: "Merauke", isCorrect: true },
                    { id: "Biak", en: "Biak", isCorrect: false },
                    { id: "Wamena", en: "Wamena", isCorrect: false },
                    { id: "Nabire", en: "Nabire", isCorrect: false }
                ]
            }
        ];

        this.currentQuestionIdx = 0;
        this.score = 0;
        this.currentLang = 'id';
        this.selectedChoice = null;
    }

    init(currentLang) {
        this.currentLang = currentLang;
        this.resetGame();
        this.loadLeaderboard();
        this.renderQuestion();
    }

    setLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('game-screen').classList.contains('active')) {
            this.renderQuestion();
        }
        this.loadLeaderboard();
    }

    resetGame() {
        this.currentQuestionIdx = 0;
        this.score = 0;
        this.selectedChoice = null;
        
        document.getElementById('quiz-intro').classList.remove('d-none');
        document.getElementById('quiz-play').classList.add('d-none');
        document.getElementById('quiz-result').classList.add('d-none');
        
        const feedbackEl = document.getElementById('quiz-feedback');
        if (feedbackEl) {
            feedbackEl.className = 'quiz-feedback-box';
            feedbackEl.innerText = '';
        }
    }

    startGame() {
        this.resetGame();
        document.getElementById('quiz-intro').classList.add('d-none');
        document.getElementById('quiz-play').classList.remove('d-none');
        this.renderQuestion();
    }

    renderQuestion() {
        const qData = this.questions[this.currentQuestionIdx];
        if (!qData) return;

        // Progress Bar
        const progressPercent = ((this.currentQuestionIdx) / this.questions.length) * 100;
        document.getElementById('quiz-progress-bar').style.width = `${progressPercent}%`;
        document.getElementById('quiz-progress-text').innerText = `${this.currentQuestionIdx + 1} / ${this.questions.length}`;

        // Question text
        const questionText = this.currentLang === 'id' ? qData.q.id : qData.q.en;
        document.getElementById('quiz-question').innerText = questionText;

        // Choices
        const choicesContainer = document.getElementById('quiz-choices');
        choicesContainer.innerHTML = '';
        this.selectedChoice = null;

        // Hide Next button initially
        document.getElementById('quiz-next-btn').classList.add('d-none');

        qData.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-choice-btn glass-btn';
            
            const choiceText = this.currentLang === 'id' ? choice.id : choice.en;
            btn.innerHTML = `<span class="choice-prefix">${String.fromCharCode(65 + index)}</span> <span class="choice-content">${choiceText}</span>`;

            btn.addEventListener('click', () => {
                if (this.selectedChoice !== null) return; // Prevent double select
                this.selectChoice(btn, choice);
            });

            choicesContainer.appendChild(btn);
        });

        // Clear feedback
        const feedbackEl = document.getElementById('quiz-feedback');
        feedbackEl.className = 'quiz-feedback-box';
        feedbackEl.innerText = '';
    }

    selectChoice(btnElement, choice) {
        this.selectedChoice = choice;
        const feedbackEl = document.getElementById('quiz-feedback');
        
        // Show correct / incorrect visual classes
        const allButtons = document.querySelectorAll('.quiz-choice-btn');
        allButtons.forEach(btn => btn.disabled = true); // Disable all

        if (choice.isCorrect) {
            btnElement.classList.add('correct');
            this.score += 10;
            
            feedbackEl.className = 'quiz-feedback-box correct animated-bounce';
            feedbackEl.innerText = this.currentLang === 'id' ? '✨ Benar sekali!' : '✨ Spot on! Correct!';
        } else {
            btnElement.classList.add('wrong');
            feedbackEl.className = 'quiz-feedback-box wrong animated-shake';
            feedbackEl.innerText = this.currentLang === 'id' ? '❌ Kurang tepat!' : '❌ Incorrect!';
            
            // Highlight the correct one
            const qData = this.questions[this.currentQuestionIdx];
            const correctIndex = qData.choices.findIndex(c => c.isCorrect);
            if (correctIndex >= 0) {
                allButtons[correctIndex].classList.add('correct-highlight');
            }
        }

        // Show navigation button
        const nextBtn = document.getElementById('quiz-next-btn');
        nextBtn.classList.remove('d-none');
        
        if (this.currentQuestionIdx === this.questions.length - 1) {
            nextBtn.innerText = this.currentLang === 'id' ? 'Lihat Hasil' : 'View Results';
        } else {
            nextBtn.innerText = this.currentLang === 'id' ? 'Pertanyaan Selanjutnya' : 'Next Question';
        }
    }

    nextQuestion() {
        if (this.currentQuestionIdx === this.questions.length - 1) {
            this.showResults();
        } else {
            this.currentQuestionIdx++;
            this.renderQuestion();
        }
    }

    showResults() {
        document.getElementById('quiz-play').classList.add('d-none');
        document.getElementById('quiz-result').classList.remove('d-none');
        document.getElementById('quiz-progress-bar').style.width = `100%`;

        document.getElementById('quiz-final-score').innerText = this.score;

        // Badge determination
        let badge = '';
        let badgeIcon = '';
        let badgeClass = '';
        
        if (this.score >= 90) {
            badge = this.currentLang === 'id' ? 'Ahli Papua (Papua Expert)' : 'Papua Expert';
            badgeIcon = '👑';
            badgeClass = 'badge-expert';
        } else if (this.score >= 70) {
            badge = this.currentLang === 'id' ? 'Penjelajah (Explorer)' : 'Explorer';
            badgeIcon = '🧭';
            badgeClass = 'badge-explorer';
        } else {
            badge = this.currentLang === 'id' ? 'Pemula (Beginner)' : 'Beginner';
            badgeIcon = '🌱';
            badgeClass = 'badge-beginner';
        }

        const badgeBox = document.getElementById('quiz-badge-display');
        badgeBox.className = `badge-display-card ${badgeClass}`;
        badgeBox.innerHTML = `
            <div class="badge-icon">${badgeIcon}</div>
            <h4>${badge}</h4>
        `;

        // Pre-fill name if stored
        const storedName = localStorage.getItem('papua_player_name') || '';
        document.getElementById('player-name-input').value = storedName;
    }

    async submitScore() {
        const nameInput = document.getElementById('player-name-input');
        const playerName = nameInput.value.trim();

        if (!playerName) {
            alert(this.currentLang === 'id' ? 'Harap masukkan nama Anda!' : 'Please enter your name!');
            return;
        }

        // Cache player name
        localStorage.setItem('papua_player_name', playerName);

        try {
            const response = await fetch('/api/leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    player_name: playerName,
                    score: this.score
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                // Success submission
                nameInput.disabled = true;
                document.getElementById('submit-score-btn').disabled = true;
                
                // Show congratulations rank
                const feedbackEl = document.getElementById('submit-feedback');
                feedbackEl.innerHTML = this.currentLang === 'id' 
                    ? `Skor disimpan! Peringkat Anda: <strong>#${result.rank}</strong>`
                    : `Score saved! Your Rank: <strong>#${result.rank}</strong>`;
                
                this.loadLeaderboard();
            }
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    }

    async loadLeaderboard() {
        const listContainer = document.getElementById('leaderboard-list');
        if (!listContainer) return;

        try {
            const response = await fetch('/api/leaderboard');
            const data = await response.json();

            listContainer.innerHTML = '';
            
            if (data.length === 0) {
                listContainer.innerHTML = `<tr><td colspan="4" class="text-center">${this.currentLang === 'id' ? 'Belum ada peringkat.' : 'No leaderboard entries yet.'}</td></tr>`;
                return;
            }

            data.forEach((entry, index) => {
                const tr = document.createElement('tr');
                let medal = index + 1;
                if (index === 0) medal = '🥇';
                else if (index === 1) medal = '🥈';
                else if (index === 2) medal = '🥉';

                let badgeClass = 'badge-beginner';
                if (entry.badges.includes('Expert')) badgeClass = 'badge-expert-tag';
                else if (entry.badges.includes('Explorer')) badgeClass = 'badge-explorer-tag';

                tr.innerHTML = `
                    <td class="rank-col">${medal}</td>
                    <td class="player-col">${escapeHTML(entry.player_name)}</td>
                    <td class="score-col font-bold">${entry.score}</td>
                    <td class="badge-col"><span class="badge-tag ${badgeClass}">${entry.badges}</span></td>
                `;
                listContainer.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            listContainer.innerHTML = `<tr><td colspan="4" class="text-center text-red-500">Error loading leaderboard</td></tr>`;
        }
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

const papuaQuiz = new PapuaQuizGame();
export default papuaQuiz;
export { papuaQuiz };
