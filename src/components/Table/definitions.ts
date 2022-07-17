import { FieldEditors } from "@definitions/FieldEditors";

export type RecordBase = { id: string };

export type ColumnDefs<Record extends RecordBase> = (FieldEditors & {
  field: keyof Record;
  headerName: string;
  defaultValue?: string;
  actions?: {
    onEdit?: (updatedValue: string) => void;
  };
})[];

export type RowDefs<Record extends RecordBase> = {
  actions?: {
    onAdd?: (newRecord: Record) => void;
    onEdit?: (updatedRecord: Record) => void;
    onDelete?: (deletedRecord: Record) => void;
  };
};

export type RowData<Record extends RecordBase> = Record[];

export type TableCellProps = {
  value: string;
  editorType: FieldEditors["editorType"];
  editorProps?: FieldEditors["editorProps"];
  actions?: {
    onEdit?: (updatedValue: string) => void;
  };
};

export type TableProps<Record extends RecordBase> = {
  columnDefs: ColumnDefs<Record>;
  rowDefs: RowDefs<Record>;
  rowData: RowData<Record>;
};
