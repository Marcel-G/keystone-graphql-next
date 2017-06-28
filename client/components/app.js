import React, { Component, PropTypes } from 'react'
import { MuiThemeProvider } from 'material-ui/styles'
import Head from 'next/head'
import injectTapEventPlugin from 'react-tap-event-plugin'
import muiConfig from '../lib/mui-config'
import Nav from './nav'

try {
  injectTapEventPlugin()
} catch (e) {}

export class App extends Component {
  static async getInitialProps ({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { userAgent }
  }

  render () {
    const { userAgent } = this.props
    return (
      <div>
        <Head>
          <title>🐄</title>
          <meta charSet={'utf-8'} />
          <meta name={'viewport'} content={'initial-scale=1.0, width=device-width'} />
        </Head>
        <MuiThemeProvider muiTheme={muiConfig({ userAgent })}>
          <main>
            <Nav />
            {this.props.children}
            <style jsx global>{`
              * {
                font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
              }
              h1, h2, h3, h4, h5, h6 {
                letter-spacing: -0.05em;
              }
              body {
                margin: 0;
                padding: 0;
              }
              a {
                color: inherit;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              p {
                line-height: 140%;
              }
              input:-webkit-autofill,
              input:-webkit-autofill:hover,
              input:-webkit-autofill:focus,
              input:-webkit-autofill:active {
                  transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s;
                  transition-delay: background-color 5000s, color 5000s;
              }
            `}</style>
          </main>
        </MuiThemeProvider>
      </div>
    )
  }
}

App.propTypes = {
  userAgent: PropTypes.string,
  children: PropTypes.node
}

export default App
