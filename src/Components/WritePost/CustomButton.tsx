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
import { onAddLink } from './LinkButton'

const CustomButton = (props: {
  type: string
  editorState: EditorState
  classes: string
  setEditorState: Dispatch<SetStateAction<EditorState>>
}) => {
  const { type, editorState, setEditorState, classes } = props

  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'bold':
        return <FontAwesomeIcon icon={faBold} size='lg' />
      case 'italic':
        return <FontAwesomeIcon icon={faItalic} size='lg' />
      case 'link':
        return <FontAwesomeIcon icon={faLink} size='lg' />
      case 'header-three':
        return <FontAwesomeIcon icon={faFont} size='xl' />
      case 'header-four':
        return <FontAwesomeIcon icon={faFont} size='lg' />
      case 'blockquote':
        return <FontAwesomeIcon icon={faQuoteLeft} size='lg' />
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
        return onAddLink(editorState, setEditorState)
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

    setEditorState(newState)
  }

  const toggleBlockType = () => {
    const newState = RichUtils.toggleBlockType(editorState, type)

    setEditorState(newState)
  }

  return (
    <button type='button' className={`${classes}`} onClick={(e) => handleClick(e)}>
      {getIcon()}
    </button>
  )
}

export default CustomButton
