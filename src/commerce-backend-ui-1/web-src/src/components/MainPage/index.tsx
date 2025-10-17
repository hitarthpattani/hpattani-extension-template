/*
 * <license header>
 */

import React, { useState, useEffect } from 'react'
import { Heading, View, Flex, ProgressCircle, Provider, lightTheme } from '@adobe/react-spectrum'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import type { MainPageProps } from './types'
import { attach } from '@adobe/uix-guest'
import { EXTENSION_ID } from '@web/types/constants'

export const MainPage: React.FC<MainPageProps> = ({ runtime: _runtime, ims }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCredentials = async () => {
      if (!ims.token) {
        const guestConnection = await attach({ id: EXTENSION_ID })
        ims.token = guestConnection?.sharedContext?.get('imsToken')
        ims.org = guestConnection?.sharedContext?.get('imsOrgId')
      }
      console.log('after attach ims object', ims)
      setIsLoading(false)
    }

    fetchCredentials()
  }, [])

  const renderContent = () => (
    <View>
      {isLoading ? (
        <Flex alignItems="center" justifyContent="center" height="100vh">
          <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
        <View width="size-6000">
          <Heading level={1}>Main Page</Heading>
        </View>
      )}
    </View>
  )

  return (
    <Router>
      <Provider theme={lightTheme} colorScheme={'light'}>
        <Routes>
          <Route index element={renderContent()} />
        </Routes>
      </Provider>
    </Router>
  )
}
