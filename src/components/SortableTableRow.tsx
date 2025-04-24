import { Button, TableCell, TableRow } from "@mui/material";
import Report from "../core/report";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTableRow({
  report,
  onEdit,
  onDelete,
}: {
  report: Report;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: report.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "move",
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell {...listeners} style={{ cursor: "grab" }}>
        {report.id}
      </TableCell>
      <TableCell>{report.title}</TableCell>
      <TableCell align="right">
        <Button variant="outlined" onClick={onEdit}>
          Edit
        </Button>
      </TableCell>
      <TableCell align="right">
        <Button variant="outlined" onClick={onDelete}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}
