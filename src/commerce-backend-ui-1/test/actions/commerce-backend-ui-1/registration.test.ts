/*
 * <license header>
 */

import { Core } from '@adobe/aio-sdk'
import type { ActionParams, ActionResponse, ActionErrorResponse } from '@actions/types'
import * as action from '../../../actions/commerce-backend-ui-1/registration/index'

jest.mock('@adobe/aio-sdk', () => ({
  Core: {
    Logger: jest.fn()
  }
}))

const mockUserManagerGet = jest.fn()

jest.mock('@lib/user-manager', () => ({
  UserManager: jest.fn().mockImplementation(() => ({
    get: mockUserManagerGet
  }))
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
    it('should return success response with default "Guest" name when no name is provided', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      const params: ActionParams = {
        __ow_headers: { authorization: 'Bearer token' }
      }

      const response = (await action.main(params)) as ActionResponse

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        message: 'Hello, Guest!'
      })
      expect(mockUserManagerGet).toHaveBeenCalledWith('Guest')
      expect(mockLoggerInstance.info).toHaveBeenCalledWith('Calling the main action')
      expect(mockLoggerInstance.info).toHaveBeenCalledWith('200: successful request')
    })

    it('should return success response with custom name when name is provided', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'John' })

      const params: ActionParams = {
        __ow_headers: { authorization: 'Bearer token' },
        name: 'John'
      }

      const response = (await action.main(params)) as ActionResponse

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        message: 'Hello, John!'
      })
      expect(mockUserManagerGet).toHaveBeenCalledWith('John')
    })

    it('should trim whitespace from name parameter', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Alice' })

      const params: ActionParams = {
        __ow_headers: { authorization: 'Bearer token' },
        name: '  Alice  '
      }

      const response = (await action.main(params)) as ActionResponse

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        message: 'Hello, Alice!'
      })
      expect(mockUserManagerGet).toHaveBeenCalledWith('Alice')
    })

    it('should use "Guest" when name is empty string', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      const params: ActionParams = {
        __ow_headers: { authorization: 'Bearer token' },
        name: ''
      }

      const response = (await action.main(params)) as ActionResponse

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        message: 'Hello, Guest!'
      })
      expect(mockUserManagerGet).toHaveBeenCalledWith('Guest')
    })
  })

  describe('error scenarios', () => {
    it('should return 400 error when authorization header is missing', async () => {
      const params: ActionParams = {
        __ow_headers: {}
      }

      const response = (await action.main(params)) as ActionErrorResponse

      expect(response.error.statusCode).toBe(400)
      expect(response.error.body.error).toContain('authorization')
    })

    it('should return 400 error when UserManager throws validation error', async () => {
      mockUserManagerGet.mockImplementation((name: string) => {
        if (name === 'InvalidUser') {
          throw new Error('Name must be a non-empty string')
        }
        return { name }
      })

      const params: ActionParams = {
        __ow_headers: { authorization: 'Bearer token' },
        name: 'InvalidUser'
      }

      const response = (await action.main(params)) as ActionErrorResponse

      expect(response.error.statusCode).toBe(400)
      expect(response.error.body.error).toContain('Invalid input')
      expect(response.error.body.error).toContain('Name must be')
      expect(mockLoggerInstance.warn).toHaveBeenCalledWith(
        expect.stringContaining('UserManager validation error')
      )
    })

    it('should return 500 error when UserManager throws unexpected error', async () => {
      mockUserManagerGet.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const params: ActionParams = {
        __ow_headers: { authorization: 'Bearer token' },
        name: 'John'
      }

      const response = (await action.main(params)) as ActionErrorResponse

      expect(response.error.statusCode).toBe(500)
      expect(response.error.body.error).toBe('Internal server error')
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        'Unexpected error in generic action:',
        'Database connection failed'
      )
    })

    it('should return 500 error when UserManager throws non-Error exception', async () => {
      mockUserManagerGet.mockImplementation(() => {
        throw 'String error'
      })

      const params: ActionParams = {
        __ow_headers: { authorization: 'Bearer token' },
        name: 'John'
      }

      const response = (await action.main(params)) as ActionErrorResponse

      expect(response.error.statusCode).toBe(500)
      expect(response.error.body.error).toBe('Internal server error')
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        'Unexpected error in generic action:',
        'String error'
      )
    })
  })

  describe('logging', () => {
    it('should log debug information when LOG_LEVEL is debug', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'John' })

      const params: ActionParams = {
        __ow_headers: { authorization: 'Bearer token' },
        name: 'John',
        LOG_LEVEL: 'debug'
      }

      await action.main(params)

      expect(mockLoggerInstance.debug).toHaveBeenCalled()
    })

    it('should create logger with custom log level from params', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'John' })

      const params: ActionParams = {
        __ow_headers: { authorization: 'Bearer token' },
        LOG_LEVEL: 'warn'
      }

      await action.main(params)

      expect(Core.Logger).toHaveBeenCalledWith('main', { level: 'warn' })
    })

    it('should create logger with default "info" level when LOG_LEVEL is not provided', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      const params: ActionParams = {
        __ow_headers: { authorization: 'Bearer token' }
      }

      await action.main(params)

      expect(Core.Logger).toHaveBeenCalledWith('main', { level: 'info' })
    })
  })
})
