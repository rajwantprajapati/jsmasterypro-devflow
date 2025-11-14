import React from 'react'

const MockedImage = ({src, alt}: {src?: string, alt: string}) => {
  return (
    <img src={src} alt={alt}/>
  )
}

export { MockedImage} 