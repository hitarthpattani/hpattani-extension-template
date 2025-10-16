/*
 * <license header>
 */

// Home component currently uses React.FC with no props
// This file is created for consistency and future extensibility

export interface HomeProps {
  // No props currently needed, but interface ready for future props
  welcomeMessage?: string
  showFeatures?: boolean
}

export interface WelcomeConfig {
  title: string
  subtitle?: string
  features?: string[]
}
