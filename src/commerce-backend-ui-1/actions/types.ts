/*
 * <license header>
 */

/* This file defines shared types for actions */

export type ActionParams = Record<string, any>

export type ActionHeaders = Record<string, any>

export interface ActionResponse {
  statusCode: number
  body: Record<string, any>
}

export interface ActionErrorResponse {
  error: {
    statusCode: number
    body: Record<string, any>
  }
}
