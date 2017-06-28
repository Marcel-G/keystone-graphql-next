import React, { PropTypes } from 'react'

const Layout = ({
  layout = 'center',
  left,
  right
}) => {
  return (<div>
      <section className={`layout ${layout}`}>
        <div className={`left`}>
          {left}
        </div>
        <div className={`right`}>
          {right}
        </div>
      </section>
      <style jsx>{`
        .layout.right .left,
        .layout.left .right {
          flex: 1 1 calc(30% - 2em);
          min-width: 15em;
        }
        .layout .left,
        .layout .right {
          flex: 1 1 calc(50% - 2em);
          min-width: 20em;
          margin: 0 1em 2em;
        }
        .layout {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          margin: 2em 0;
        }
      `}</style>
    </div>)
}
Layout.propTypes = {
  layout: PropTypes.oneOf(['left', 'right', 'center']),
  left: PropTypes.node,
  right: PropTypes.node
}

export default Layout
