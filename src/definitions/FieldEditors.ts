export type FieldEditors =
  | ({
      editorType: "text";
      editorProps?: undefined;
    } & CheckingFn["string"])
  | ({
      editorType: "number";
      editorProps?: undefined;
    } & CheckingFn["number"])
  | ({
      editorType: "date";
      editorProps?: undefined;
    } & CheckingFn["string"])
  | ({
      editorType: "select";
      editorProps: SelectFieldEditorProps;
    } & CheckingFn["string"]);

type CheckingFn = {
  string: Partial<{
    parse: (value: string) => string;
    isValid: (value: string) => boolean;
  }>;
  number: Partial<{
    parse: (value: string) => number;
    isValid: (value: number) => boolean;
  }>;
  boolean: Partial<{
    parse: (value: string) => boolean;
    isValid: (value: boolean) => boolean;
  }>;
};

export type SelectFieldEditorProps = {
  options: {
    value: string;
    label: string;
  }[];
};
