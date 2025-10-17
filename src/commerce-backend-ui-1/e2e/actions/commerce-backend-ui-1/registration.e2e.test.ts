/*
 * <license header>
 */

describe('registration action e2e tests', () => {
  let action: { main: (params: Record<string, unknown>) => Promise<unknown> }

  beforeEach(async () => {
    // Dynamically import the action before each test to ensure fresh state
    action = await import('../../../actions/commerce-backend-ui-1/registration/index')
    jest.clearAllMocks()
  })

  describe('successful scenarios', () => {
    it('should return success response with default "Guest" name when no name is provided', async () => {
      const params = {
        __ow_headers: { authorization: 'Bearer mock-token' }
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: { message: string }
      }

      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual({
        message: 'Hello, Guest!'
      })
    })

    it('should return success response with custom name', async () => {
      const params = {
        __ow_headers: { authorization: 'Bearer mock-token' },
        name: 'John'
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: { message: string }
      }

      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual({
        message: 'Hello, John!'
      })
    })

    it('should handle name with whitespace', async () => {
      const params = {
        __ow_headers: { authorization: 'Bearer mock-token' },
        name: '  Alice  '
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: { message: string }
      }

      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual({
        message: 'Hello, Alice!'
      })
    })
  })

  describe('error scenarios', () => {
    it('should return 400 error when authorization header is missing', async () => {
      const params = {
        __ow_headers: {}
      }

      const result = (await action.main(params)) as {
        error: {
          statusCode: number
          body: { error: string }
        }
      }

      expect(result.error.statusCode).toBe(400)
      expect(result.error.body.error).toContain('authorization')
    })

    it('should handle empty string name by using default Guest', async () => {
      const params = {
        __ow_headers: { authorization: 'Bearer mock-token' },
        name: ''
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: { message: string }
      }

      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual({
        message: 'Hello, Guest!'
      })
    })

    it('should handle null name by using default Guest', async () => {
      const params = {
        __ow_headers: { authorization: 'Bearer mock-token' },
        name: null
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: { message: string }
      }

      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual({
        message: 'Hello, Guest!'
      })
    })

    it('should handle undefined name by using default Guest', async () => {
      const params = {
        __ow_headers: { authorization: 'Bearer mock-token' },
        name: undefined
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: { message: string }
      }

      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual({
        message: 'Hello, Guest!'
      })
    })
  })

  describe('logging', () => {
    it('should accept different LOG_LEVEL values', async () => {
      const params = {
        __ow_headers: { authorization: 'Bearer mock-token' },
        name: 'Test',
        LOG_LEVEL: 'debug'
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: { message: string }
      }

      expect(result.statusCode).toBe(200)
      expect(result.body.message).toBe('Hello, Test!')
    })
  })
})
