import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TagsInput = (props: {
  tags: string[]
  handleKeyDown: Function
  handleRemoveTag: Function
}) => {
  const [input, setInput] = useState<string>('')

  const onKeyDown = (key: string) => {
    if (key === 'Enter') {
      props.handleKeyDown(input)
      setInput('')
    }
  }

  return (
    <div className='flex items-center'>
      <div className='flex items-center gap-1 text-sm'>
        {props.tags.length > 0 &&
          props.tags.map((tag, index) => {
            return (
              <button
                onClick={() => props.handleRemoveTag(tag)}
                key={index}
                className='bg-green-700 hover:bg-green-900  duration-300 text-white px-2 py-1 rounded-[48px] flex items-center'
              >
                <span className='mr-1'>{tag}</span>
                <FontAwesomeIcon icon={faXmark} size='xs' />
              </button>
            )
          })}
      </div>
      <input
        type='text'
        className='w-full p-2 outline-none text-sm'
        value={input}
        placeholder='Add a tag'
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => onKeyDown(e.key)}
      />
    </div>
  )
}

export default TagsInput
