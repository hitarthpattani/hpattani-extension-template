/*
 * <license header>
 */

import { Core } from '@adobe/aio-sdk'
import type { ActionParams, ActionResponse, ActionErrorResponse } from '@actions/types'
import * as exampleAction from '../../../actions/example/generic/index'

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

const fakeParams: ActionParams = {
  __ow_headers: { authorization: 'Bearer fake_token' }
}

describe('example/generic action', () => {
  describe('main function', () => {
    it('should be defined', () => {
      expect(exampleAction.main).toBeInstanceOf(Function)
    })

    it('should use LOG_LEVEL parameter for logger', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      await exampleAction.main({ ...fakeParams, LOG_LEVEL: 'debug' })

      expect(Core.Logger).toHaveBeenCalledWith('main', { level: 'debug' })
    })

    it('should default to info level when LOG_LEVEL is not provided', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      await exampleAction.main(fakeParams)

      expect(Core.Logger).toHaveBeenCalledWith('main', { level: 'info' })
    })

    it('should return success response with default Guest user', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      const response = (await exampleAction.main(fakeParams)) as ActionResponse

      expect(response).toEqual({
        statusCode: 200,
        body: {
          message: 'Hello, Guest!'
        }
      })
      expect(mockUserManagerGet).toHaveBeenCalledWith('Guest')
    })

    it('should return success response with custom name parameter', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'John' })

      const response = (await exampleAction.main({
        ...fakeParams,
        name: 'John'
      })) as ActionResponse

      expect(response).toEqual({
        statusCode: 200,
        body: {
          message: 'Hello, John!'
        }
      })
      expect(mockUserManagerGet).toHaveBeenCalledWith('John')
    })

    it('should trim name parameter', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Alice' })

      await exampleAction.main({
        ...fakeParams,
        name: '  Alice  '
      })

      expect(mockUserManagerGet).toHaveBeenCalledWith('Alice')
    })

    it('should return 400 when missing authorization header', async () => {
      const response = (await exampleAction.main({})) as ActionErrorResponse

      expect(response).toEqual({
        error: {
          statusCode: 400,
          body: {
            error: "missing header(s) 'authorization'"
          }
        }
      })
    })

    it('should return 400 when UserManager throws validation error for empty name', async () => {
      mockUserManagerGet.mockImplementation(() => {
        throw new Error('Name must be a non-empty string')
      })

      const response = (await exampleAction.main({
        ...fakeParams,
        name: ''
      })) as ActionErrorResponse

      expect(response).toEqual({
        error: {
          statusCode: 400,
          body: {
            error: 'Invalid input: Name must be a non-empty string'
          }
        }
      })
      expect(mockLoggerInstance.warn).toHaveBeenCalledWith(
        'UserManager validation error: Name must be a non-empty string'
      )
    })

    it('should return 500 when name is whitespace only (not caught by validation pattern)', async () => {
      mockUserManagerGet.mockImplementation(() => {
        throw new Error('Name cannot be empty or whitespace only')
      })

      const response = (await exampleAction.main({
        ...fakeParams,
        name: '   '
      })) as ActionErrorResponse

      // This error doesn't match the "Name must be" pattern, so it's treated as an unexpected error
      expect(response.error.statusCode).toBe(500)
      expect(response.error.body.error).toBe('Internal server error')
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        'Unexpected error in generic action:',
        'Name cannot be empty or whitespace only'
      )
    })

    it('should return 500 when unexpected error occurs', async () => {
      mockUserManagerGet.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const response = (await exampleAction.main(fakeParams)) as ActionErrorResponse

      expect(response).toEqual({
        error: {
          statusCode: 500,
          body: {
            error: 'Internal server error'
          }
        }
      })
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        'Unexpected error in generic action:',
        'Database connection failed'
      )
    })

    it('should handle non-Error exceptions', async () => {
      mockUserManagerGet.mockImplementation(() => {
        // eslint-disable-next-line no-throw-literal
        throw 'String error'
      })

      const response = (await exampleAction.main(fakeParams)) as ActionErrorResponse

      expect(response).toEqual({
        error: {
          statusCode: 500,
          body: {
            error: 'Internal server error'
          }
        }
      })
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        'Unexpected error in generic action:',
        'String error'
      )
    })

    it('should log parameters at debug level', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      await exampleAction.main(fakeParams)

      expect(mockLoggerInstance.debug).toHaveBeenCalled()
    })

    it('should log info messages', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      await exampleAction.main(fakeParams)

      expect(mockLoggerInstance.info).toHaveBeenCalledWith('Calling the main action')
      expect(mockLoggerInstance.info).toHaveBeenCalledWith('200: successful request')
    })
  })
})
