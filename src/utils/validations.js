import _isEmpty from "lodash.isempty";

import { getTrimValue, isString } from "./stringService";
import { isObject } from "./objectService";

export function getRuleValue(rule) {
  return isObject(rule) ? rule.value : rule;
}

export function getErrorMessage(rule) {
  return isObject(rule) && typeof rule.message !== "undefined"
    ? rule.message
    : "";
}

/*
 * Set priotities of rules.
 * @param {object} rule - validation object
 * @return {object} newRule = {isMandatory: boolean, format: string, isMultiSpace: boolean, minLength: number, maxLength: number}
 */
function setRulesPriority(rule) {
  const newRule = {};
  rule.isMandatory && (newRule.isMandatory = rule.isMandatory);
  rule.format && (newRule.format = rule.format);
  rule.isMultiSpace && (newRule.isMultiSpace = rule.isMultiSpace);
  rule.minLength && (newRule.minLength = rule.minLength);
  rule.maxLength && (newRule.maxLength = rule.maxLength);
  return newRule;
}

function getDeadKeyValue(keyCode, isShiftPressed) {
  switch (keyCode) {
    case 54:
      return "^";
    case 192:
      return isShiftPressed ? "~" : "`";
    case 222:
      return isShiftPressed ? "'" : '"';
  }
  return "";
}

/**
 * Evaluate if entered character is valid or not based on passed validation
 * @param {string} key - key pressed
 * @param {string} value - value
 * @param {object} rule - validation object
 * @return {boolean} result
 */
export function validateInput(key, value, rule, keyCode, isShiftPressed) {
  let result = true;
  let pattern;
  let allowedKey = [
    "Backspace",
    "ArrowLeft",
    "Tab",
    "Delete",
    "ArrowRight",
    "Control",
    "Alt",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "Enter",
    "Home",
    "End",
  ];

  if (key === "Dead") {
    key = getDeadKeyValue(keyCode, isShiftPressed);
  }

  const selectedTextCount = window.getSelection().toString().length;

  if (JSON.stringify(rule).indexOf("number_withoutarraow") === -1)
    allowedKey = [...allowedKey, ...["ArrowDown", "ArrowUp"]];

  if (allowedKey.indexOf(key) !== -1) {
    result = true;
  } else {
    for (const x in rule) {
      switch (x) {
        case "format":
          switch (getRuleValue(rule.format)) {
            case "disableHtmlInput":
              // Restricting angle brackets to be input in text area
              result = result && /[^<>]/.test(key);
              break;
            case "alphaNumeric":
              // Restrict valid characters to alphaNonNumericsWithSpecialCharacters
              pattern = /([A-Za-z0-9])/;
              result = result && pattern.test(key);
              break;
            case "alphaNumericWithSpace":
              pattern = /([a-z]|[0-9]|[ ])/i;
              result = result && pattern.test(key);
              break;
            case "number":
              // Restrict to allow only numbers
              result = /([0-9])/.test(key);
              if (key.indexOf(".") > 0) result = result && false;
              break;
            case "countryCode":
              // Restrict to allow only numbers
              result = /^\+[0-9 ]{2,3}$/.test(key);
              if (key.indexOf(".") > 0) result = result && false;
              break;
            case "phoneNumber":
              // Restrict to allow only numbers
              result = /[0-9 ]{6,12}$/.test(key);
              if (key.indexOf(".") > 0) result = result && false;
              break;
            case "phoneNumberWithCountryCode":
              // Restrict to allow only numbers
              result = /^\+[0-9]{2,3}[0-9]{6,12}$/.test(key);
              if (key.indexOf(".") > 0) result = result && false;
              break;
            case "amount":
              pattern = /^[+-]?\d*\.?\d*$/;
              result = result && pattern.test(key);
              break;
            case "email":
              // Restrict valid characters to alphaNonNumericsWithSpecialCharacters for email
              pattern = /([A-Za-z0-9@_.-])/;
              result = result && pattern.test(key);
              break;
            case "maxLength":
              if (
                value &&
                value.length >= getRuleValue(rule.maxLength) &&
                !selectedTextCount
              ) {
                result = result && false;
              }
              break;
          }
      }
    }
  }
  return result;
}

/**
 * This Function is called for input value validation on blur
 * @param {string} name - name of the field
 * @param {string} value - value that need to be validated
 * @param {object} rule - validation object
 * @return {object} result  = { key: string, message: string, isValid: boolean }
 */
