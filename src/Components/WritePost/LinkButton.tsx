// react
import { useEffect, useRef, useState } from 'react'

// library
import { EditorState, RichUtils, ContentBlock, ContentState } from 'draft-js'
import { createPortal } from 'react-dom'

export const Link = (props: {
  entityKey: string
  contentState: ContentState
  children: JSX.Element
}) => {
  // props
  const { entityKey, contentState, children } = props
  let { url } = contentState.getEntity(entityKey).getData()

  // hooks
  const [isShowPopup, setIsShowPopup] = useState(false)

  // refs
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isShowPopup) {
      getPopupPosition()
    }
  }, [isShowPopup])

  const getPopupPosition = () => {
    if (anchorRef.current && popupRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      const top = rect.top + rect.height
      const left = rect.left - popupRef.current.clientWidth / 2 + rect.width / 2
      popupRef.current.setAttribute('style', `top: ${top}px; left: ${left}px;`)
    }
  }

  return (
    <>
      <a
        href={url}
        target='_blank'
        onMouseOver={() => setIsShowPopup(true)}
        onMouseLeave={() => setIsShowPopup(false)}
        ref={anchorRef}
        className='relative'
      >
        {isShowPopup && (
          <div className='absolute w-full h-[7px] top-full left-0 z-20'></div>
        )}
        {children}
        {createPortal(
          isShowPopup && (
            <div
              ref={popupRef}
              className='link-popup fixed z-10 text-white rounded bg-gray-700'
            >
              <a
                href={url}
                className='py-1 px-2 !no-underline block text-sm'
                target='_blank'
              >
                {url}
              </a>
            </div>
          ),
          document.getElementsByClassName('editor-root')[0]
        )}
      </a>
    </>
  )
}

export const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: any,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()

    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    )
  }, callback)
}

export const onAddLink = (editorState: EditorState, url: string) => {
  const urlValue = url
  const contentState = editorState.getCurrentContent()
  const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
    url: urlValue
  })

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  let nextEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity
  })

  nextEditorState = RichUtils.toggleLink(
    nextEditorState,
    nextEditorState.getSelection(),
    entityKey
  )

  return nextEditorState
}

export const removeLink = (editorState: EditorState) => {
  const selection = editorState.getSelection()
  const stateWithoutLink = RichUtils.toggleLink(editorState, selection, null)
  return stateWithoutLink
}
