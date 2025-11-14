import React from 'react'
import { MockedImage } from './Image.mock';

interface MetricProps {
  alt: string;
  imgUrl: string;
  title: string;
  value: string | number;
  textStyles?: string;
}

const MockMetric = ({alt, imgUrl, title, value, textStyles}: MetricProps) => {
  return (
    <div className={textStyles} data-testid="metric">
        <MockedImage src={imgUrl} alt={alt} />
        {value} {title}
    </div>
  )
}

export { MockMetric }