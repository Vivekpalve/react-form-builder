import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { FormSchema } from "../types/form";
import FormRenderer from "../components/FormRenderer/FormRenderer";
import { useAppSelector } from "../store/hooks";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

export default function PreviewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const savedForms = useAppSelector((s) => s.forms.forms);
  const current = useAppSelector((s) => s.forms.currentWorkingForm);
  const [schema, setSchema] = useState<FormSchema | null>(null);

  useEffect(() => {
    if (id) {
      const found = savedForms.find((f) => f.id === id);
      setSchema(found ?? null);
    } else if (current) {
      setSchema(current);
    } else if (savedForms.length) {
      setSchema(savedForms[savedForms.length - 1]);
    } else {
      setSchema(null);
    }
  }, [id, savedForms, current]);

  // Empty state UI
  if (!schema || !schema.fields || schema.fields.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 10,
          p: 4,
          bgcolor: "#fafafa",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <InsertDriveFileOutlinedIcon sx={{ fontSize: 80, color: "#bbb" }} />
        <h2>No form to preview</h2>
        <p>Create a form in the Builder to see it here.</p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create")}
          sx={{ mt: 2 }}
        >
          Go to Builder
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Preview Mode Banner */}
      <Box
        sx={{
          background: "#f3f4f6",
          padding: "8px 16px",
          borderBottom: "1px solid #ddd",
          fontSize: "14px",
          color: "#555",
        }}
      >
        You are viewing this form in <strong>Preview Mode</strong>.
      </Box>

      {/* Back button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/create")}
        sx={{ mt: 2, mb: 2 }}
      >
        Back to Builder
      </Button>

      {/* Form preview with fade-in */}
      <Box sx={{ animation: "fadeIn 0.3s ease-in-out" }}>
        <FormRenderer schema={schema} />
      </Box>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}
