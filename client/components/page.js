import React, { PropTypes } from 'react'

const Page = ({
  children
}) =>
    <div>
      <div className={'page'}>
        {children}
      </div>
      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          max-width: 40em;
          padding: 1em;
          margin: 0 auto;
        }
      `}</style>
    </div>

Page.propTypes = {
  children: PropTypes.node
}

export default Page
