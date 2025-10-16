/*
 * <license header>
 */

/* This file exposes some common utilities for your actions */

import type { ActionParams, ActionHeaders, ActionErrorResponse } from './types'

/**
 * Returns a log ready string of the action input parameters.
 * The `Authorization` header content will be replaced by '<hidden>'.
 *
 * @param {ActionParams} params action input parameters.
 *
 * @returns {string} string of the action input parameters.
 */
function stringParameters(params: ActionParams): string {
  // hide authorization token without overriding params
  let headers: ActionHeaders = (params.__ow_headers as ActionHeaders) || {}
  if (headers.authorization) {
    headers = { ...headers, authorization: '<hidden>' }
  }
  return JSON.stringify({ ...params, __ow_headers: headers })
}

/**
 * Returns the list of missing keys giving an object and its required keys.
 * A parameter is missing if its value is undefined or ''.
 * A value of 0 or null is not considered as missing.
 *
 * @param {Record<string, unknown>} obj object to check.
 * @param {Array<string>} required list of required keys.
 *        Each key can contain a dot notation a.b.c to check for nested key.
 *
 * @returns {Array<string>} list of missing keys.
 */
function getMissingKeys(obj: Record<string, unknown>, required: string[]): string[] {
  return required.filter(r => {
    const splits: string[] = r.split('.')
    const last: string = splits[splits.length - 1]
    const traverse: Record<string, unknown> = splits.slice(0, -1).reduce((tObj, split) => {
      tObj = (tObj[split] as Record<string, unknown>) || {}
      return tObj
    }, obj)
    return traverse[last] === undefined || traverse[last] === '' // missing default params are empty string
  })
}

/**
 * Returns the list of missing keys giving an object and its required keys.
 * A parameter is missing if its value is undefined or ''.
 * A value of 0 or null is not considered as missing.
 *
 * @param {ActionParams} params action input parameters.
 * @param {Array<string>} requiredParams list of required input parameters.
 * @param {Array<string>} requiredHeaders list of required input headers.
 *
 * @returns {string | null} error message if there are missing parameters or headers, null otherwise.
 */
function checkMissingRequestInputs(
  params: ActionParams,
  requiredParams: string[] = [],
  requiredHeaders: string[] = []
): string | null {
  let errorMessage: string | null = null

  // input headers are always lowercase
  const normalizedRequiredHeaders: string[] = requiredHeaders.map(h => h.toLowerCase())
  const headers: ActionHeaders = (params.__ow_headers as ActionHeaders) || {}

  // check for missing headers
  const missingHeaders: string[] = getMissingKeys(headers, normalizedRequiredHeaders)
  if (missingHeaders.length > 0) {
    errorMessage = `missing header(s) '${missingHeaders}'`
  }

  // check for missing parameters
  const missingParams: string[] = getMissingKeys(params, requiredParams)
  if (missingParams.length > 0) {
    if (errorMessage) {
      errorMessage += ' and '
    } else {
      errorMessage = ''
    }
    errorMessage += `missing parameter(s) '${missingParams}'`
  }

  return errorMessage
}

/**
 * Extracts the bearer token string from the Authorization header in the request parameters.
 *
 * @param {ActionParams} params action input parameters.
 *
 * @returns {string | undefined} the bearer token string or undefined if not set or invalid.
 */
function getBearerToken(params: ActionParams): string | undefined {
  const headers: ActionHeaders = (params.__ow_headers as ActionHeaders) || {}
  const authorization = headers.authorization as unknown
  if (typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
    return authorization.substring('Bearer '.length)
  }
  return undefined
}

/**
 * Returns an error response object and attempts to log.info the status code and error message
 *
 * @param {number} statusCode the error status code.
 *        e.g. 400
 * @param {string} message the error message.
 *        e.g. 'missing xyz parameter'
 * @param {*} [logger] an optional logger instance object with an `info` method
 *        e.g. `new require('@adobe/aio-sdk').Core.Logger('name')`
 *
 * @returns {ActionErrorResponse} the error object, ready to be returned from the action main function.
 */
function errorResponse(
  statusCode: number,
  message: string,
  logger?: { info: (msg: string) => void }
): ActionErrorResponse {
  if (logger && typeof logger.info === 'function') {
    logger.info(`${statusCode}: ${message}`)
  }

  return {
    error: {
      statusCode,
      body: {
        error: message
      }
    }
  }
}

export { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs }
