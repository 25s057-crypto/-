
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// public 폴더의 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`서버 실행: http://localhost:${port}`);
});
