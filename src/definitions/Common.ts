import { FieldEditors } from "./FieldEditors";

export type RecordBase = { id: string };

export type Allow = {
  add?: boolean;
  edit?: boolean;
  delete?: boolean;
};

export type Actions<Field> = {
  onAdd?: (newRecord: Field) => void;
  onEdit?: (updatedRecord: Field) => void;
  onDelete?: (recordId: string) => void;
};

export type ColumnDefs<Record extends RecordBase> = (FieldEditors & {
  field: keyof Record;
  headerName: string;
  defaultValue?: string;
  allow?: Allow;
  actions?: Actions<Record>;
})[];

export type RowData<Record extends RecordBase> = Record[];

export type Currency = {
  code: string;
  rate: number;
};
export type Currencies = Currency[];
