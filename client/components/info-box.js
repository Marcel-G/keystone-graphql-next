import React from 'react'

const InfoBox = ({
  content
}) => <div>
      <div className={'dark-content'}>
        {content}
      </div>
    <style jsx>{`
      .dark-content h1 {
        margin-top: 0;
      }
      .dark-content {
        background-color: #000;
        color: #fff;
        padding: 2em;
      }
    `}</style>
  </div>

export default InfoBox
