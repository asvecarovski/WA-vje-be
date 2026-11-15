export function checkArray(array) {
  return Array.isArray(array) && array.length > 0;
}

export function same_arrays(arr1, arr2) {
  if (!checkArray(arr1) || !checkArray(arr2)) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((value) => arr2.includes(value));
}
