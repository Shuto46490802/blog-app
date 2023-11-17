// react
import { Dispatch, MouseEvent, SetStateAction } from 'react'

// library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBold,
  faFont,
  faItalic,
  faLink,
  faQuoteLeft
} from '@fortawesome/free-solid-svg-icons'
import { EditorState, RichUtils } from 'draft-js'
import { removeLink } from './LinkButton'

const CustomButton = (props: {
  type: string
  editorState: EditorState
  classes: string
  setEditorState: Dispatch<SetStateAction<EditorState>>
  setToolbarMode: Dispatch<SetStateAction<string>>
  getStylesOnSelection: Function
  isSelected: boolean
}) => {
  const {
    type,
    editorState,
    setEditorState,
    classes,
    setToolbarMode,
    getStylesOnSelection,
    isSelected
  } = props

  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'bold':
        return (
          <FontAwesomeIcon
            icon={faBold}
            size='lg'
            className={`${isSelected && 'text-green-700'}`}
          />
        )
      case 'italic':
        return (
          <FontAwesomeIcon
            icon={faItalic}
            size='lg'
            className={`${isSelected && 'text-green-700'}`}
          />
        )
      case 'link':
        return (
          <FontAwesomeIcon
            icon={faLink}
            size='lg'
            className={`${isSelected && 'text-green-700'}`}
          />
        )
      case 'header-three':
        return (
          <FontAwesomeIcon
            icon={faFont}
            size='xl'
            className={`${isSelected && 'text-green-700'}`}
          />
        )
      case 'header-four':
        return (
          <FontAwesomeIcon
            icon={faFont}
            size='lg'
            className={`${isSelected && 'text-green-700'}`}
          />
        )
      case 'blockquote':
        return (
          <FontAwesomeIcon
            icon={faQuoteLeft}
            size='lg'
            className={`${isSelected && 'text-green-700'}`}
          />
        )
    }
  }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    switch (type.toLowerCase()) {
      case 'bold':
        return toggleInlineStyle()
      case 'italic':
        return toggleInlineStyle()
      case 'link':
        return handleLink()
      case 'header-three':
        return toggleBlockType()
      case 'header-four':
        return toggleBlockType()
      case 'blockquote':
        return toggleBlockType()
    }
  }

  const toggleInlineStyle = () => {
    const newState = RichUtils.toggleInlineStyle(editorState, type)

    getStylesOnSelection(newState)
    setEditorState(newState)
  }

  const toggleBlockType = () => {
    const newState = RichUtils.toggleBlockType(editorState, type)

    getStylesOnSelection(newState)
    setEditorState(newState)
  }

  const handleLink = () => {
    if (RichUtils.currentBlockContainsLink(editorState)) {
      const newState = removeLink(editorState)
      setEditorState(newState)
      getStylesOnSelection(newState)
    } else {
      setToolbarMode('link-mode')
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
