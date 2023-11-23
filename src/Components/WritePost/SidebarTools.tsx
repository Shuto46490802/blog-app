// react
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  KeyboardEvent,
  SetStateAction,
  forwardRef,
  useEffect,
  useState
} from 'react'

// library
import {
  faFolder,
  faImage,
  faPlus,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSprings, animated } from '@react-spring/web'

type Props = {
  sidebarClasses: string
  showSidebarTools: boolean
  setShowSidebarTools: Dispatch<SetStateAction<boolean>>
  handleAddImageURL: Function
}

type Ref = HTMLDivElement

const SidebarTools = forwardRef<Ref, Props>((props, ref) => {
  // props
  const {
    sidebarClasses,
    showSidebarTools,
    setShowSidebarTools,
    handleAddImageURL
  } = props

  const buttons = [
    {
      icon: faImage,
      type: 'button',
      callbackOnClick: () => {
        setShowUrlInput((prev) => !prev)
      }
    },
    {
      icon: faFolder,
      type: 'input',
      callbackOnClick: () => {}
    }
  ]

  // hooks
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [url, setUrl] = useState('')
  const [buttonSprings, api] = useSprings(
    buttons.length,
    (index) => ({
      scale: showSidebarTools ? 1 : 0,
      delay: showSidebarTools ? index * 100 : 0,
      config: {
        duration: showSidebarTools ? 100 : 0
      }
    }),
    [showSidebarTools]
  )

  useEffect(() => {
    if (!showSidebarTools) {
      setShowUrlInput(false)
    }
  }, [showSidebarTools])

  // methods
  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      handleAddImageURL(url)
      setUrl('')
    }
  }

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleAddImageURL(URL.createObjectURL(e.target.files[0]))
    }
  }

  const closeUrlInput = () => {
    setShowUrlInput(false)
    setUrl('')
  }

  return (
    <div className={`relative inline-block ${sidebarClasses}`} ref={ref}>
      <button
        type='button'
        className='border rounded-full flex items-center justify-center p-2'
        onClick={() => {
          setShowSidebarTools((prev) => !prev)
        }}
      >
        <FontAwesomeIcon
          icon={faPlus}
          size='lg'
          className={`w-[14px] h-[14px] should-animate duration-100 t ${
            showSidebarTools && 'rotate-45'
          }`}
        />
      </button>
      <div className='sidebar-tools flex items-center gap-3 absolute left-full top-0 ml-4'>
        {buttonSprings.map((props, index) => {
          if (buttons[index].type === 'button') {
            return (
              <animated.button
                type='button'
                onClick={buttons[index].callbackOnClick}
                key={index}
                style={props}
              >
                <FontAwesomeIcon
                  icon={buttons[index].icon}
                  size='lg'
                  className='w-[14px] h-[14px]'
                />
              </animated.button>
            )
          } else {
            return (
              <animated.div
                key={index}
                style={props}
                className='url-input !block !p-0 w-[32px] h-[32px]'
              >
                <label
                  htmlFor='imageUpload'
                  className='cursor-pointer w-full h-full block text-center'
                >
                  <FontAwesomeIcon
                    icon={buttons[index].icon}
                    size='lg'
                    className='w-[14px] h-[14px]'
                  />
                </label>
                <input
                  id='imageUpload'
                  type='file'
                  onClick={buttons[index].callbackOnClick}
                  onChange={handleSelectFile}
                  key={index}
                  className='hidden'
                ></input>
              </animated.div>
            )
          }
        })}
      </div>
      {showUrlInput && (
        <div className='absolute flex items-center gap-3 fixed bg-gray-700 text-white m-0 px-3 py-2 rounded z-10 mt-2 left-0'>
          <input
            type='text'
            className='bg-transparent mr-2 outline-none text-sm'
            placeholder='Paste or type a link...'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => handleEnter(e)}
          />
          <button type='button' onClick={() => closeUrlInput()}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}
    </div>
  )
})

export default SidebarTools
