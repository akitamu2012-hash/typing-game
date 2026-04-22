const QUESTIONS = [
    { kanji: "お茶を飲む", kana: "おちゃをのむ" },
    { kanji: "人間は幸福を求める", kana: "にんげんはこうふくをもとめる" },
    { kanji: "富士山", kana: "ふじさん" },
    { kanji: "キッチン", kana: "きっちん" },
    { kanji: "JavaScriptの練習", kana: "javascriptのれんしゅう" }
];

const ROMAN_MAP = {
    'あ':['a'],'い':['i'],'う':['u'],'え':['e'],'お':['o'],
    'か':['ka'],'き':['ki'],'く':['ku'],'け':['ke'],'こ':['ko'],
    'さ':['sa'],'し':['si','shi'],'す':['su'],'せ':['se'],'そ':['so'],
    'た':['ta'],'ち':['ti','chi'],'つ':['tu','tsu'],'て':['te'],'と':['to'],
    'な':['na'],'に':['ni'],'ぬ':['nu'],'ね':['ne'],'の':['no'],
    'は':['ha'],'ひ':['hi'],'ふ':['fu','hu'],'へ':['he'],'ほ':['ho'],
    'ま':['ma'],'み':['mi'],'む':['mu'],'め':['me'],'も':['mo'],
    'や':['ya'],'ゆ':['yu'],'よ':['yo'],
    'ら':['ra'],'り':['ri'],'る':['ru'],'れ':['re'],'ろ':['ro'],
    'わ':['wa'],'を':['wo'],
    'ん':['nn'], // ★ここを nn のみに限定
    'が':['ga'],'ぎ':['gi'],'ぐ':['gu'],'げ':['ge'],'ご':['go'],
    'ざ':['za'],'じ':['zi','ji'],'ず':['zu'],'ぜ':['ze'],'ぞ':['zo'],
    'だ':['da'],'ぢ':['di'],'づ':['du'],'で':['de'],'ど':['do'],
    'ば':['ba'],'び':['bi'],'ぶ':['bu'],'べ':['be'],'ぼ':['bo'],
    'ぱ':['pa'],'ぴ':['pi'],'ぷ':['pu'],'ぺ':['pe'],'ぽ':['po'],
    'きゃ':['kya'],'きゅ':['kyu'],'きょ':['kyo'],
    'しゃ':['sya','sha'],'しゅ':['syu','shu'],'しょ':['syo','sho'],
    'ちゃ':['tya','cha'],'ちゅ':['tyu','chu'],'ちょ':['tyo','cho'],
    'にゃ':['nya'],'にゅ':['nyu'],'にょ':['nyo'],
    'ひゃ':['hya'],'ひゅ':['hyu'],'ひょ':['hyo'],
    'みゃ':['mya'],'みゅ':['myu'],'みょ':['myo'],
    'りゃ':['rya'],'りゅ':['ryu'],'りょ':['ryo'],
    'ぎゃ':['gya'],'ぎゅ':['gyu'],'ぎょ':['gyo'],
    'じゃ':['zya','ja','jya'],'じゅ':['zyu','ju','jyu'],'じょ':['zyo','jo','jyo'],
    'びゃ':['bya'],'びゅ':['byu'],'びょ':['byo'],
    'ぴゃ':['pya'],'ぴゅ':['pyu'],'ぴょ':['pyo'],
    'ー':['-'],' ':[' '],
    'a':['a'],'b':['b'],'c':['c'],'d':['d'],'e':['e'],'f':['f'],'g':['g'],
    'h':['h'],'i':['i'],'j':['j'],'k':['k'],'l':['l'],'m':['m'],'n':['n'],
    'o':['o'],'p':['p'],'q':['q'],'r':['r'],'s':['s'],'t':['t'],'u':['u'],
    'v':['v'],'w':['w'],'x':['x'],'y':['y'],'z':['z']
};

let qIndex = 0;
let typedLog = ""; 
let currentKana = "";
let missCount = 0;
let totalTypedCount = 0;
let startTime;
let isStarted = false;

const kanjiElem = document.getElementById("sentence-kanji");
const kanaElem = document.getElementById("sentence-kana");
const typedElem = document.getElementById("typed");
const untypedElem = document.getElementById("untyped");
const missElem = document.getElementById("miss");

