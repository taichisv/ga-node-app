const { test, expect } = require('@playwright/test');

test('ユーザーがメモを投稿すると日時付きで画面に表示される', async ({ page }) => {
    // 1. ローカルで起動しているアプリにアクセス
    await page.goto('http://localhost:3000');

    // 2. 入力欄に文字を入れて投稿
    await page.fill('#memoInput', 'テスト投稿です');
    await page.click('button:has-text("投稿")');

    // ★ここで一時停止して画面をじっくり見る
    await page.pause();
    
    // 3. 画面に投稿内容が表示されるのを待つ
    const memoItem = page.locator('#memoList li').last();
    await expect(memoItem).toContainText('テスト投稿です');

    // 4. 【安心の証拠】スクリーンショットを撮影して保存する（プロジェクト直下に保存）
    await page.screenshot({ path: 'test-results-screen/screenshot.png', fullPage: true });
});