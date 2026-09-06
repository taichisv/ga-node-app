const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// インメモリのメモデータ
let memos = [
    { id: 1, text: 'Hello GitHub Actions & Docker!' }
];

app.use(express.json());
app.use(express.static('public'));

// GET: メロ一覧の取得
app.get('/api/memos', (req, res) => {
    res.json(memos);
});

// POST: メモの追加
app.post('/api/memos', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    const newMemo = { id: memos.length + 1, text };
    memos.push(newMemo);
    res.status(201).json(newMemo);
});

// テスト用にappをエクスポート。直接実行された時だけサーバーを起動
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;