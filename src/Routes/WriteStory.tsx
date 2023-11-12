// react
import { useState } from 'react'

// library
import { EditorState, convertToRaw, RichUtils } from 'draft-js'
import { Editor, RawDraftContentState, SyntheticKeyboardEvent } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// src
import TagsInput from '../Components/WritePost/TagsInput'

const WriteStory = () => {
  // hooks
  const [tags, setTags] = useState<string[]>([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  // methods
  // tags
  const handleKeyDown = (val: string) => {
    setTags((prev) => [...prev, val])
  }

  const handleRemoveTag = (val: string) => {
    setTags((prev) => prev.filter((tag) => tag !== val))
  }

  const handleEditorChange = (editorState: EditorState) => {
    console.log(editorState.getSelection())
    setEditorState(editorState)
  }

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    console.log(command)

    if (newState) {
      setEditorState(newState)
      return 'handled';
    }

    return 'not-handled';
  };

  const keyBindingFn = (e: SyntheticKeyboardEvent) => {
    console.log(e)
  }

  const props = {
    keyBindingFn: keyBindingFn
  }

  return (
    <div className='container flex justify-center font-serif'>
      <div className='md:max-w-[740px] w-full mt-10 '>
        <div className='mb-2'>
          <input
            type='text'
            name='Title'
            placeholder='Title'
            className='h1 w-full outline-none'
          />
        </div>
        <div className='mb-2'>
          <TagsInput
            tags={tags}
            handleKeyDown={handleKeyDown}
            handleRemoveTag={handleRemoveTag}
          />
        </div>
        <Editor
          editorState={editorState}
          placeholder='Tell your story...'
          onEditorStateChange={handleEditorChange}
          toolbar={{
            inline: {
              options: ['bold', 'italic']
            },
            blockType: {
              options: ['H3', 'H4']
            },
            list: {
              options: ['unordered', 'ordered']
            },
            textAlign: {
              className: '!hidden'
            },
            link: {
              options: ['link']
            },
            embedded: {
              className: '!hidden'
            },
            emoji: {
              className: '!hidden'
            },
            image: {},
            remove: {
              className: '!hidden'
            },
            history: {
              className: '!hidden'
            },
            fontFamily: {
              className: '!hidden'
            },
            fontSize: {
              className: '!hidden'
            },
            colorPicker: {
              className: '!hidden'
            }
          }}
          handleKeyCommand={handleKeyCommand}
          {...props}
        />
      </div>
    </div>
  )
}

export default WriteStory
