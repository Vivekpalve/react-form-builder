import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadAllForms, deleteForm } from "../features/forms/formsSlice";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

export default function MyForms() {
  const dispatch = useAppDispatch();
  const forms = useAppSelector((s) => s.forms.forms);

  useEffect(() => {
    dispatch(loadAllForms());
  }, [dispatch]);

  if (!forms.length) return <Typography>No saved forms yet.</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Forms
      </Typography>
      <List>
        {forms.map((f) => (
          <ListItem
            key={f.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  if (confirm("Delete this form?"))
                    dispatch(deleteForm({ id: f.id }));
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={<Link to={`/preview/${f.id}`}>{f.name}</Link>}
              secondary={dayjs(f.createdAt).format("YYYY-MM-DD HH:mm")}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
