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

import { Core } from '@adobe/aio-sdk'
import { errorResponse, stringParameters, checkMissingRequestInputs } from '@actions/utils'
import { UserManager, User } from '@lib/user-manager'
import type { ActionParams, ActionResponse, ActionErrorResponse } from '@actions/types'

// main function that will be executed by Adobe I/O Runtime
async function main(params: ActionParams): Promise<ActionResponse | ActionErrorResponse> {
  // create a Logger
  const logger = Core.Logger('main', { level: (params.LOG_LEVEL as string) || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams: string[] = [
      /* add required params */
    ]
    const requiredHeaders: string[] = ['authorization']
    const errorMessage: string | null = checkMissingRequestInputs(
      params,
      requiredParams,
      requiredHeaders
    )
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    // Extract name parameter with proper validation and defaults
    const name: string = (params.name as string)?.trim() || 'Guest'

    // Create UserManager instance and get user with trimmed name
    const userManager = new UserManager()
    const user: User = userManager.get(name)

    const response: ActionResponse = {
      statusCode: 200,
      body: {
        message: `Hello, ${user.name}!`
      }
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // Handle UserManager validation errors as client errors (400)
    if (error instanceof Error && error.message.includes('Name must be')) {
      logger.warn(`UserManager validation error: ${error.message}`)
      return errorResponse(400, `Invalid input: ${error.message}`, logger)
    }

    // Handle unexpected errors as server errors (500)
    logger.error(
      'Unexpected error in generic action:',
      error instanceof Error ? error.message : String(error)
    )
    return errorResponse(500, 'Internal server error', logger)
  }
}

export { main }
