import type { ValidationRules, FieldType } from "../../types/form";
import {
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  Stack,
  Typography,
} from "@mui/material";

export default function ValidationEditor({
  validation,
  onChange,
  fieldType,
}: {
  validation?: ValidationRules | undefined | null;
  onChange: (v: ValidationRules) => void;
  fieldType: FieldType;
}) {
  const v = validation ?? {};
  const set = (patch: Partial<ValidationRules>) => onChange({ ...v, ...patch });

  return (
    <Box>
      <Typography variant="subtitle2">Validation</Typography>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mt: 1, flexWrap: "wrap" }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={!!v.notEmpty}
              onChange={(e) => set({ notEmpty: e.target.checked })}
            />
          }
          label="Not empty"
        />
        <TextField
          label="Min length"
          type="number"
          value={v.minLength ?? ""}
          onChange={(e) =>
            set({
              minLength: e.target.value === "" ? null : Number(e.target.value),
            })
          }
        />
        <TextField
          label="Max length"
          type="number"
          value={v.maxLength ?? ""}
          onChange={(e) =>
            set({
              maxLength: e.target.value === "" ? null : Number(e.target.value),
            })
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!v.email}
              onChange={(e) => set({ email: e.target.checked })}
            />
          }
          label="Email format"
        />
      </Stack>

      {fieldType === "number" && (
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Min value"
            type="number"
            value={v.minValue ?? ""}
            onChange={(e) =>
              set({
                minValue: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
          <TextField
            label="Max value"
            type="number"
            value={v.maxValue ?? ""}
            onChange={(e) =>
              set({
                maxValue: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
        </Stack>
      )}

      <Box sx={{ mt: 1 }}>
        <Typography variant="body2">Password rule</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Min length"
            type="number"
            value={v.passwordRule?.minLength ?? ""}
            onChange={(e) => {
              const min = e.target.value === "" ? null : Number(e.target.value);
              onChange({
                ...v,
                passwordRule:
                  min === null
                    ? null
                    : {
                        minLength: min,
                        mustContainNumber:
                          v.passwordRule?.mustContainNumber ?? false,
                      },
              });
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!v.passwordRule?.mustContainNumber}
                onChange={(e) => {
                  const pr = v.passwordRule ?? {
                    minLength: 8,
                    mustContainNumber: false,
                  };
                  onChange({
                    ...v,
                    passwordRule: {
                      minLength: pr.minLength ?? 8,
                      mustContainNumber: e.target.checked,
                    },
                  });
                }}
              />
            }
            label="Must contain number"
          />
        </Stack>
      </Box>
    </Box>
  );
}
