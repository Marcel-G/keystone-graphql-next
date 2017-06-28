import React from 'react'

const ImageBlock = ({
  images
}) => <div>
    <div>
      {images && images.map(({ type, props }, index) => {
        const Type = type
        return <Type {...props} key={index} />
      })}
    </div>
    <style jsx>{`
    `}</style>
  </div>

export default ImageBlock
