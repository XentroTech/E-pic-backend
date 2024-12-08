// const ErrorHandler = require("./errorHandler");

const getDateRange = (interval) => {
  const now = new Date();
  let startDate;
  let endDate;

  switch (interval) {
    case "daily":
      // start of the day
      startDate = new Date(now.setHours(0, 0, 0, 0));
      // end of the day
      endDate = new Date(now.setHours(23, 59, 59, 999));
      break;
    case "weekly":
      // sat=0, sun=1 etc
      const dayOfWeek = now.getDay();
      startDate = new Date();
      // 1st day of week
      startDate.setDate(now.setDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date();
      // last day of week
      endDate.setDate(now.setDate() + (6 - dayOfWeek));
      endDate.setHours(23, 59, 59, 999);
      break;
    case "monthly":
      // 1st day of the month
      startDate = new Date(now.getFullYear(), now.getMonth(), 0);
      startDate.setHours(0, 0, 0, 0);
      // last day of the month
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "yearly":
      // 1st month of the year
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      // last month of the year
      endDate = new Date(now.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;

    default:
      return next(new ErrorHandler("Invalid interval"));
  }
  return { startDate, endDate };
};

module.exports = getDateRange;
