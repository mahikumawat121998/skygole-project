// cron/unlockUsers.js
const cron = require('node-cron');
const { User } = require("../model/user.model.js");


const unlockExpiredAccounts = () => {
  cron.schedule('*/2 * * * *', async () => {
    const now = new Date();
    try {
      const result = await User.updateMany(
        { lockUntil: { $lte: now }, lockUntil: { $ne: null } },
        { $set: { failedAttempts: 0, lockUntil: null } }
      );
      if (result.modifiedCount > 0) {
        console.log(`[CRON] ✅ Unlocked ${result.modifiedCount} user(s) at ${now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
      }
    } catch (error) {
      console.error('[CRON] ❌ Error unlocking users:', error.message);
    }
  });
};

module.exports = unlockExpiredAccounts;
