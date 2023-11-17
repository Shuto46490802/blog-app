// react
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react'

// library
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditorState, SelectionState } from 'draft-js'

// src
import { onAddLink } from './LinkButton'

const UrlInput = (props: {
  resetToolbar: Function
  focus: boolean
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
  closeUrlInput: Function
  getStylesOnSelection: Function
  isToolbarOpen: boolean
}) => {
  // props
  const {
    resetToolbar,
    focus,
    editorState,
    setEditorState,
    closeUrlInput,
    getStylesOnSelection,
    isToolbarOpen
  } = props

  // ref
  const inputRef = useRef<HTMLInputElement>(null)

  // hooks
  const [input, setInput] = useState('')

  useEffect(() => {
    if (focus) {
      inputRef.current?.focus()
    }
  }, [focus])

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      const newState = onAddLink(editorState, input)
      setEditorState(newState)
      resetToolbar()
      setInput('')
      getStylesOnSelection(newState)
    }
  }

  return (
    <div className='url-input'>
      <input
        type='text'
        className='bg-transparent mr-2 outline-none text-sm'
        placeholder='Paste or type a link...'
        value={input}
        onBlur={() => {
          if (!isToolbarOpen) {
            resetToolbar()
          }
        }}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => handleEnter(e)}
        ref={inputRef}
      />
      <button type='button' onClick={() => closeUrlInput()}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  )
}

export default UrlInput
