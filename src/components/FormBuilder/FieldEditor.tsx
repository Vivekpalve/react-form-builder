import type { FormField } from "../../types/form";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Button,
  Chip,
  Stack,
  Typography,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ValidationEditor from "./ValidationEditor";
import DerivedEditor from "./DerivedEditor";

export default function FieldEditor({
  field,
  onChange,
  onDelete,
  allFields,
}: {
  field: FormField;
  onChange: (f: FormField) => void;
  onDelete: () => void;
  allFields: FormField[];
}) {
  const set = (patch: Partial<FormField>) => onChange({ ...field, ...patch });

  const updateOption = (idx: number, value: string) => {
    const opts = [...(field.options || [])];
    opts[idx] = value;
    set({ options: opts });
  };
  const addOption = () => {
    set({
      options: [
        ...(field.options || []),
        `Option ${(field.options?.length ?? 0) + 1}`,
      ],
    });
  };
  const removeOption = (idx: number) => {
    const opts = [...(field.options || [])];
    opts.splice(idx, 1);
    set({ options: opts });
  };

  return (
    <Box sx={{ border: "1px solid #eee", p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Label"
          value={field.label}
          onChange={(e) => set({ label: e.target.value })}
        />
        <TextField
          label="Default"
          value={String(field.defaultValue ?? "")}
          onChange={(e) => {
            const val =
              field.type === "number"
                ? e.target.value === ""
                  ? ""
                  : Number(e.target.value)
                : e.target.value;
            set({ defaultValue: val });
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!field.required}
              onChange={(e) => set({ required: e.target.checked })}
            />
          }
          label="Required"
        />
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Stack>

      <Collapse in={["select", "radio", "checkbox"].includes(field.type)}>
        {["select", "radio", "checkbox"].includes(field.type) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Options</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {(field.options || []).map((opt, idx) => (
                <Chip
                  key={idx}
                  label={
                    <input
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      style={{ border: "none", background: "transparent" }}
                    />
                  }
                  onDelete={() => removeOption(idx)}
                />
              ))}
              <Button onClick={addOption}>Add option</Button>
            </Stack>
          </Box>
        )}
      </Collapse>

      <Box sx={{ mt: 2 }}>
        <ValidationEditor
          validation={field.validation}
          onChange={(v) => set({ validation: v })}
          fieldType={field.type}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <DerivedEditor
          field={field}
          allFields={allFields}
          onChange={(d) => set({ derived: d })}
        />
      </Box>
    </Box>
  );
}
