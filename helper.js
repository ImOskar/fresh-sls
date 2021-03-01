module.exports.getFridayNumber = () => {
  let dayMs = 86400000;
  let firstFridayOf21Ms = new Date(2021, 0, 1).getTime();
  let todayMs = new Date().getTime();
  let diffInMs = todayMs - firstFridayOf21Ms;
  let fridayNumber = Math.floor(diffInMs / dayMs / 7);
  return fridayNumber;
};
