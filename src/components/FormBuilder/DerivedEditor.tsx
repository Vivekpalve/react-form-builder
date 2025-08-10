
import type { FormField, DerivedConfig } from "../../types/form";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";

export default function DerivedEditor({
  field,
  allFields,
  onChange,
}: {
  field: FormField;
  allFields: FormField[];
  onChange: (d: DerivedConfig) => void;
}) {
  const derived = field.derived ?? {
    isDerived: false,
    parentFieldIds: [],
    expressionName: undefined,
    expression: "",
  };

  const toggleDerived = (v: boolean) => onChange({ ...derived, isDerived: v });

  const toggleParent = (id: string) => {
    const exists = derived.parentFieldIds.includes(id);
    const parents = exists
      ? derived.parentFieldIds.filter((p) => p !== id)
      : [...derived.parentFieldIds, id];
    onChange({ ...derived, parentFieldIds: parents });
  };

  const setExpression = (expr: DerivedConfig["expressionName"]) =>
    onChange({ ...derived, expressionName: expr });

  return (
    <Box sx={{ borderTop: "1px dashed #eee", pt: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!derived.isDerived}
            onChange={(e) => toggleDerived(e.target.checked)}
          />
        }
        label="Derived field"
      />
      {derived.isDerived && (
        <>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Select parent field(s)
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            {allFields
              .filter((f) => f.id !== field.id)
              .map((f) => (
                <FormControlLabel
                  key={f.id}
                  control={
                    <Checkbox
                      checked={derived.parentFieldIds.includes(f.id)}
                      onChange={() => toggleParent(f.id)}
                    />
                  }
                  label={`${f.label} (${f.type})`}
                />
              ))}
          </Stack>

          <FormControl sx={{ mt: 2, minWidth: 220 }}>
            <InputLabel>Formula</InputLabel>
            <Select
              value={derived.expressionName ?? ""}
              label="Formula"
              onChange={(e) => setExpression(e.target.value as any)}
            >
              <MenuItem value="">Choose</MenuItem>
              <MenuItem value="ageFromDOB">ageFromDOB (DOB → Age)</MenuItem>
              <MenuItem value="sum">sum (numbers)</MenuItem>
              <MenuItem value="concat">concat (strings)</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Hint: pick parent fields appropriate to the formula. For ageFromDOB,
            pick one date field (DOB).
          </Typography>
        </>
      )}
    </Box>
  );
}
