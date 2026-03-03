export interface Column {
  id: string;
  title: string;
  description?: string;
  createdDate: string;
  cardIds: string[];       // cards inside this column
}