function loadQuestion() {
    if (qIndex >= QUESTIONS.length) {
        finishGame();
        return;
    }
    currentKana = QUESTIONS[qIndex].kana;
    kanjiElem.innerText = QUESTIONS[qIndex].kanji;
    kanaElem.innerText = currentKana;
    typedLog = "";
    render();
}

/**
 * 判定ロジック
 */
function checkMatch(kana, typed) {
    if (typed === "") return true;

    function search(kIdx, tIdx) {
        if (tIdx === typed.length) return true;
        if (kIdx >= kana.length) return false;

        const char1 = kana[kIdx];
        const char2 = kana.substring(kIdx, kIdx + 2);

        // 促音「っ」
        if (char1 === "っ" && kIdx + 1 < kana.length) {
            const nextChar = kana[kIdx + 1];
            const nextCandidates = ROMAN_MAP[nextChar] || [nextChar];
            for (let r of nextCandidates) {
                const sokuon = r[0] + r;
                if (sokuon.startsWith(typed.substring(tIdx))) return true;
                if (typed.substring(tIdx).startsWith(sokuon)) {
                    if (search(kIdx + 1, tIdx + sokuon.length)) return true;
                }
            }
        }

        // 通常の文字判定（ん は ROMAN_MAP['ん'] つまり ['nn'] で判定される）
        const targets = [char2, char1];
        for (let t of targets) {
            if (ROMAN_MAP[t]) {
                for (let r of ROMAN_MAP[t]) {
                    const typedPart = typed.substring(tIdx);
                    if (r.startsWith(typedPart)) return true;
                    if (typedPart.startsWith(r)) {
                        if (search(kIdx + t.length, tIdx + r.length)) return true;
                    }
                }
            }
        }
        return false;
    }
    return search(0, 0);
}

function render() {
    let displayRomaji = getDisplayRomaji(currentKana, typedLog);
    typedElem.innerText = typedLog;
    untypedElem.innerText = displayRomaji.substring(typedLog.length);

    if (typedLog.length > 0 && typedLog === displayRomaji) {
        totalTypedCount += typedLog.length;
        qIndex++;
        setTimeout(loadQuestion, 150);
    }
}

function getDisplayRomaji(kana, typed) {
    function find(kIdx, tIdx, currentStr) {
        if (kIdx >= kana.length) return currentStr;

        const char1 = kana[kIdx];
        const char2 = kana.substring(kIdx, kIdx + 2);

        if (char1 === "っ" && kIdx + 1 < kana.length) {
            const nextCandidate = (ROMAN_MAP[kana[kIdx + 1]] || [kana[kIdx + 1]])[0];
            const sokuon = nextCandidate[0] + nextCandidate;
            return find(kIdx + 1, tIdx + sokuon.length, currentStr + sokuon);
        }

        const targets = [char2, char1];
        for (let t of targets) {
            if (ROMAN_MAP[t]) {
                const candidates = ROMAN_MAP[t];
                let best = candidates.find(r => typed.substring(tIdx).startsWith(r) || r.startsWith(typed.substring(tIdx)));
                if (!best) best = candidates[0];
                return find(kIdx + t.length, tIdx + best.length, currentStr + best);
            }
        }
        return currentStr + kana[kIdx];
    }
    return find(0, 0, "");
}

window.addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;

    if (!isStarted) {
        isStarted = true;
        startTime = Date.now();
        document.getElementById("start-overlay").classList.add("hidden");
        loadQuestion();
        return;
    }

    const input = e.key.toLowerCase();
    // ここでチェック
    if (checkMatch(currentKana, typedLog + input)) {
        typedLog += input;
        render();
    } else {
        missCount++;
        missElem.innerText = missCount;
    }
});

function finishGame() {
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");
    const duration = (Date.now() - startTime) / 1000;
    const score = Math.max(0, Math.floor((totalTypedCount / duration) * 60) - (missCount * 10));
    document.getElementById("time-result").innerText = `時間: ${duration.toFixed(2)}秒`;
    document.getElementById("score-result").innerText = `スコア: ${score}`;
    document.getElementById("miss-total").innerText = `ミス: ${missCount}`;
}