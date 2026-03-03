export interface Card {
  id: string;
  title: string;
  description: string;  // markdown-supported
  tags: string[];        // multiple tags
  dueDate: string | null;
  createdDate: string;
}