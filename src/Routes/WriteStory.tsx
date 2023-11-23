// react
import { useEffect, useRef, useState, MouseEvent } from 'react'

// library
import {
  EditorState,
  convertToRaw,
  RichUtils,
  DraftHandleValue,
  getDefaultKeyBinding,
  Modifier,
  SelectionState,
  AtomicBlockUtils
} from 'draft-js'
import { Editor, SyntheticKeyboardEvent } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { debounce } from 'lodash'

// src
import TagsInput from '../Components/WritePost/TagsInput'
import CustomButton from '../Components/WritePost/CustomButton'
import {
  Link,
  findLinkEntities,
  onAddLink,
  removeLink
} from '../Components/WritePost/LinkButton'
import UrlInput from '../Components/WritePost/UrlInput'
import SidebarTools from '../Components/WritePost/SidebarTools'

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
  // toolbar
  const [isToolbarOpen, setIsToolbarOpen] = useState(false)
  const [toolbarMode, setToolbarMode] = useState('')
  const [currentSelectedTypes, setCurrentSelectedTypes] =
    useState(initialSelectedTypes)
  // sidebar
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSidebarTools, setShowSidebarTools] = useState(false)

  // ref
  const toolbarRef = useRef<Element>()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const tagInputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    toolbarRef.current =
      document.getElementsByClassName('rdw-editor-toolbar')[0]
  }, [])

  useEffect(() => {
    if (isToolbarOpen) {
      getToolbarPosition()
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
  const handleEditorChange = (newState: EditorState) => {
    const selection = getCurrentTextSelection(newState)
    const globalSelection = window?.getSelection()?.toString()

    if (selection && selection === globalSelection) {
      setIsToolbarOpen(true)
    } else {
      if (toolbarMode !== 'link-mode') {
        resetToolbar()
      }
    }

    if (selection) {
      getStylesOnSelection(newState)
    }

    if (!getTextOnCurrentLine(newState)) {
      debouncedGetSidebarPosition(newState)
    } else {
      setShowSidebar(false)
    }

    setEditorState(newState)
  }

  const handleEditorOnBlur = (e: any) => {
    if (toolbarMode !== 'link-mode' && !isToolbarOpen) {
      resetToolbar()
    }

    setShowSidebarTools(false)
  }

  const handleEditorOnFocus = () => {
    setShowSidebarTools(false)
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

  const toggleInlineStyle = (type: string) => {
    const newState = RichUtils.toggleInlineStyle(editorState, type)

    getStylesOnSelection(newState)
    setEditorState(newState)
  }

  const toggleBlockType = (type: string) => {
    const newState = RichUtils.toggleBlockType(editorState, type)

    getStylesOnSelection(newState)
    setEditorState(newState)
  }

  const handleClickLink = () => {
    if (RichUtils.currentBlockContainsLink(editorState)) {
      const newState = removeLink(editorState)
      setEditorState(newState)
      getStylesOnSelection(newState)
    } else {
      setToolbarMode('link-mode')
    }
  }

  const handleEnterLink = (input: string) => {
    const newState = onAddLink(editorState, input)

    setEditorState(newState)
    resetToolbar()
    getStylesOnSelection(newState)
  }

  const handleAddImageURL = (url: string) => {
    if (url) {
      setEditorState(insertImage(url))
    }
  }

  const insertImage = (url: string) => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'IMAGE',
      'IMMUTABLE',
      { src: url }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    })

    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
  }

  // get toolbar position
  const getToolbarPosition = () => {
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
    } else {
    }
  }

  // get sidebar position
  const getSidebarPositon = (editorState: EditorState) => {
    const anchorOffset = editorState.getSelection().getAnchorOffset()

    if (anchorOffset === 0) {
      const currentBlockKey = editorState.getSelection().getStartKey()
      const blockEl = document.querySelector(
        `[data-offset-key*="${currentBlockKey}-"]`
      )

      if (blockEl) {
        const rect = blockEl.getBoundingClientRect()

        if (sidebarRef.current && tagInputRef.current) {
          const tagInputRect = tagInputRef.current.getBoundingClientRect()

          const top = rect.top - (tagInputRect.top + tagInputRect.height)
          const left = sidebarRef.current.clientWidth * -1 - 3
          sidebarRef.current.setAttribute(
            'style',
            `top: ${top}px; left: ${left}px;`
          )

          setShowSidebar(true)
        }
      }
    }
  }

  const debouncedGetSidebarPosition = debounce(getSidebarPositon, 100)

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

  const getTextOnCurrentLine = (editorState: EditorState): string => {
    const selectionState = editorState.getSelection()
    const anchorKey = selectionState.getAnchorKey()
    const currentContent = editorState.getCurrentContent()
    const currentContentBlock = currentContent.getBlockForKey(anchorKey)

    return currentContentBlock.getText()
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

  // render functions
  const createDecorators = () => {
    return [
      {
        strategy: findLinkEntities,
        component: Link
      }
    ]
  }

  const createCustomButtons = () => {
    return [
      <CustomButton
        type='BOLD'
        isSelected={currentSelectedTypes['BOLD']}
        toggleInlineStyle={toggleInlineStyle}
      />,
      <CustomButton
        type='ITALIC'
        isSelected={currentSelectedTypes['ITALIC']}
        toggleInlineStyle={toggleInlineStyle}
      />,
      <CustomButton
        type='link'
        classes='border-r border-gray-500 pr-2'
        isSelected={currentSelectedTypes['link']}
        handleLink={handleClickLink}
      />,
      <CustomButton
        type='header-three'
        isSelected={currentSelectedTypes['header-three']}
        toggleBlockType={toggleBlockType}
      />,
      <CustomButton
        type='header-four'
        isSelected={currentSelectedTypes['header-four']}
        toggleBlockType={toggleBlockType}
      />,
      <CustomButton
        type='blockquote'
        isSelected={currentSelectedTypes['blockquote']}
        toggleBlockType={toggleBlockType}
      />,
      <UrlInput
        resetToolbar={resetToolbar}
        focus={toolbarMode === 'link-mode'}
        closeUrlInput={closeUrlInput}
        isToolbarOpen={isToolbarOpen}
        handleEnterLink={handleEnterLink}
      />
    ]
  }

  // classes
  const toolbarClasses = `${isToolbarOpen ? 'active' : ''} ${
    toolbarMode ? toolbarMode : ''
  }`

  const wrapperClasses = `relative pb-10 ${
    showSidebarTools && 'sidebar-active'
  }`

  const sidebarClasses = `${!showSidebar && 'invisible'} ${
    showSidebarTools && 'z-20'
  }`

  const props = {
    keyBindingFn
  }

  return (
    <div className='editor-root container flex justify-center font-serif'>
      <div className='md:max-w-[740px] w-full mt-10 relative'>
        <div className='mb-2'>
          <textarea
            name='Title'
            placeholder='Title'
            className='h1 w-full outline-none font-extrabold'
          />
        </div>
        <div ref={tagInputRef} className='pb-2'>
          <TagsInput
            tags={tags}
            handleKeyDown={handleKeyDown}
            handleRemoveTag={handleRemoveTag}
          />
        </div>
        <SidebarTools
          sidebarClasses={sidebarClasses}
          ref={sidebarRef}
          showSidebarTools={showSidebarTools}
          setShowSidebarTools={setShowSidebarTools}
          handleAddImageURL={handleAddImageURL}
        />
        <Editor
          editorState={editorState}
          placeholder='Tell your story...'
          onEditorStateChange={handleEditorChange}
          onBlur={handleEditorOnBlur}
          onFocus={handleEditorOnFocus}
          handleKeyCommand={handleKeyCommand}
          wrapperClassName={wrapperClasses}
          toolbarClassName={toolbarClasses}
          customDecorators={createDecorators()}
          toolbarCustomButtons={createCustomButtons()}
          {...props}
        />
      </div>
    </div>
  )
}

export default WriteStory
