import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TagsInput = (props: {
  tags: string[]
  handleKeyDown: Function
  handleRemoveTag: Function
}) => {
  // props
  const { tags, handleKeyDown, handleRemoveTag } = props
  // hooks
  const [input, setInput] = useState<string>('')

  const onKeyDown = (key: string) => {
    if (key === 'Enter') {
      handleKeyDown(input)
      setInput('')
    }
  }

  return (
    <div className='flex items-center'>
      <div
        className={`flex items-center gap-1 text-base ${tags.length && 'pr-2'}`}
      >
        {tags.length > 0 &&
          tags.map((tag, index) => {
            return (
              <button
                onClick={() => handleRemoveTag(tag)}
                key={index}
                className='bg-green-700 hover:bg-green-900  duration-300 text-white px-2 py-1 rounded-[48px] flex items-center'
              >
                <span className='mr-1 whitespace-nowrap'>{tag}</span>
                <FontAwesomeIcon icon={faXmark} size='xs' />
              </button>
            )
          })}
      </div>
      <input
        type='text'
        className='w-full py-2 pr-2 outline-none text-base'
        value={input}
        placeholder='Add a tag'
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => onKeyDown(e.key)}
      />
    </div>
  )
}

export default TagsInput
