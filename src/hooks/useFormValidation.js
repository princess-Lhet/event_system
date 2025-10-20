import { useCallback, useMemo, useState } from 'react';

// rules: { fieldName: [(value, values) => errorMessage || null] }
export default function useFormValidation(initialValues = {}, rules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, val) => {
    const fns = rules[name] || [];
    for (const fn of fns) {
      const msg = fn(val, { ...values, [name]: val });
      if (msg) return msg;
    }
    return null;
  }, [rules, values]);

  const validate = useCallback(() => {
    const nextErrors = {};
    for (const name of Object.keys({ ...values, ...rules })) {
      const msg = validateField(name, values[name]);
      if (msg) nextErrors[name] = msg;
    }
    setErrors(nextErrors);
    return nextErrors;
  }, [values, rules, validateField]);

  const register = useCallback((name) => ({
    name,
    value: values[name] ?? '',
    onChange: (e) => setValues(v => ({ ...v, [name]: e.target.value })),
    onBlur: (e) => {
      const msg = validateField(name, e.target.value);
      setErrors(err => ({ ...err, [name]: msg || undefined }));
    }
  }), [values, validateField]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return { values, setValues, errors, validate, validateField, register, isValid };
}
