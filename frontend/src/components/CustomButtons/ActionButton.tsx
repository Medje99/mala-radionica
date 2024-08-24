/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from 'antd'
import { CSSProperties } from 'react'

interface ActionButton {
  onClickHandler: () => void
  title: string
  className?: string
  style?: CSSProperties
}

// recives function , button title, button class , and aditional styles as prop
const ActionButton = ({ onClickHandler, title, className, style }: ActionButton) => {
  return (
    <Button onClick={onClickHandler} className={className} style={style}>
      {title}
    </Button>
  )
}

export default ActionButton