export function validateValue(name, value, rule) {
  let result;
  let msg = "";
  let status;
  let pattern;
  const key_name = name;
  const key_value = getTrimValue(value);
  let isValid = true;

  const newRule = setRulesPriority(rule);

  for (const x in newRule) {
    switch (x) {
      case "isMandatory":
        if (
          rule.isMandatory.value ||
          (typeof rule.isMandatory === "boolean" && rule.isMandatory)
        ) {
          if (
            typeof key_value === "undefined" ||
            key_value === null ||
            key_value.length === 0
          ) {
            // return blank msg for required fields
            msg = null;
            const errorMessage = getErrorMessage(rule.isMandatory);
            msg =
              errorMessage && errorMessage.length
                ? errorMessage
                : "Please enter value";
            isValid = isValid && false;
            result = { key: key_name, message: msg, isValid };
          }
        }
        break;
      case "format":
        {
          // Restricting angle brackets to be input in text area
          const format = getRuleValue(rule.format);
          const errorMessage = getErrorMessage(rule.format);
          if (format === "disableHtmlInput") {
            status = /[<>]/.test(key_value);
            if (status) {
              msg =
                errorMessage && errorMessage.length
                  ? errorMessage
                  : "Angular brackets are not allowed";
              isValid = isValid && false;
              result = { key: key_name, message: msg, isValid };
            }
          } else if (format === "alphaNumeric") {
            pattern = /^([A-Za-z0-9])*$/i;
            status = pattern.test(key_value);
            if (!status) {
              msg =
                errorMessage && errorMessage.length
                  ? errorMessage
                  : "Enter alpha numeric charachters only";
              isValid = isValid && false;
              result = { key: key_name, message: msg, isValid };
            }
          } else if (format === "alphaNumericWithSpace") {
            pattern = /^([a-z]|[0-9]|[ ])*$/i;
            status = pattern.test(key_value);
            if (!status) {
              msg =
                errorMessage && errorMessage.length
                  ? errorMessage
                  : "Enter alpha numeric with space only";
              isValid = isValid && false;
              result = { key: key_name, message: msg, isValid };
            }
          } else if (format === "number") {
            // Restrict to allow only numbers
            status = /^([0-9])*$/.test(key_value);
            if (typeof key_value === "string") {
              if (key_value.includes(".")) {
                status = false;
              }
            }
            if (!status) {
              msg =
                errorMessage && errorMessage.length
                  ? errorMessage
                  : "Please enter a valid number";
              isValid = isValid && false;
              result = { key: key_name, message: msg, isValid };
            }
          } else if (format === "countryCode") {
            // Restrict to allow only numbers
            status = /^\+[0-9 ]{2,3}$/.test(key_value);
            if (!status) {
              msg =
                errorMessage && errorMessage.length
                  ? errorMessage
                  : "Please enter a valid country code";
              isValid = isValid && false;
              result = { key: key_name, message: msg, isValid };
            }
          } else if (format === "phoneNumber") {
            // Restrict to allow only numbers
            status = /[0-9 ]{6,12}$/.test(key_value);
            if (!status) {
              msg =
                errorMessage && errorMessage.length
                  ? errorMessage
                  : "Please enter a valid phone number";
              isValid = isValid && false;
              result = { key: key_name, message: msg, isValid };
            }
          } else if (format === "phoneNumberWithCountryCode") {
            // Restrict to allow only numbers
            status = /^\+[0-9]{2,3}[0-9]{6,12}$/.test(key_value);
            if (!status) {
              msg =
                errorMessage && errorMessage.length
                  ? errorMessage
                  : "Please enter a valid phone number";
              isValid = isValid && false;
              result = { key: key_name, message: msg, isValid };
            }
          } else if (format === "amount") {
            // Restrict to allow only numbers
            status = /^[+-]?\d*\.?\d*$/.test(key_value);
            if (!status) {
              msg =
                errorMessage && errorMessage.length
                  ? errorMessage
                  : "Please enter a valid account balance";
              isValid = isValid && false;
              result = { key: key_name, message: msg, isValid };
            }
          } else if (format === "email") {
            if (key_value !== "") {
              // Regex from: https://www.w3resource.com/javascript/form/email-validation.php
              status = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(
                key_value
              );
              if (!status) {
                msg =
                  errorMessage && errorMessage.length
                    ? errorMessage
                    : "Fill in a valid email address";
                isValid = isValid && false;
                result = { key: key_name, message: msg, isValid };
              }
              break;
            }
          } else if (status === false) {
            msg = " ";
            isValid = isValid && false;
            result = { key: key_name, message: msg, isValid };
          }
        }
        break;
      case "minLength":
        {
          const minLength = getRuleValue(rule.minLength);
          const errorMessage = getErrorMessage(rule.minLength);
          if (minLength) {
            if (key_value && key_value.length < minLength) {
              msg =
                errorMessage && errorMessage.length
                  ? errorMessage
                  : `Minimum ${minLength} characters are required`;
              isValid = isValid && false;
              result = { key: key_name, message: msg, isValid };
            }
          }
        }
        break;
      case "maxLength":
        {
          const maxLength = getRuleValue(rule.maxLength);
          const errorMessage = getErrorMessage(rule.maxLength);
          if (maxLength) {
            if (key_value && key_value.length > maxLength) {
              msg =
                errorMessage && errorMessage.length
                  ? errorMessage
                  : `Maximum ${maxLength} characters are allowed`;
              isValid = isValid && false;
              result = { key: key_name, message: msg, isValid };
            }
          }
        }
        break;
    }
    if (result) break;
  }

  if (!result) result = { key: key_name, message: "", isValid: true };
  return result;
}
