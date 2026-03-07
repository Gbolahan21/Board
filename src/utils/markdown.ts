import { marked } from "marked"
export const parseMarkdown = (text: string) => {
  return marked(text)
}