/*
 * <license header>
 */

import { Core } from '@adobe/aio-sdk'
import type { ActionParams, ActionResponse, ActionErrorResponse } from '@actions/types'
import fetch from 'node-fetch'
import * as action from '../../actions/generic/index'

jest.mock('@adobe/aio-sdk', () => ({
  Core: {
    Logger: jest.fn()
  }
}))

jest.mock('node-fetch')

const mockLoggerInstance = {
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn()
}

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

beforeEach(() => {
  jest.clearAllMocks()
  ;(Core.Logger as jest.Mock).mockReturnValue(mockLoggerInstance)
})

const fakeParams: ActionParams = {
  __ow_headers: { authorization: 'Bearer fake' }
}

describe('generic', () => {
  test('main should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })

  test('should set logger to use LOG_LEVEL param', async () => {
    await action.main({ ...fakeParams, LOG_LEVEL: 'fakeLevel' })
    expect(Core.Logger).toHaveBeenCalledWith(expect.any(String), { level: 'fakeLevel' })
  })

  test('should return an http response with the fetched content', async () => {
    const mockFetchResponse = {
      ok: true,
      json: () => Promise.resolve({ content: 'fake' })
    }

    mockFetch.mockResolvedValue(mockFetchResponse as never)
    const response = (await action.main(fakeParams)) as ActionResponse
    expect(response).toEqual({
      statusCode: 200,
      body: { content: 'fake' }
    })
  })

  test('if there is an error should return a 500 and log the error', async () => {
    const fakeError = new Error('fake')
    mockFetch.mockRejectedValue(fakeError)
    const response = (await action.main(fakeParams)) as ActionErrorResponse
    expect(response).toEqual({
      error: {
        statusCode: 500,
        body: { error: 'server error' }
      }
    })
    expect(mockLoggerInstance.error).toHaveBeenCalledWith(fakeError)
  })

  test('if returned service status code is not ok should return a 500 and log the status', async () => {
    const mockFetchResponse = {
      ok: false,
      status: 404
    }

    mockFetch.mockResolvedValue(mockFetchResponse as never)
    const response = (await action.main(fakeParams)) as ActionErrorResponse
    expect(response).toEqual({
      error: {
        statusCode: 500,
        body: { error: 'server error' }
      }
    })
    // error message should contain 404
    expect(mockLoggerInstance.error).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('404') })
    )
  })

  test('missing input request parameters, should return 400', async () => {
    const response = (await action.main({})) as ActionErrorResponse
    expect(response).toEqual({
      error: {
        statusCode: 400,
        body: { error: "missing header(s) 'authorization'" }
      }
    })
  })
})
