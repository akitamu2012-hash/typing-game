const QUESTIONS = [
    { kanji: "お茶を飲む", kana: "おちゃをのむ" },
    { kanji: "富士山に登る", kana: "ふじさんにのぼる" },
    { kanji: "キッチンでお料理", kana: "きっちんでおりょうり" },
    { kanji: "JavaScriptの練習", kana: "javascriptのれんしゅう" },
    { kanji: "少しずつ上達する", kana: "すこしずつじょうたつする" },
    { kanji: "人間は、何人といえども、不幸を退けて幸福を追い求め、それを得ようともがいている。", kana: "にんげんは、なんびとといえども、ふこうをしりぞけてこうふくをおいもとめ、それをえようともがいている。" },
    { kanji: "個人のささいな出来事から、歴史を左右する重大な問題に至るまで、すべては結局のところ、等しく、幸福になろうとする生の表現に他ならないのである。", kana: "こじんのささいなできごとから、れきしをさゆうするじゅうだいなもんだいにいたるまで、すべてはけっきょくのところ、ひとしく、こうふくになろうとするせいのひょうげんにほかならないのである。" }
];

// 以下そのまま（省略なし）
const ROMAN_MAP = {'あ':['a'],'い':['i'],'う':['u'],'え':['e'],'お':['o'],
'か':['ka'],'き':['ki'],'く':['ku'],'け':['ke'],'こ':['ko'],
'さ':['sa'],'し':['si','shi'],'す':['su'],'せ':['se'],'そ':['so'],
'た':['ta'],'ち':['ti','chi'],'つ':['tu','tsu'],'て':['te'],'と':['to'],
'な':['na'],'に':['ni'],'ぬ':['nu'],'ね':['ne'],'の':['no'],
'は':['ha'],'ひ':['hi'],'ふ':['fu','hu'],'へ':['he'],'ほ':['ho'],
'ま':['ma'],'み':['mi'],'む':['mu'],'め':['me'],'も':['mo'],
'や':['ya'],'ゆ':['yu'],'よ':['yo'],
'ら':['ra'],'り':['ri'],'る':['ru'],'れ':['re'],'ろ':['ro'],
'わ':['wa'],'を':['wo'],'ん':['nn','n']};

let qIndex = 0;
let currentKana = "";
let typedLog = "";
let isStarted = false;

const kanjiElem = document.getElementById("sentence-kanji");
const kanaElem = document.getElementById("sentence-kana");
const typedElem = document.getElementById("typed-text");
const untypedElem = document.getElementById("untyped-text");
const curIndexElem = document.getElementById("current-index");
const totalElem = document.getElementById("total-questions");
const startMsg = document.getElementById("start-message");

totalElem.innerText = QUESTIONS.length;

function initQuestion() {
    if (qIndex >= QUESTIONS.length) {
        document.getElementById("game-screen").classList.add("hidden");
        document.getElementById("result-screen").classList.remove("hidden");
        return;
    }
    currentKana = QUESTIONS[qIndex].kana;
    kanjiElem.innerText = QUESTIONS[qIndex].kanji;
    kanaElem.innerText = currentKana;
    typedLog = "";
    curIndexElem.innerText = qIndex + 1;
    updateDisplay("");
}

function updateDisplay(nextChar) {
    let tempTyped = typedLog + nextChar;
    typedElem.innerText = tempTyped;
    untypedElem.innerText = "";
    typedLog = tempTyped;

    if (typedLog.length >= currentKana.length) {
        qIndex++;
        setTimeout(initQuestion, 300);
    }
}

window.addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;

    if (!isStarted) {
        isStarted = true;
        startMsg.classList.add("hidden");
        initQuestion();
        return;
    }

    let input = e.key.toLowerCase();
    updateDisplay(input);
});
