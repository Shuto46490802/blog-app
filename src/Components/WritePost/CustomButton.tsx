// react
import { MouseEvent } from 'react'

// library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBold,
  faFont,
  faItalic,
  faLink,
  faQuoteLeft
} from '@fortawesome/free-solid-svg-icons'

const CustomButton = (props: {
  type: string
  classes?: string
  isSelected: boolean
  toggleInlineStyle?: Function
  handleLink?: Function
  toggleBlockType?: Function
}) => {
  const {
    type,
    classes,
    isSelected,
    toggleInlineStyle,
    handleLink,
    toggleBlockType
  } = props

  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'bold':
        return (
          <FontAwesomeIcon
            icon={faBold}
            size='lg'
            className={`${isSelected && 'text-green-300'}`}
          />
        )
      case 'italic':
        return (
          <FontAwesomeIcon
            icon={faItalic}
            size='lg'
            className={`${isSelected && 'text-green-300'}`}
          />
        )
      case 'link':
        return (
          <FontAwesomeIcon
            icon={faLink}
            size='lg'
            className={`${isSelected && 'text-green-300'}`}
          />
        )
      case 'header-three':
        return (
          <FontAwesomeIcon
            icon={faFont}
            size='xl'
            className={`${isSelected && 'text-green-300'}`}
          />
        )
      case 'header-four':
        return (
          <FontAwesomeIcon
            icon={faFont}
            size='lg'
            className={`${isSelected && 'text-green-300'}`}
          />
        )
      case 'blockquote':
        return (
          <FontAwesomeIcon
            icon={faQuoteLeft}
            size='lg'
            className={`${isSelected && 'text-green-300'}`}
          />
        )
    }
  }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    switch (type.toLowerCase()) {
      case 'bold':
        return toggleInlineStyle?.(type)
      case 'italic':
        return toggleInlineStyle?.(type)
      case 'link':
        return handleLink?.()
      case 'header-three':
        return toggleBlockType?.(type)
      case 'header-four':
        return toggleBlockType?.(type)
      case 'blockquote':
        return toggleBlockType?.(type)
    }
  }

  return (
    <button
      type='button'
      className={`custom-button ${classes}`}
      onClick={(e) => handleClick(e)}
    >
      {getIcon()}
    </button>
  )
}

export default CustomButton
