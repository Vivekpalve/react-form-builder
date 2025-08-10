import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { uid } from "../utils/id";
import type { FormField, FormSchema } from "../types/form";
import FieldList from "../components/FormBuilder/FieldList";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  createNewWorkingForm,
  setCurrentForm,
  saveForm,
  updateWorkingForm,
} from "../features/forms/formsSlice";

export default function CreateForm() {
  const dispatch = useAppDispatch();
  const current = useAppSelector((s) => s.forms.currentWorkingForm);
  const [localForm, setLocalForm] = useState<FormSchema | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    // initialize a working form if none exists
    if (!current) {
      dispatch(createNewWorkingForm({ name: "Untitled form" }));
    } else {
      setLocalForm(current);
    }
  }, [current, dispatch]);

  useEffect(() => {
    if (localForm) dispatch(updateWorkingForm(localForm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localForm]);

  const buttonStyle = {
    minWidth: "100px", // ensures equal width
    height: "48px", // ensures equal height
    textTransform: "uppercase",
    fontWeight: "bold",
    borderRadius: "8px",
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "#333",
    },
    "&.Mui-disabled": {
      backgroundColor: "#999",
      color: "#fff",
    },
  };

  const addField = (type: FormField["type"]) => {
    if (!localForm) return;
    const f: FormField = {
      id: uid(),
      type,
      label: `${type} field`,
      required: false,
      defaultValue: type === "checkbox" ? false : "",
      options:
        type === "select" || type === "radio" || type === "checkbox"
          ? ["Option 1"]
          : [],
      validation: {},
      derived: {
        isDerived: false,
        parentFieldIds: [],
        expressionName: undefined,
        expression: "",
      },
    };
    setLocalForm({ ...localForm, fields: [...localForm.fields, f] });
  };

  const updateField = (updated: FormField) => {
    if (!localForm) return;
    setLocalForm({
      ...localForm,
      fields: localForm.fields.map((f) => (f.id === updated.id ? updated : f)),
    });
  };

  const deleteField = (id: string) => {
    if (!localForm) return;
    setLocalForm({
      ...localForm,
      fields: localForm.fields.filter((f) => f.id !== id),
    });
  };

  const reorderFields = (newFields: FormField[]) => {
    if (!localForm) return;
    setLocalForm({ ...localForm, fields: newFields });
  };

  const openSave = () => {
    setSaveName(localForm?.name ?? "Untitled form");
    setSaveDialogOpen(true);
  };

  const doSave = () => {
    if (!localForm) return;
    const toSave: FormSchema = {
      ...localForm,
      name: saveName,
      createdAt: new Date().toISOString(),
    };
    dispatch(saveForm({ form: toSave }));
    // set current working to saved one (so preview uses latest)
    dispatch(setCurrentForm(toSave));
    setSaveDialogOpen(false);
    alert("Form saved.");
  };

  if (!localForm) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h4">Create Form</Typography>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Form name"
            value={localForm.name}
            onChange={(e) =>
              setLocalForm({ ...localForm, name: e.target.value })
            }
          />
          <Button
            variant="outlined"
            onClick={() => addField("text")}
            sx={buttonStyle}
          >
            Add Text
          </Button>
          <Button
            variant="outlined"
            onClick={() => addField("number")}
            sx={buttonStyle}
          >
            Number
          </Button>
          <Button
            variant="outlined"
            onClick={() => addField("textarea")}
            sx={buttonStyle}
          >
            Textarea
          </Button>
          <Button
            variant="outlined"
            onClick={() => addField("select")}
            sx={buttonStyle}
          >
            Select
          </Button>
          <Button
            variant="outlined"
            onClick={() => addField("radio")}
            sx={buttonStyle}
          >
            Radio
          </Button>
          <Button
            variant="outlined"
            onClick={() => addField("checkbox")}
            sx={buttonStyle}
          >
            Checkbox
          </Button>
          <Button
            variant="outlined"
            onClick={() => addField("date")}
            sx={buttonStyle}
          >
            Date
          </Button>

          <Box sx={{ flexGrow: 1 }} />
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={openSave}
            sx={buttonStyle}
            disabled={localForm.fields.length === 0}
          >
            Save Form
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, mt: 2 }}>
        {localForm.fields.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ padding: "10px", fontStyle: "italic" }}
          >
            No fields yet. Click a button above to add your first field.
          </Typography>
        ) : (
          localForm.fields.map((field, index) => (
            <div key={index}>
              {/* Render your field component */}
              {field.label}
            </div>
          ))
        )}

        <Divider sx={{ my: 1 }} />
        <FieldList
          fields={localForm.fields}
          onReorder={reorderFields}
          onDelete={deleteField}
          onUpdate={updateField}
        />
      </Paper>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            label="Form Name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={doSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
