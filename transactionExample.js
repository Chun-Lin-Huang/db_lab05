// transactionExample.js
const pool = require('./db');

async function doTransaction() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction(); // 開始交易

        // 查詢學生的學號是否存在
        const checkStudent = 'SELECT * FROM STUDENT WHERE Student_ID = ?';
        const rows = await conn.query(checkStudent, ['S10810005']); // 學號不存在
        //const rows = await conn.query(checkStudent, ['S10811005']); // 學號存在
        if (rows.length === 0) {
            throw new Error('學生學號不存在');
        } else {
            console.log('學生學號存在，準備更新');
        }

        // 假設要同時將學生 'S10810005' 的系所由 CS001 換成 EE001
        const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
        await conn.query(updateStudent, ['EE001', 'S10810005']);
        //await conn.query(updateStudent, ['EE001', 'S10811005']);

        const result = await conn.query(checkStudent, ['S10810005']);
        //const result = await conn.query(checkStudent, ['S10811005']);
        console.log('更新後的學生資料：', result);

        const searchStudent = 'SELECT Department_ID FROM STUDENT WHERE Student_ID = ?';
        const result1 = await conn.query(searchStudent, ['S10810005']);
        //const result1 = await conn.query(searchStudent, ['S10811005']);
        console.log('更新後的學生系所：', result1);

        // 如果以上操作都成功，則提交交易
        await conn.commit();
        console.log('交易成功，已提交');

    } catch (err) {
        // 若有任何錯誤，回滾所有操作
        if (conn) await conn.rollback();
        console.error('交易失敗，已回滾：', err);
    } finally {
        if (conn) conn.release();
    }
}

doTransaction();