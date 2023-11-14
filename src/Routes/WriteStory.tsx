// react
import { useEffect, useRef, useState } from 'react'

// library
import {
  EditorState,
  convertToRaw,
  RichUtils,
  DraftHandleValue,
  getDefaultKeyBinding,
  Modifier,
  SelectionState
} from 'draft-js'
import {
  ContentState,
  Editor,
  RawDraftContentState,
  SyntheticKeyboardEvent
} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'

// src
import TagsInput from '../Components/WritePost/TagsInput'
import CustomButton from '../Components/WritePost/CustomButton'
import { createLinkDecorator } from '../Components/WritePost/LinkButton'

const WriteStory = () => {
  const decorator = createLinkDecorator()

  // hooks
  const [tags, setTags] = useState<string[]>([])
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  )
  const [isToolbarOpen, setIsToolbarOpen] = useState(false)

  // ref
  const toolbarRef = useRef<Element>()

  useEffect(() => {
    toolbarRef.current =
      document.getElementsByClassName('rdw-editor-toolbar')[0]
  }, [])

  useEffect(() => {
    if (isToolbarOpen) {
      const currentSelection = window.getSelection()

      if (currentSelection) {
        const range = currentSelection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        toolbarRef.current?.setAttribute('style', `top: ${rect.top}px;`)
      }
    }
  }, [isToolbarOpen])

  // methods
  // tags
  const handleKeyDown = (val: string) => {
    setTags((prev) => [...prev, val])
  }

  const handleRemoveTag = (val: string) => {
    setTags((prev) => prev.filter((tag) => tag !== val))
  }

  const handleEditorChange = (editorState: EditorState) => {
    const selection = getCurrentTextSelection(editorState)
    const globalSelection = window?.getSelection()?.toString()

    if (selection && selection === globalSelection) {
      setIsToolbarOpen(true)
    } else {
      setIsToolbarOpen(false)
    }

    setEditorState(editorState)
  }

  const handleKeyCommand = (
    command: string,
    editorState: EditorState
  ): DraftHandleValue => {
    if (command === 'start-unordered-list') {
      const newState = RichUtils.toggleBlockType(
        removeBlock(1),
        'unordered-list-item'
      )
      setEditorState(newState)
      return 'handled'
    }

    if (command === 'start-ordered-list') {
      const newState = RichUtils.toggleBlockType(
        removeBlock(2),
        'ordered-list-item'
      )
      setEditorState(newState)
      return 'handled'
    }

    if (command === 'remove-list') {
      const newState = RichUtils.toggleBlockType(editorState, 'unstyled')
      setEditorState(newState)
      return 'handled'
    }

    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
    }

    return 'not-handled'
  }

  const keyBindingFn = (e: SyntheticKeyboardEvent): string | null => {
    const key = editorState.getSelection().getStartKey()
    const currentBlock = editorState.getCurrentContent().getBlockForKey(key)
    const currentText = currentBlock.getText()
    const currentType = currentBlock.getType()

    if (e.keyCode === 32 && currentText.startsWith('*')) {
      return 'start-unordered-list'
    }

    if (e.keyCode === 32 && currentText.startsWith('1.')) {
      return 'start-ordered-list'
    }

    if (
      e.keyCode === 8 &&
      currentText === '' &&
      (currentType === 'unordered-list-item' ||
        currentType === 'ordered-list-item')
    ) {
      return 'remove-list'
    }

    return getDefaultKeyBinding(e)
  }

  const removeBlock = (focusOffset: number) => {
    const selection = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const beforeBlock = contentState.getBlockBefore(selection.getStartKey())

    const selectionState = new SelectionState({
      anchorKey: beforeBlock?.getKey() || selection.getStartKey(),
      anchorOffset: beforeBlock?.getLength() || 0,
      focusKey: selection.getEndKey(),
      focusOffset: focusOffset
    })

    const newContentState = Modifier.removeRange(
      contentState,
      selectionState,
      'backward'
    )

    let newEditorState = EditorState.push(
      editorState,
      newContentState,
      'remove-range'
    )

    newEditorState = EditorState.moveFocusToEnd(newEditorState)

    return newEditorState
  }

  const getCurrentTextSelection = (editorState: EditorState): string => {
    const selectionState = editorState.getSelection()
    const anchorKey = selectionState.getAnchorKey()
    const currentContent = editorState.getCurrentContent()
    const currentContentBlock = currentContent.getBlockForKey(anchorKey)
    const start = selectionState.getStartOffset()
    const end = selectionState.getEndOffset()
    const selectedText = currentContentBlock.getText().slice(start, end)
  
    return selectedText
  }

  const props = {
    keyBindingFn
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
          onBlur={() => {
            setIsToolbarOpen(false)
          }}
          toolbar={{
            inline: {
              className: '!hidden'
            },
            blockType: {
              dropdownClassName: '!hidden',
              className: '!hidden'
            },
            list: {
              className: '!hidden'
            },
            textAlign: {
              className: '!hidden'
            },
            link: {
              className: '!hidden'
            },
            embedded: {
              className: '!hidden'
            },
            emoji: {
              className: '!hidden'
            },
            image: {
              className: '!hidden'
            },
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
          toolbarClassName={`${!isToolbarOpen && '!hidden'}`}
          toolbarCustomButtons={[
            <CustomButton
              type='BOLD'
              editorState={editorState}
              setEditorState={setEditorState}
              classes=''
            />,
            <CustomButton
              type='ITALIC'
              editorState={editorState}
              setEditorState={setEditorState}
              classes=''
            />,
            <CustomButton
              type='link'
              editorState={editorState}
              setEditorState={setEditorState}
              classes='border-r border-gray-500 pr-2'
            />,
            <CustomButton
              type='header-three'
              editorState={editorState}
              setEditorState={setEditorState}
              classes=''
            />,
            <CustomButton
              type='header-four'
              editorState={editorState}
              setEditorState={setEditorState}
              classes=''
            />,
            <CustomButton
              type='blockquote'
              editorState={editorState}
              setEditorState={setEditorState}
              classes=''
            />
          ]}
          {...props}
        />
      </div>
    </div>
  )
}

export default WriteStory
