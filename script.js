const QUESTIONS = [
    {
        kanji: "お茶を飲む",
        kana: "おちゃをのむ",
        romaji: "ochawonomu"
    },
    {
        kanji: "人間は幸福を求める",
        kana: "にんげんはこうふくをもとめる",
        romaji: "ningenhakoufukuomotomeru"
    }
];

let qIndex = 0;
let currentRomaji = "";
let index = 0;
let miss = 0;
let startTime;
let started = false;

const kanji = document.getElementById("sentence-kanji");
const kana = document.getElementById("sentence-kana");
const typed = document.getElementById("typed");
const untyped = document.getElementById("untyped");
const missElem = document.getElementById("miss");

function loadQuestion() {
    if (qIndex >= QUESTIONS.length) {
        finish();
        return;
    }

    const q = QUESTIONS[qIndex];

    kanji.innerText = q.kanji;
    kana.innerText = q.kana;

    currentRomaji = q.romaji;
    index = 0;

    typed.innerText = "";
    untyped.innerText = currentRomaji;
}

window.addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;

    if (!started) {
        started = true;
        startTime = Date.now();
        document.getElementById("start").style.display = "none";
        loadQuestion();
        return;
    }

    const key = e.key.toLowerCase();

    if (key === currentRomaji[index]) {
        index++;

        typed.innerText = currentRomaji.slice(0, index);
        untyped.innerText = currentRomaji.slice(index);

        if (index === currentRomaji.length) {
            qIndex++;
            setTimeout(loadQuestion, 200);
        }
    } else {
        miss++;
        missElem.innerText = miss;
    }
});

function finish() {
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");

    const time = (Date.now() - startTime) / 1000;
    const score = Math.floor((typed.innerText.length / time) * 60 - miss * 5);

    document.getElementById("time").innerText = "時間: " + time.toFixed(2) + "秒";
    document.getElementById("score").innerText = "スコア: " + score;
    document.getElementById("miss-result").innerText = "ミス: " + miss;
}
