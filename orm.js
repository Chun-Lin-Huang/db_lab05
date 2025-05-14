const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('university_db', 'root', '930729', {
  host: 'localhost',
  dialect: 'mariadb',
  logging: false,
});

// 封裝初始化邏輯為 Promise（供主程式等待）
const syncPromise = (async () => {
  try {
    await sequelize.authenticate();
    console.log('資料庫連線成功！');

    await sequelize.sync();
    console.log('模型同步成功！');
  } catch (error) {
    console.error('資料庫連線或模型同步失敗：', error);
    throw error;
  }
})();

module.exports = { sequelize, DataTypes, syncPromise };