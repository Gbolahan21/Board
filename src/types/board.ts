export interface Board {
  id: string;
  title: string;
  description?: string;
  createdDate: string;
  columnIds: string[];     // columns inside this board
}