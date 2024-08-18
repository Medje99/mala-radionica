/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from 'antd'
import { CSSProperties } from 'react'

interface NextButtonProps {
  onClickHandler: () => void
  title: string
  className?: string
  style?: CSSProperties
}

const NextButton = ({
  onClickHandler,
  title,
  className,
  style,
}: NextButtonProps) => {
  return (
    <Button onClick={onClickHandler} className={className} style={style}>
      {title}
    </Button>
  )
}

export default NextButton
