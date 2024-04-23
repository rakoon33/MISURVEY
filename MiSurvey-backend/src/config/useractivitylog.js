const { userActivityLogService } = require("../services");
const db = require("./database");
const { namespace } = require('../middlewares/cls');  // Đảm bảo namespace đã được cấu hình

db.sequelize.addHook('afterCreate', async (instance) => {
    console.log("afterCreate hook triggered");
  
    const user = namespace.get('user');
    if (!user) {
      console.error("User not found in CLS namespace!");
      return; // Exit if user is not available
    }
  
    const description = `Created new ${instance.constructor.name} record.`;
  
    try {
      await userActivityLogService.logActivity(user.id, 'INSERT', description, instance.constructor.name, user.companyId);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  });
  

db.sequelize.addHook('afterUpdate', async (instance) => {
  const user = namespace.get('user');
  const description = `Updated ${instance.constructor.name} record.`;
  if (user) {
    userActivityLogService.logActivity(user.id, 'UPDATE', description, instance.constructor.name, user.companyId);
  }
});

db.sequelize.addHook('afterDestroy', async (instance) => {
  const user = namespace.get('user');
  const description = `Deleted ${instance.constructor.name} record.`;
  if (user) {
    userActivityLogService.logActivity(user.id, 'DELETE', description, instance.constructor.name, user.companyId);
  }
});

