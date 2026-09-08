const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

function formatTimestamp(date) {
    const pad = (value) => String(value).padStart(2, '0');

    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

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
    const newMemo = {
        id: memos.length + 1,
        text: `${formatTimestamp(new Date())} ${text}`
    };
    memos.push(newMemo);
    res.status(201).json(newMemo);
});

// PATCH: メモの訂正
app.patch('/api/memos/:id', (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Text is required' });
    }

    const memoId = Number(req.params.id);
    const memo = memos.find((item) => item.id === memoId);

    if (!memo) {
        return res.status(404).json({ error: 'Memo not found' });
    }

    memo.text = text.trim();
    res.json(memo);
});

// DELETE: 管理者によるメモ削除
app.delete('/api/admin/memos/:id', (req, res) => {
    const adminHeader = req.get('x-admin');
    if (adminHeader !== 'true') {
        return res.status(403).json({ error: 'Admin access is required' });
    }

    const memoId = Number(req.params.id);
    const memoIndex = memos.findIndex((memo) => memo.id === memoId);

    if (memoIndex === -1) {
        return res.status(404).json({ error: 'Memo not found' });
    }

    const [deletedMemo] = memos.splice(memoIndex, 1);
    res.json(deletedMemo);
});

// テスト用にappをエクスポート。直接実行された時だけサーバーを起動
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;