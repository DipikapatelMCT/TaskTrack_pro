import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface DataTableColumn<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export function DataTable<T>({ columns, data, onEdit, onDelete }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.accessorKey)}>{column.header}</TableHead>
          ))}
          {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            {columns.map((column) => (
              <TableCell key={String(column.accessorKey)}>
                {column.cell 
                  ? column.cell(row[column.accessorKey], row)
                  : String(row[column.accessorKey])
                }
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell>
                <ActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// 🆕 Extracted component for action buttons (Improves readability & reusability)
function ActionsCell<T>({ row, onEdit, onDelete }: { row: T; onEdit?: (row: T) => void; onDelete?: (row: T) => void }) {
  return (
    <div className="flex gap-2">
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row)}
          aria-label="Edit Row"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row)}
          aria-label="Delete Row"
          title="Delete"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
}
