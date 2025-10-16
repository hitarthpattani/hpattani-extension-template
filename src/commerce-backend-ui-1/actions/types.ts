/*
 * <license header>
 */

/* This file defines shared types for actions */

export type ActionParams = Record<string, unknown>

export type ActionHeaders = Record<string, unknown>

export interface ActionResponse {
  statusCode: number
  body: Record<string, unknown>
}

export interface ActionErrorResponse {
  error: {
    statusCode: number
    body: Record<string, unknown>
  }
}
