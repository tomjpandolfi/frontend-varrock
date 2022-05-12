/**
 * create a new copy of object
 * @param {object} original - original object
 * @return {any} object
 */
export function cloneObject(original) {
  return JSON.parse(JSON.stringify(original));
}

// Returns if a value is an object
export function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object;
}
