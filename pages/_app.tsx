import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../src/theme'
import createEmotionCache from '../src/createEmotionCache'
import { SessionProvider } from 'next-auth/react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Provider } from 'react-redux'
import { persistor, store } from '@src/store/store'
import 'dayjs/locale/pl'
import { PersistGate } from 'redux-persist/integration/react'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pl"
          >
            <SessionProvider session={pageProps.session}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {/*@ts-ignore*/}
              <Component {...pageProps} />
            </SessionProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </CacheProvider>
      </PersistGate>
    </Provider>
  )
}

export default MyApp
