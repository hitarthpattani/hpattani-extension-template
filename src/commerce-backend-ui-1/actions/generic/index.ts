/*
 * <license header>
 */

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */

import fetch from 'node-fetch'
import { Core } from '@adobe/aio-sdk'
import type { ActionParams, ActionResponse, ActionErrorResponse } from '@actions/types'
import {
  errorResponse,
  getBearerToken,
  stringParameters,
  checkMissingRequestInputs
} from '@actions/utils'

// Define the expected params interface
interface GenericActionParams extends ActionParams {
  LOG_LEVEL?: string
  __ow_headers?: {
    authorization?: string
    [key: string]: unknown
  }
}

// main function that will be executed by Adobe I/O Runtime
async function main(params: GenericActionParams): Promise<ActionResponse | ActionErrorResponse> {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams: string[] = [
      /* add required params */
    ]
    const requiredHeaders: string[] = ['Authorization']
    const errorMessage: string | null = checkMissingRequestInputs(
      params,
      requiredParams,
      requiredHeaders
    )
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    // extract the user Bearer token from the Authorization header
    const _token: string | undefined = getBearerToken(params)

    // replace this with the api you want to access
    const apiEndpoint: string = 'https://adobeioruntime.net/api/v1'

    // fetch content from external api endpoint
    const res = await fetch(apiEndpoint)
    if (!res.ok) {
      throw new Error('request to ' + apiEndpoint + ' failed with status code ' + res.status)
    }
    const content = (await res.json()) as Record<string, unknown>
    const response: ActionResponse = {
      statusCode: 200,
      body: content
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

export { main }
