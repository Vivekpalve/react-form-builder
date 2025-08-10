import type { FormField } from "../../types/form";
import FieldEditor from "./FieldEditor";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Box } from "@mui/material";

export default function FieldList({
  fields,
  onReorder,
  onDelete,
  onUpdate,
}: {
  fields: FormField[];
  onReorder: (newFields: FormField[]) => void;
  onDelete: (id: string) => void;
  onUpdate: (f: FormField) => void;
}) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newFields = Array.from(fields);
    const [moved] = newFields.splice(result.source.index, 1);
    newFields.splice(result.destination.index, 0, moved);
    onReorder(newFields);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="fields">
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {fields.map((f, idx) => (
              <Draggable key={f.id} draggableId={f.id} index={idx}>
                {(prov) => (
                  <Box
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    sx={{ mb: 1 }}
                  >
                    <FieldEditor
                      field={f}
                      onChange={onUpdate}
                      onDelete={() => onDelete(f.id)}
                      allFields={fields}
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
