/*
 * <license header>
 */

// ActionsForm component specific types

import type { AdobeIntegrationProps } from '../../types'

// ActionsForm component props extend the common Adobe integration props
export interface ActionsFormProps extends AdobeIntegrationProps {
  // Additional form-specific props can be added here
}

// Define types for the component state
export interface ActionsFormState {
  actionSelected: string | null
  actionResponse: any
  actionResponseError: string | null
  actionHeaders: Record<string, any> | null
  actionHeadersValid: 'valid' | 'invalid' | null
  actionParams: Record<string, any> | null
  actionParamsValid: 'valid' | 'invalid' | null
  actionInvokeInProgress: boolean
  actionResult: string
}

// Define type for actions config
export type ActionsConfig = Record<string, string>
