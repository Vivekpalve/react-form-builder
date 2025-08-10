import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FormSchema } from "../../types/form";
import { loadForms, saveForms } from "../../utils/localStorage";

type FormsState = {
  forms: FormSchema[];
  currentWorkingForm?: FormSchema | null;
};

const initialState: FormsState = {
  forms: loadForms(),
  currentWorkingForm: null,
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    setCurrentForm(state, action: PayloadAction<FormSchema | null>) {
      state.currentWorkingForm = action.payload;
    },
    createNewWorkingForm(
      state,
      action: PayloadAction<{ name?: string } | undefined>
    ) {
      const id = Date.now().toString();
      const newForm: FormSchema = {
        id,
        name: action?.payload?.name ?? "Untitled form",
        createdAt: new Date().toISOString(),
        fields: [],
      };
      state.currentWorkingForm = newForm;
    },
    updateWorkingForm(state, action: PayloadAction<FormSchema>) {
      state.currentWorkingForm = action.payload;
    },
    saveForm(state, action: PayloadAction<{ form: FormSchema }>) {
      // if a form with same id exists, replace; else push
      const idx = state.forms.findIndex((f) => f.id === action.payload.form.id);
      if (idx >= 0) state.forms[idx] = action.payload.form;
      else state.forms.push(action.payload.form);
      saveForms(state.forms);
    },
    deleteForm(state, action: PayloadAction<{ id: string }>) {
      state.forms = state.forms.filter((f) => f.id !== action.payload.id);
      saveForms(state.forms);
    },
    loadAllForms(state) {
      state.forms = loadForms();
    },
  },
});

export const {
  setCurrentForm,
  createNewWorkingForm,
  updateWorkingForm,
  saveForm,
  deleteForm,
  loadAllForms,
} = formsSlice.actions;
export default formsSlice.reducer;
