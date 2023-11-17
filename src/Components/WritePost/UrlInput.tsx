// react
import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState
} from 'react'

// library
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const UrlInput = (props: {
  resetToolbar: Function
  focus: boolean
  closeUrlInput: Function
  isToolbarOpen: boolean
  handleEnterLink: Function
}) => {
  // props
  const {
    resetToolbar,
    focus,
    closeUrlInput,
    isToolbarOpen,
    handleEnterLink
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
      handleEnterLink(input)
      setInput('')
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
