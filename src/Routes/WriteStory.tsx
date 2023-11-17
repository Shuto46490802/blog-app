// react
import { RefObject, useEffect, useRef, useState } from 'react'

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
  EditorProps,
  RawDraftContentState,
  SyntheticKeyboardEvent
} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'

// src
import TagsInput from '../Components/WritePost/TagsInput'
import CustomButton from '../Components/WritePost/CustomButton'
import { Link, findLinkEntities } from '../Components/WritePost/LinkButton'
import UrlInput from '../Components/WritePost/UrlInput'

type SelectedTypes = {
  BOLD: boolean
  ITALIC: boolean
  link: boolean
  'header-three': boolean
  'header-four': boolean
  blockquote: boolean
}

const initialSelectedTypes: SelectedTypes = {
  BOLD: false,
  ITALIC: false,
  link: false,
  'header-three': false,
  'header-four': false,
  blockquote: false
}

const WriteStory = () => {
  // hooks
  const [tags, setTags] = useState<string[]>([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [isToolbarOpen, setIsToolbarOpen] = useState(false)
  const [toolbarMode, setToolbarMode] = useState('')
  const [currentSelectedTypes, setCurrentSelectedTypes] =
    useState(initialSelectedTypes)

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

        if (toolbarRef.current) {
          const top = rect.top - toolbarRef.current.clientHeight - 7
          const left =
            rect.left - toolbarRef.current.clientWidth / 2 + rect.width / 2
          toolbarRef.current.setAttribute(
            'style',
            `top: ${top}px; left: ${left}px;`
          )
        }
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

  // editor change observer
  const handleEditorChange = (editorState: EditorState) => {
    const selection = getCurrentTextSelection(editorState)
    const globalSelection = window?.getSelection()?.toString()

    if (selection && selection === globalSelection) {
      setIsToolbarOpen(true)
    } else {
      if (toolbarMode !== 'link-mode') {
        resetToolbar()
      }
    }

    if (selection) {
      getStylesOnSelection(editorState)
    }

    setEditorState(editorState)
  }

  // get currently selected styles on the current slection
  const getStylesOnSelection = (state: EditorState) => {
    const types = Object.keys(initialSelectedTypes)
    let selectedTypes = initialSelectedTypes
    types.forEach((type) => {
      if (type === 'link') {
        selectedTypes = {
          ...selectedTypes,
          link: RichUtils.currentBlockContainsLink(state)
        }
      } else {
        const isSelected = [
          RichUtils.getCurrentBlockType(state) === type,
          state.getCurrentInlineStyle().has(type)
        ].some((boolean) => boolean)

        selectedTypes = {
          ...selectedTypes,
          [type]: isSelected
        }
      }
    })

    setCurrentSelectedTypes(selectedTypes)
  }

  // custom buttons
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

  // helpers
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

  const resetToolbar = (close: boolean = true) => {
    if (close) {
      setIsToolbarOpen(false)
    }
    setToolbarMode('')
  }

  const closeUrlInput = () => {
    resetToolbar(false)
    const selection = editorState.getSelection()

    const newState = EditorState.forceSelection(editorState, selection)
    setEditorState(newState)
  }

  const props = {
    keyBindingFn
  }

  return (
    <div className='editor-root container flex justify-center font-serif'>
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
            if (toolbarMode !== 'link-mode' && !isToolbarOpen) {
              resetToolbar()
            }
          }}
          toolbar={{
            inline: {
              className: '!hidden'
            },
            blockType: {
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
          toolbarClassName={`${isToolbarOpen ? 'active' : ''} ${
            toolbarMode ? toolbarMode : ''
          }`}
          customDecorators={[
            {
              strategy: findLinkEntities,
              component: Link
            }
          ]}
          toolbarCustomButtons={[
            <CustomButton
              type='BOLD'
              editorState={editorState}
              setEditorState={setEditorState}
              classes=''
              setToolbarMode={setToolbarMode}
              getStylesOnSelection={getStylesOnSelection}
              isSelected={currentSelectedTypes['BOLD']}
            />,
            <CustomButton
              type='ITALIC'
              editorState={editorState}
              setEditorState={setEditorState}
              classes=''
              setToolbarMode={setToolbarMode}
              getStylesOnSelection={getStylesOnSelection}
              isSelected={currentSelectedTypes['ITALIC']}
            />,
            <CustomButton
              type='link'
              editorState={editorState}
              setEditorState={setEditorState}
              classes='border-r border-gray-500 pr-2'
              setToolbarMode={setToolbarMode}
              getStylesOnSelection={getStylesOnSelection}
              isSelected={currentSelectedTypes['link']}
            />,
            <CustomButton
              type='header-three'
              editorState={editorState}
              setEditorState={setEditorState}
              classes=''
              setToolbarMode={setToolbarMode}
              getStylesOnSelection={getStylesOnSelection}
              isSelected={currentSelectedTypes['header-three']}
            />,
            <CustomButton
              type='header-four'
              editorState={editorState}
              setEditorState={setEditorState}
              classes=''
              setToolbarMode={setToolbarMode}
              getStylesOnSelection={getStylesOnSelection}
              isSelected={currentSelectedTypes['header-four']}
            />,
            <CustomButton
              type='blockquote'
              editorState={editorState}
              setEditorState={setEditorState}
              classes=''
              setToolbarMode={setToolbarMode}
              getStylesOnSelection={getStylesOnSelection}
              isSelected={currentSelectedTypes['blockquote']}
            />,
            <UrlInput
              resetToolbar={resetToolbar}
              focus={toolbarMode === 'link-mode'}
              editorState={editorState}
              setEditorState={setEditorState}
              closeUrlInput={closeUrlInput}
              getStylesOnSelection={getStylesOnSelection}
              isToolbarOpen={isToolbarOpen}
            />
          ]}
          {...props}
        />
      </div>
    </div>
  )
}

export default WriteStory
