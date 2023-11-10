// react
import { Dispatch, SetStateAction } from 'react'

// library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

// src
import SignIn from '../Modal/SignIn'
import Card from './Card'
import SignInForm from '../Modal/SignInForm'
import Account from '../Modal/Account'

const Modal = (props: {
  type: string
  toggleModal: Function
  classes: string
  isCloseButton: boolean
  setModalType: Dispatch<SetStateAction<string>>
}) => {
  const { type, toggleModal, setModalType, classes, isCloseButton } = props

  return (
    <div className={`absolute bg-white z-10 ${classes}`}>
      <Card classes='w-full h-full flex items-center justify-center relative md:min-h-[650px]'>
        <>
          {isCloseButton && (
            <button
              type='button'
              onClick={() => toggleModal()}
              className='absolute top-[10px] right-[10px]'
            >
              <FontAwesomeIcon icon={faXmark} size='lg' />
            </button>
          )}
          {(type === 'sign-in-options' ||
            type === 'sign-up-options' ||
            type === 'sign-in-required') && (
            <SignIn
              type={type}
              setModalType={setModalType}
              toggleModal={toggleModal}
            />
          )}
          {(type === 'sign-in-form-email-password' ||
            type === 'sign-up-form-email-password' ||
            type === 'sign-in-form-email' ||
            type === 'sign-up-form-email') && (
            <SignInForm type={type} setModalType={setModalType} />
          )}
          {type === 'account' && <Account />}
        </>
      </Card>
    </div>
  )
}

export default Modal
