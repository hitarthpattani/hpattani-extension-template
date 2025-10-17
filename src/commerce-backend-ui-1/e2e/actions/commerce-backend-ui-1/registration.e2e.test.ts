/*
 * <license header>
 */

import { EXTENSION_ID } from '../../../actions/constants'

describe('registration action e2e tests', () => {
  let action: { main: (params: Record<string, unknown>) => Promise<unknown> }

  beforeEach(async () => {
    // Dynamically import the action before each test to ensure fresh state
    action = await import('../../../actions/commerce-backend-ui-1/registration/index')
    jest.clearAllMocks()
  })

  describe('successful scenarios', () => {
    it('should return registration configuration', async () => {
      const params = {
        __ow_headers: {}
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: {
          registration: {
            menuItems: Array<Record<string, unknown>>
            page: Record<string, unknown>
          }
        }
      }

      expect(result.statusCode).toBe(200)
      expect(result.body).toHaveProperty('registration')
      expect(result.body.registration).toHaveProperty('menuItems')
      expect(result.body.registration).toHaveProperty('page')
    })

    it('should return correct menu items structure', async () => {
      const params = {
        __ow_headers: {}
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: {
          registration: {
            menuItems: Array<{
              id: string
              title: string
              parent?: string
              sortOrder: number
              isSection?: boolean
            }>
            page: { title: string }
          }
        }
      }

      expect(result.body.registration.menuItems).toHaveLength(2)
      expect(result.body.registration.menuItems[0]).toEqual({
        id: `${EXTENSION_ID}::first`,
        title: 'Adobe Commerce First App on App Builder',
        parent: `${EXTENSION_ID}::apps`,
        sortOrder: 1
      })
      expect(result.body.registration.menuItems[1]).toEqual({
        id: `${EXTENSION_ID}::apps`,
        title: 'Apps',
        isSection: true,
        sortOrder: 100
      })
    })

    it('should return correct page configuration', async () => {
      const params = {
        __ow_headers: {}
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: {
          registration: {
            menuItems: Array<Record<string, unknown>>
            page: { title: string }
          }
        }
      }

      expect(result.body.registration.page).toEqual({
        title: 'Adobe Commerce First App on App Builder'
      })
    })

    it('should work without any parameters', async () => {
      const params = {
        __ow_headers: {}
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: {
          registration: Record<string, unknown>
        }
      }

      expect(result.statusCode).toBe(200)
      expect(result.body.registration).toBeDefined()
    })
  })

  describe('logging', () => {
    it('should accept different LOG_LEVEL values', async () => {
      const params = {
        __ow_headers: {},
        LOG_LEVEL: 'debug'
      }

      const result = (await action.main(params)) as {
        statusCode: number
        body: {
          registration: Record<string, unknown>
        }
      }

      expect(result.statusCode).toBe(200)
      expect(result.body.registration).toBeDefined()
    })
  })
})
