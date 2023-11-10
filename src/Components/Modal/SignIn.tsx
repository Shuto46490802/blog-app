// library
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// src
import { Dispatch, SetStateAction, useContext } from 'react'
import UserContext from '../../Context/user-context'

const SignIn = (props: {
  type: string
  toggleModal: Function
  setModalType: Dispatch<SetStateAction<string>>
}) => {
  // props
  const { type, setModalType } = props

  // context
  const userContext = useContext(UserContext)
  const { handleGoogleSignin } = userContext

  return (
    <div className='flex flex-col items-center py-[44px] px-[56px] w-full'>
      <h2 className='mb-14'>
        {type === 'sign-in-options'
          ? 'Welcom back.'
          : type === 'sign-up-options'
          ? 'Join GeekBlog.'
          : 'Become a member.'}
      </h2>
      <div className='w-full sm:w-auto mb-8'>
        <ul className='flex flex-col items-center justify-stretch gap-4'>
          <li className='sm:min-w-[300px] w-full sm:w-auto text-sm'>
            <button
              type='button'
              onClick={() => handleGoogleSignin()}
              className='px-3 py-2 flex items-center justify-between w-full group hover:bg-gray-200 duration-300 outline outline-1 outline-black rounded-[48px]'
            >
              <img
                src='/google.png'
                alt=''
                width='24'
                height='24'
                className='group-hover:scale-125 duration-300 mr-2'
              />
              <span>
                Sign {type === 'sign-in-options' ? 'in' : 'up'} with Google
              </span>
              <div></div>
            </button>
          </li>
          <li className='sm:min-w-[300px] w-full sm:w-auto text-sm '>
            <button
              type='button'
              onClick={() =>
                setModalType(
                  type === 'sign-in-options'
                    ? 'sign-in-form-email'
                    : 'sign-up-form-email'
                )
              }
              className='px-3 py-2 flex items-center justify-between w-full group hover:bg-gray-200 duration-300 outline outline-1 outline-black rounded-[48px]'
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                size='xl'
                className='group-hover:scale-125 duration-300 mr-2'
              />
              <span>
                Sign {type === 'sign-in-options' ? 'in' : 'up'} with Email
              </span>
              <div></div>
            </button>
          </li>
          <li className='sm:min-w-[300px] w-full sm:w-auto text-sm '>
            <button
              type='button'
              onClick={() =>
                setModalType(
                  type === 'sign-in-options'
                    ? 'sign-in-form-email-password'
                    : 'sign-up-form-email-password'
                )
              }
              className='px-3 py-2 flex items-center justify-between w-full group hover:bg-gray-200 duration-300 outline outline-1 outline-black rounded-[48px]'
            >
              <FontAwesomeIcon
                icon={faLock}
                size='xl'
                className='group-hover:scale-125 duration-300 mr-2'
              />
              <span>
                Sign {type === 'sign-in-options' ? 'in' : 'up'} with Email and
                Password
              </span>
              <div></div>
            </button>
          </li>
        </ul>
      </div>
      <div className='flex gap-1'>
        <div>
          {type === 'sign-in-options'
            ? 'No account?'
            : 'Already have an account?'}
        </div>
        <button
          type='button'
          onClick={() =>
            setModalType(
              type === 'sign-in-options' ? 'sign-up-options' : 'sign-in-options'
            )
          }
          className='text-green-700 font-extrabold'
        >
          {type === 'sign-in-options' ? 'Create one' : 'Sign in'}
        </button>
      </div>
    </div>
  )
}

export default SignIn
