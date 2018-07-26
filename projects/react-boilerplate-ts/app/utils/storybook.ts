export const selectEnum = enumObj => {
  const obj = {};
  for (var n in enumObj) {
    obj[enumObj[n]] = n;
  }
  return obj;
};
