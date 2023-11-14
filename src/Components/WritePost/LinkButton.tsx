import {
  CompositeDecorator,
  EditorState,
  RichUtils,
  ContentBlock,
  ContentState
} from 'draft-js'
import { Dispatch, SetStateAction } from 'react'

const Link = (props: {
  entityKey: string
  contentState: ContentState
  children: JSX.Element
}) => {
  const { entityKey, contentState, children } = props
  let { url } = contentState.getEntity(entityKey).getData()
  return (
    <a
      style={{ color: 'blue', fontStyle: 'italic' }}
      href={url}
      target='_blank'
    >
      {children}
    </a>
  )
}

const findLinkEntities = (
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

export const createLinkDecorator = () => {
  return new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link
    }
  ])
}

export const onAddLink = (
  editorState: EditorState,
  setEditorState: Dispatch<SetStateAction<EditorState>>
) => {
  const urlValue = 'https://shuto.com'
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

  setEditorState(nextEditorState)
}
