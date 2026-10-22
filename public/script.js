
const form = document.getElementById('game-form');
const gameList = document.getElementById('game-list');
const formMessage = document.getElementById('form-message');

// 현재는 브라우저 메모리에만 저장
let games = [];
let nextId = 1;

// 오늘 날짜를 기본값으로 설정
document.getElementById('game-date').value =
    new Date().toLocaleDateString('sv-SE');

function getResult(game) {
    if (game.myScore > game.opponentScore) {
        return '승리';
    }

    if (game.myScore < game.opponentScore) {
        return '패배';
    }

    return '무승부';
}

// 통계 계산
function updateStats() {
    const total = games.length;
    const wins = games.filter(game =>
        getResult(game) === '승리'
    ).length;

    const losses = games.filter(game =>
        getResult(game) === '패배'
    ).length;

    const draws = games.filter(game =>
        getResult(game) === '무승부'
    ).length;

    // 무승부는 승률 계산에서 제외
    const decidedGames = total - draws;

    const winRate = decidedGames === 0
        ? null
        : (wins / decidedGames) * 100;

    document.getElementById('total-games').innerHTML =
        `${total}<span>경기</span>`;

    document.getElementById('total-wins').innerHTML =
        `${wins}<span>경기</span>`;

    document.getElementById('win-rate').textContent =
        winRate === null ? '-' : `${winRate.toFixed(1)}%`;
}

// 기록 화면 출력
function renderGames() {
    gameList.replaceChildren();

    if (games.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty';
        empty.textContent = '아직 등록된 직관 기록이 없습니다.';
        gameList.appendChild(empty);
        return;
    }

    const sortedGames = [...games].sort((a, b) =>
        b.date.localeCompare(a.date) || b.id - a.id
    );

    sortedGames.forEach(game => {
        const result = getResult(game);

        const item = document.createElement('article');
        item.className = 'game-item';

        const info = document.createElement('div');
        info.className = 'game-info';

        const title = document.createElement('h3');
        title.textContent = `${game.team} vs ${game.opponent}`;

        const date = document.createElement('p');
        date.textContent = `${game.date} · ${game.stadium}`;

        const score = document.createElement('p');
        score.textContent =
            `${game.myScore} : ${game.opponentScore}`;

        const resultText = document.createElement('p');
        resultText.className = 'result';

        if (result === '패배') {
            resultText.classList.add('loss');
        } else if (result === '무승부') {
            resultText.classList.add('draw');
        }

        resultText.textContent = result;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = '삭제';
        deleteButton.type = 'button';

        deleteButton.addEventListener('click', () => {
            games = games.filter(item => item.id !== game.id);
            renderGames();
            updateStats();
            formMessage.textContent = '기록을 삭제했습니다.';
        });

        info.append(title, date, score, resultText, deleteButton);
        item.appendChild(info);
        gameList.appendChild(item);
    });
}

// 경기 기록 등록
form.addEventListener('submit', event => {
    event.preventDefault();

    const date = document.getElementById('game-date').value;
    const stadium = document.getElementById('stadium').value;
    const team = document.getElementById('team').value;
    const opponent = document.getElementById('opponent').value;

    const myScoreInput = document.getElementById('my-score');
    const opponentScoreInput =
        document.getElementById('opponent-score');

    const myScore = myScoreInput.valueAsNumber;
    const opponentScore = opponentScoreInput.valueAsNumber;

    if (!date || !stadium || !team || !opponent) {
        formMessage.textContent = '모든 항목을 입력해 주세요.';
        return;
    }

    if (team === opponent) {
        formMessage.textContent = '응원팀과 상대팀은 달라야 합니다.';
        return;
    }

    if (
        !Number.isInteger(myScore) ||
        !Number.isInteger(opponentScore) ||
        myScore < 0 ||
        opponentScore < 0
    ) {
        formMessage.textContent = '점수를 올바르게 입력해 주세요.';
        return;
    }

    const game = {
        id: nextId++,
        date,
        stadium,
        team,
        opponent,
        myScore,
        opponentScore
    };

    games.push(game);

    renderGames();
    updateStats();

    form.reset();

    document.getElementById('game-date').value =
        new Date().toLocaleDateString('sv-SE');

    formMessage.textContent =
        `${getResult(game)}! 직관 기록을 추가했습니다.`;
});
