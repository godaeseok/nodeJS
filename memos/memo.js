const fs = require("fs");
const path = require("path");
const readline = require("readline");

const memoDir = path.join(__dirname, "memos");
if (!fs.existsSync(memoDir)) {
    fs.mkdirSync(memoDir);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log("\n===== 간단한 메모장 =====");
    console.log("1. 새 메모 작성");
    console.log("2. 메모 목록 보기");
    console.log("3. 메모 읽기");
    console.log("4. 종료");
    rl.question("원하는 작업을 선택하세요 (1-4): ", handleMenu);
}

function handleMenu(option) {
    switch (option.trim()) {
        case "1":
            createMemo();
            break;
        case "2":
            listMemos();
            break;
        case "3":
            readMemo();
            break;
        case "4":
            console.log("메모장을 종료합니다.");
            rl.close();
            break;
        default:
            console.log("잘못된 입력입니다. 다시 선택하세요.");
            showMenu();
    }
}

function createMemo() {
    rl.question("메모 제목을 입력하세요: ", (title) => {
        rl.question("메모 내용을 입력하세요: ", (content) => {
            const fileName = `${new Date().toISOString().replace(/:/g, "-")}_${title}.txt`;
            fs.writeFileSync(path.join(memoDir, fileName), content);
            console.log(`메모가 저장되었습니다: ${fileName}`);
            showMenu();
        });
    });
}

function listMemos() {
    const files = fs.readdirSync(memoDir);
    if (files.length === 0) {
        console.log("📂 저장된 메모가 없습니다.");
    } else {
        console.log("\n===== 메모 목록 =====");
        files.forEach((file, index) => console.log(`${index + 1}. ${file.split('_').slice(1).join('_').replace('.txt', '')}`));
    }
    showMenu();
}

function readMemo() {
    const files = fs.readdirSync(memoDir);
    if (files.length === 0) {
        console.log("📂 저장된 메모가 없습니다.");
        return showMenu();
    }
    console.log("\n===== 메모 선택 =====");
    files.forEach((file, index) => console.log(`${index + 1}. ${file.split('_').slice(1).join('_').replace('.txt', '')}`));
    rl.question("읽을 메모 번호를 선택하세요: ", (num) => {
        const index = parseInt(num) - 1;
        if (index >= 0 && index < files.length) {
            const content = fs.readFileSync(path.join(memoDir, files[index]), "utf-8");
            console.log(`\n===== ${files[index].split('_').slice(1).join('_').replace('.txt', '')} =====`);
            console.log(content);
        } else {
            console.log("잘못된 번호입니다.");
        }
        showMenu();
    });
}

showMenu();