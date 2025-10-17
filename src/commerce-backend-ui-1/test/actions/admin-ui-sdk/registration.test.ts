/*
 * <license header>
 */

import { Core } from '@adobe/aio-sdk'
import type { ActionParams, ActionResponse } from '@actions/types'
import { EXTENSION_ID } from '@actions/constants'
import * as action from '../../../actions/admin-ui-sdk/registration/index'
import * as utils from '../../../actions/utils'

jest.mock('@adobe/aio-sdk', () => ({
  Core: {
    Logger: jest.fn()
  }
}))

const mockLoggerInstance = {
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(Core.Logger as jest.Mock).mockReturnValue(mockLoggerInstance)
})

describe('registration action', () => {
  describe('successful scenarios', () => {
    it('should return registration configuration with menu items and page', async () => {
      const params: ActionParams = {
        __ow_headers: {}
      }

      const response = (await action.main(params)) as ActionResponse

      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('registration')
      expect(response.body.registration).toHaveProperty('menuItems')
      expect(response.body.registration).toHaveProperty('page')
      expect(mockLoggerInstance.info).toHaveBeenCalledWith('Calling the main action')
      expect(mockLoggerInstance.info).toHaveBeenCalledWith('200: successful request')
    })

    it('should return correct menu items structure', async () => {
      const params: ActionParams = {
        __ow_headers: {}
      }

      const response = (await action.main(params)) as ActionResponse
      const registration = response.body.registration as {
        menuItems: Array<Record<string, unknown>>
        page: Record<string, unknown>
      }

      expect(registration.menuItems).toEqual([
        {
          id: `${EXTENSION_ID}::first`,
          title: 'Adobe Commerce First App on App Builder',
          parent: `${EXTENSION_ID}::apps`,
          sortOrder: 1
        },
        {
          id: `${EXTENSION_ID}::apps`,
          title: 'Apps',
          isSection: true,
          sortOrder: 100
        }
      ])
    })

    it('should return correct page configuration', async () => {
      const params: ActionParams = {
        __ow_headers: {}
      }

      const response = (await action.main(params)) as ActionResponse
      const registration = response.body.registration as {
        menuItems: Array<Record<string, unknown>>
        page: { title: string }
      }

      expect(registration.page).toEqual({
        title: 'Adobe Commerce First App on App Builder'
      })
    })

    it('should work without any parameters', async () => {
      const params: ActionParams = {
        __ow_headers: {}
      }

      const response = (await action.main(params)) as ActionResponse

      expect(response.statusCode).toBe(200)
      expect(response.body.registration).toBeDefined()
    })
  })

  describe('logging', () => {
    it('should log debug information when LOG_LEVEL is debug', async () => {
      const params: ActionParams = {
        __ow_headers: {},
        LOG_LEVEL: 'debug'
      }

      await action.main(params)

      expect(mockLoggerInstance.debug).toHaveBeenCalled()
    })

    it('should create logger with custom log level from params', async () => {
      const params: ActionParams = {
        __ow_headers: {},
        LOG_LEVEL: 'warn'
      }

      await action.main(params)

      expect(Core.Logger).toHaveBeenCalledWith('main', { level: 'warn' })
    })

    it('should create logger with default "info" level when LOG_LEVEL is not provided', async () => {
      const params: ActionParams = {
        __ow_headers: {}
      }

      await action.main(params)

      expect(Core.Logger).toHaveBeenCalledWith('main', { level: 'info' })
    })
  })

  describe('extension ID usage', () => {
    it('should use EXTENSION_ID constant in menu item IDs', async () => {
      const params: ActionParams = {
        __ow_headers: {}
      }

      const response = (await action.main(params)) as ActionResponse
      const registration = response.body.registration as {
        menuItems: Array<{ id: string; parent?: string }>
      }

      expect(registration.menuItems[0].id).toContain(EXTENSION_ID)
      expect(registration.menuItems[0].parent).toContain(EXTENSION_ID)
      expect(registration.menuItems[1].id).toContain(EXTENSION_ID)
    })
  })

  describe('error handling', () => {
    it('should return error when required parameters are missing', async () => {
      const params: ActionParams = {
        __ow_headers: {}
      }

      // Mock checkMissingRequestInputs to return an error message
      const checkMissingRequestInputsSpy = jest
        .spyOn(utils, 'checkMissingRequestInputs')
        .mockReturnValueOnce("missing header(s) 'authorization'")

      const response = await action.main(params)

      expect(response).toHaveProperty('error')
      const errorResponse = response as { error: { statusCode: number; body: { error: string } } }
      expect(errorResponse.error.statusCode).toBe(400)
      expect(errorResponse.error.body.error).toBe("missing header(s) 'authorization'")

      checkMissingRequestInputsSpy.mockRestore()
    })

    it('should handle unexpected Error exceptions in catch block', async () => {
      const params: ActionParams = {
        __ow_headers: {}
      }

      // Mock logger.info to throw an error
      mockLoggerInstance.info.mockImplementationOnce(() => {
        throw new Error('Logger error')
      })

      const response = await action.main(params)

      expect(response).toHaveProperty('error')
      const errorResponse = response as { error: { statusCode: number; body: { error: string } } }
      expect(errorResponse.error.statusCode).toBe(500)
      expect(errorResponse.error.body.error).toBe('Internal server error')
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        'Unexpected error in registration action:',
        'Logger error'
      )
    })

    it('should handle non-Error exceptions in catch block', async () => {
      const params: ActionParams = {
        __ow_headers: {}
      }

      // Mock logger.info to throw a non-Error exception
      mockLoggerInstance.info.mockImplementationOnce(() => {
        throw 'String error'
      })

      const response = await action.main(params)

      expect(response).toHaveProperty('error')
      const errorResponse = response as { error: { statusCode: number; body: { error: string } } }
      expect(errorResponse.error.statusCode).toBe(500)
      expect(errorResponse.error.body.error).toBe('Internal server error')
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        'Unexpected error in registration action:',
        'String error'
      )
    })
  })
})
