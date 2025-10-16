/*
 * <license header>
 */

// About component specific types

export interface AboutProps {
  // No props currently needed, but interface ready for future props
  showDocumentation?: boolean
  additionalLinks?: DocumentationLink[]
}

export interface DocumentationLink {
  title: string
  url: string
  description?: string
}
