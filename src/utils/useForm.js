import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import _isEqual from "lodash.isequal";
import _isEmpty from "lodash.isempty";
import _merge from "lodash.merge";

import { validateInput, validateValue } from "./validations";

let currentValues = {};
let currentValidations = {};
let globalValidStates = {};

function cloneObject(original) {
    return JSON.parse(JSON.stringify(original));
  }

const useForm = (
  inputValues,
  inputValidations,
  callback,
  onCancelCallback,
  currentFormName = "defaultForm"
) => {
  const [values, setValues] = useState(cloneObject(inputValues) || {});
  const [formName, setFormName] = useState(currentFormName);
  const [errors, setErrors] = useState({});
  const [validStates, setValidStates] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [validations, setValidations] = useState(
    cloneObject(inputValidations) || {}
  );

  // #region useEffects

  useEffect(() => {
    _isEmpty(currentValues[formName]) &&
      (currentValues[formName] = cloneObject(inputValues));
    _isEmpty(currentValidations[formName]) &&
      (currentValidations[formName] = cloneObject(inputValidations));
    return () => {
      delete currentValues[formName];
      delete currentValidations[formName];
      delete globalValidStates[formName];
    };
  }, []);

  // #endregion

  // #region onChange

  const handleChange = (event, disableDebounce = true) => {
    event.persist();
    currentValues[formName] = {
      ...currentValues[formName],
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    };
    if (disableDebounce) onChange(event);
    else onChangeDebounce(event);
  };

  const handleChangeWithoutEvent = useCallback((name, value) => {
    currentValues[formName] = { ...currentValues[formName], [name]: value };
    setValues((values) => ({ ...values, [name]: value }));
  }, []);

  const onChange = useCallback((event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    }));
  }, []);

  const onChangeDebounce = debounce(
    (event) => {
      setValues((values) => ({
        ...values,
        [event.target.name]: currentValues[formName][event.target.name],
      }));
    },
    400,
    {
      leading: false,
      trailing: true,
    }
  );

  // #endregion

  // #region onBlur

  const handleBlur = (event, callback) => {
    event.persist();
    if (validations[event.target.name])
      onBlur(event.target.name, event.target.value, callback);
  };

  const handleBlurWithoutEvent = (name, value, callback) => {
    if (validations[name]) onBlur(name, value, callback);
  };

  const onBlur = (name, value, callback) => {
    if (validations[name]) {
      const validation = validateValue(name, value, validations[name]);
      setErrors((errors) => ({ ...errors, [name]: validation.message }));
      if (validation.isValid && value && value.length === 0) {
        delete validStates[name];
        globalValidStates[formName] = validStates;
        setValidStates(validStates);
      } else {
        globalValidStates[formName] = {
          ...globalValidStates[formName],
          [name]: validation.isValid,
        };
        setValidStates((validStates) => ({
          ...validStates,
          [name]: validation.isValid,
        }));
      }

      // Check for form validity status
      const formValues = _merge(values, currentValues[formName]);
      const isFormValid = validateFields(formValues, validations, false);
      setIsValid(isFormValid);

      callback && callback(validation.isValid);
    }
  };

  // #endregion

  // #region errors

  const handleErrors = (errorDetails) => {
    const currentValidStates = { ...validStates };
    let currentErrors = { ...errors };
    Object.keys(errorDetails).forEach(function (key) {
      if (validations[key] && errorDetails[key]) {
        currentErrors[key] = errorDetails[key];
        currentValidStates[key] = false;
      }
    });

    globalValidStates[formName] = {
      ...globalValidStates[formName],
      ...currentValidStates,
    };

    setErrors((errors) => ({ ...errors, ...currentErrors }));
    setValidStates((validStates) => ({
      ...validStates,
      ...currentValidStates,
    }));
  };

  // #endregion

  // #region keyDown

  const handleKeyDown = (event, disableDebounce = true) => {
    event.persist();
    if (event.key === "Enter" && !disableDebounce) onChangeDebounce.flush();

    const inputRule = validations[event.target.name];

    if (
      inputRule &&
      !event.ctrlKey &&
      !validateInput(
        event.key,
        event.target.value,
        inputRule,
        event.keyCode,
        event.shiftKey
      )
    ) {
      event.preventDefault();
    }
  };

  // #endregion

  // #region handleSubmit

  const handleSubmit = (event) => {
    onChangeDebounce.flush();

    if (event) event.preventDefault();
    const formValues = _merge(values, currentValues[formName]);
    if (!_isEqual(formValues, values)) {
      currentValues[formName] = { ...formValues };
      setValues(formValues);
    }

    if (validateFields(formValues, validations))
      callback && callback(formValues);
  };
  // #endregion

  // #region handleCancel
  const handleCancel = (event) => {
    event.preventDefault();
    onChangeDebounce.cancel();
    onCancelCallback && onCancelCallback();
  };

  // #endregion

  // #region Update Form Level values/validations/validStates
  const updateFormState = (updatedValues) => {
    setValues(updatedValues);
    currentValues[formName] = updatedValues;
  };

  const updateFormValidStates = (newValidState) => {
    setValidStates(newValidState);
    globalValidStates[formName] = newValidState;
  };

  const updateFormValidation = (updatedValidation) => {
    setValidations(updatedValidation);
    currentValidations[formName] = { ...updatedValidation };
  };

  const updateFormError = (updatedErrors) => {
    setErrors(updatedErrors);
  };

  // #endregion

  // #region Update Field Level values/validations/validStates

  const updateIsValid = (isValid) => {
    setIsValid(isValid);
  };

  const updateValue = (name, updatedValue) => {
    setValues((values) => ({ ...values, [name]: updatedValue }));
    currentValues = getObject(currentValues, formName);
    currentValues[formName][name] = updatedValue;
  };

  const updateValidStates = (name, updatedValidState) => {
    setValidStates((validStates) => ({
      ...validStates,
      [name]: updatedValidState,
    }));
    globalValidStates = getObject(globalValidStates, formName);
    globalValidStates[formName][name] = updatedValidState;
  };

  const updateValidation = (name, updatedValidation) => {
    setValidations((validations) => ({
      ...validations,
      [name]: updatedValidation,
    }));
    currentValidations = getObject(currentValidations, formName);
    currentValidations[formName][name] = { ...updatedValidation };
  };

  // #endregion

  // #region validateFields

  const validateFields = (formValues, validations, updateState = true) => {
    let isFormValid = true;
    let currentValidStates = { ...validStates };
    let currentErrors = { ...errors };

    Object.keys(formValues).forEach(function (key) {
      if (validations[key]) {
        const validation = validateValue(
          key,
          formValues[key],
          validations[key]
        );
        if (updateState) {
          currentErrors[key] = validation.message;
          currentValidStates[key] = validation.isValid;
        }
        if (!validation.isValid && isFormValid) isFormValid = false;
      }
    });

    if (updateState) {
      globalValidStates[formName] = {
        ...globalValidStates[formName],
        ...currentValidStates,
      };

      setErrors((errors) => ({ ...errors, ...currentErrors }));
      setValidStates((validStates) => ({
        ...validStates,
        ...currentValidStates,
      }));
    }
    return isFormValid;
  };

  // #endregion

  // #region common functions

  const getObject = (inputObject, key) => {
    const newObject = inputObject ? { ...inputObject } : {};
    if (typeof newObject[key] === "undefined") newObject[key] = {};
    return newObject;
  };

  // #endregion

  return {
    errors,
    handleBlur,
    handleBlurWithoutEvent,
    handleCancel,
    handleChange,
    handleChangeWithoutEvent,
    handleErrors,
    handleKeyDown,
    handleSubmit,
    updateFormError,
    updateFormState,
    updateFormValidStates,
    updateFormValidation,
    updateIsValid,
    updateValidation,
    updateValidStates,
    updateValue,
    validStates,
    values,
    validateFields,
    validations,
    isValid,
  };
};

export default useForm;
