/*
 * <license header>
 */

import { Core } from '@adobe/aio-sdk'
import fetch, { Response } from 'node-fetch'

// get action url
const namespace = Core.Config.get('runtime.namespace') as string
const hostname = (Core.Config.get('cna.hostname') as string) || 'adobeioruntime.net'
const runtimePackage = 'dx-excshell-1'
const actionUrl = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}/generic`

// The deployed actions are secured with the `require-adobe-auth` annotation.
// If the authorization header is missing, Adobe I/O Runtime returns with a 401 before the action is executed.
test('returns a 401 when missing Authorization header', async () => {
  const res: Response = await fetch(actionUrl)
  expect(res.status).toBe(401)
})
