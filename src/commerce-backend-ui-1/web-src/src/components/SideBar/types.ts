/*
 * <license header>
 */

// SideBar component specific types
// Common navigation types are imported from shared types

// SideBar component props
export interface SideBarProps {
  // No props currently needed, but interface ready for future props
  collapsed?: boolean
  onNavigate?: (path: string) => void
}
