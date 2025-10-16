/*
 * <license header>
 */

import React, { Component } from 'react'
import { Provider, defaultTheme, Grid, View } from '@adobe/react-spectrum'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import SideBar from '@components/SideBar'
import ActionsForm from '@components/ActionsForm'
import { Home } from '@components/Home'
import { About } from '@components/About'
import type { AppProps } from './types'
import type { ConfigurationData, HistoryData } from '@web/types'
import type { ErrorBoundaryState, ErrorBoundaryProps } from '@web/types/ui'

// Error Boundary Component
class CustomErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <React.Fragment>
          <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Something went wrong :(</h1>
          <pre>{this.state.error?.message || 'Unknown error'}</pre>
        </React.Fragment>
      )
    }

    return this.props.children
  }
}

// Main App Component
const App: React.FC<AppProps> = props => {
  console.log('runtime object:', props.runtime)
  console.log('ims object:', props.ims)

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', (data: unknown) => {
    const { imsOrg, imsToken, locale } = data as ConfigurationData
    console.log('configuration change', { imsOrg, imsToken, locale })
  })

  // respond to history change events
  props.runtime.on('history', (data: unknown) => {
    const { type, path } = data as HistoryData
    console.log('history change', { type, path })
  })

  return (
    <CustomErrorBoundary>
      <Router>
        <Provider theme={defaultTheme} colorScheme={'light'}>
          <Grid
            areas={['sidebar content']}
            columns={['256px', '3fr']}
            rows={['auto']}
            height="100vh"
            gap="size-100"
          >
            <View gridArea="sidebar" backgroundColor="gray-200" padding="size-200">
              <SideBar></SideBar>
            </View>
            <View gridArea="content" padding="size-200">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/actions"
                  element={<ActionsForm runtime={props.runtime} ims={props.ims} />}
                />
                <Route path="/about" element={<About />} />
              </Routes>
            </View>
          </Grid>
        </Provider>
      </Router>
    </CustomErrorBoundary>
  )
}

export default App
