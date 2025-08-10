import React, { useEffect, useState } from "react";
import type { FormSchema, FormField } from "../../types/form";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
} from "@mui/material";
import { evalDerived } from "../../utils/evaluator";

export default function FormRenderer({ schema }: { schema: FormSchema }) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const defaults: Record<string, any> = {};
    schema.fields.forEach((f) => {
      defaults[f.id] = f.defaultValue ?? (f.type === "checkbox" ? false : "");
    });
    setValues(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema]);

  // Validation function
  const validateField = (f: FormField, val: any): string | null => {
    const v = f.validation ?? {};
    if (
      f.required &&
      (val === "" || val == null || (f.type === "checkbox" && val === false))
    )
      return "Required";
    if (v.notEmpty && String(val).trim() === "") return "Cannot be empty";
    if (v.minLength != null && String(val).length < v.minLength)
      return `Minimum length ${v.minLength}`;
    if (v.maxLength != null && String(val).length > v.maxLength)
      return `Maximum length ${v.maxLength}`;
    if (v.email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(String(val))) return "Invalid email";
    }
    if (v.passwordRule) {
      if (String(val).length < v.passwordRule.minLength)
        return `Password must be at least ${v.passwordRule.minLength}`;
      if (v.passwordRule.mustContainNumber && !/\d/.test(String(val)))
        return "Password must contain a number";
    }
    if (v.minValue != null && Number(val) < v.minValue)
      return `Minimum value ${v.minValue}`;
    if (v.maxValue != null && Number(val) > v.maxValue)
      return `Maximum value ${v.maxValue}`;
    return null;
  };

  // compute derived fields
  useEffect(() => {
    // compute in order — but simple approach: iterate until no change or limit
    const computeOnce = (baseValues: Record<string, any>) => {
      const next = { ...baseValues };
      schema.fields.forEach((f) => {
        if (f.derived?.isDerived) {
          const parentVals = f.derived.parentFieldIds.map(
            (pid) => baseValues[pid]
          );
          next[f.id] = evalDerived(f.derived.expressionName, parentVals);
        }
      });
      return next;
    };

    // apply once (good enough for tree-shaped dependencies)
    setValues((prev) => computeOnce(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema]); // note: recompute derived when schema changes

  // Recompute derived whenever values change
  useEffect(() => {
    const next = { ...values };
    schema.fields.forEach((f) => {
      if (f.derived?.isDerived) {
        const parentVals = f.derived.parentFieldIds.map((pid) => values[pid]);
        const newVal = evalDerived(f.derived.expressionName, parentVals);
        if (next[f.id] !== newVal) next[f.id] = newVal;
      }
    });
    setValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* watch values by using JSON */ JSON.stringify(values)]);

  const onChange = (id: string, v: any) => {
    setValues((prev) => ({ ...prev, [id]: v }));
    const field = schema.fields.find((x) => x.id === id);
    if (!field) return;
    const err = validateField(field, v);
    setErrors((prev) => ({ ...prev, [id]: err ?? "" }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    schema.fields.forEach((f) => {
      const err = validateField(f, values[f.id]);
      if (err) newErrors[f.id] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Form validated successfully (input not persisted).");
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
      <Typography variant="h4">{schema.name}</Typography>
      {schema.fields.map((f) => {
        const value = values[f.id];
        const error = errors[f.id];
        switch (f.type) {
          case "text":
            return (
              <TextField
                key={f.id}
                label={f.label}
                value={value ?? ""}
                onChange={(e) => onChange(f.id, e.target.value)}
                helperText={error}
                error={!!error}
              />
            );
          case "number":
            return (
              <TextField
                key={f.id}
                label={f.label}
                type="number"
                value={value ?? ""}
                onChange={(e) =>
                  onChange(
                    f.id,
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                helperText={error}
                error={!!error}
              />
            );
          case "textarea":
            return (
              <TextField
                key={f.id}
                label={f.label}
                multiline
                rows={4}
                value={value ?? ""}
                onChange={(e) => onChange(f.id, e.target.value)}
                helperText={error}
                error={!!error}
              />
            );
          case "select":
            return (
              <Box key={f.id}>
                <Select
                  fullWidth
                  value={value ?? ""}
                  onChange={(e) => onChange(f.id, e.target.value)}
                >
                  {(f.options || []).map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText error>{error}</FormHelperText>}
              </Box>
            );
          case "radio":
            return (
              <Box key={f.id}>
                <RadioGroup
                  value={value ?? ""}
                  onChange={(e) => onChange(f.id, e.target.value)}
                >
                  {(f.options || []).map((opt) => (
                    <FormControlLabel
                      key={opt}
                      value={opt}
                      control={<Radio />}
                      label={opt}
                    />
                  ))}
                </RadioGroup>
                {error && <FormHelperText error>{error}</FormHelperText>}
              </Box>
            );
          case "checkbox":
            return (
              <FormControlLabel
                key={f.id}
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={(e) => onChange(f.id, e.target.checked)}
                  />
                }
                label={f.label}
              />
            );
          case "date":
            return (
              <TextField
                key={f.id}
                label={f.label}
                type="date"
                value={value ?? ""}
                onChange={(e) => onChange(f.id, e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            );
          default:
            return null;
        }
      })}
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Box>
  );
}
