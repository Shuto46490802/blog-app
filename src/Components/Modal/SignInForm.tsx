// react
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react'

// library
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// src
import { emailReducer, passwordReducer } from '../Reducer/form-reducer'
import UserContext from '../../Context/user-context'

type StateType = {
  value: string
  isValid: boolean
}

const initialState: StateType = {
  value: '',
  isValid: false
}

const SignInForm = (props: {
  type: string
  setModalType: Dispatch<SetStateAction<string>>
}) => {
  // props
  const { type, setModalType } = props

  // states
  const [isFormValid, setIsFormValid] = useState(false)

  // reducers
  const [emailState, dispatchEmail] = useReducer(emailReducer, initialState)
  const { value: emailValue, isValid: isEmailValid } = emailState
  const [passwordState, dispatchPassword] = useReducer(
    passwordReducer,
    initialState
  )
  const { value: passwordValue, isValid: isPasswordValid } = passwordState

  // context
  const userContext = useContext(UserContext)
  const { handleSignInEmailPassword, handleSignInEmail } = userContext

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (type.includes('password')) {
      timer = setTimeout(
        () => setIsFormValid(isEmailValid && isPasswordValid),
        500
      )
    } else {
      timer = setTimeout(() => setIsFormValid(isEmailValid), 500)
    }

    return () => clearTimeout(timer)
  }, [isEmailValid, isPasswordValid])

  const handleEmailChange = (val: string) => {
    dispatchEmail({ type: 'USER_INPUT', value: val })
  }

  const handleEmailBlur = () => {
    dispatchEmail({ type: 'INPUT_BLUR' })
  }

  const handlePasswordChange = (val: string) => {
    dispatchPassword({ type: 'USER_INPUT', value: val })
  }

  const handlePasswordBlur = () => {
    dispatchPassword({ type: 'INPUT_BLUR' })
  }

  const onSubmitSignIn = async () => {
    if (type.includes('password')) {
      handleSignInEmailPassword(emailValue, passwordValue)
    } else {
      handleSignInEmail(emailValue)
    }
  }

  const onSubmitSignUp = () => {}

  return (
    <div className='flex flex-col items-center py-[44px] px-[56px] w-full'>
      <h2 className='mb-14'>
        {type === 'sign-in-form-email-password'
          ? 'Sign in with Email and Password.'
          : type === 'sign-up-form-email-password'
          ? 'Sign up with Email and Password.'
          : type === 'sign-in-form-email'
          ? 'Sign in with Email.'
          : 'Sign up with Email.'}
      </h2>
      <div className='w-full sm:w-auto mb-8 flex flex-col gap-y-4'>
        <div className={`input-group ${emailValue ? 'input-entered' : ''}`}>
          <input
            type='email'
            id='Email'
            value={emailValue}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
          />
          <label htmlFor='Email'>Email</label>
        </div>
        {type.includes('password') && (
          <div
            className={`input-group ${passwordValue ? 'input-entered' : ''}`}
          >
            <input
              type='text'
              id='Password'
              value={passwordValue}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={handlePasswordBlur}
            />
            <label htmlFor='Password'>Password</label>
          </div>
        )}
        <button
          type='button'
          className='button button-primary mt-6'
          disabled={!isFormValid}
          onClick={() =>
            type.includes('sign-in-form') ? onSubmitSignIn() : onSubmitSignUp()
          }
        >
          {type.includes('sign-in-form') ? 'Sign in' : 'Sign up'}
        </button>
        <button
          type='button'
          onClick={() =>
            setModalType(
              type.includes('sign-in') ? 'sign-in-options' : 'sign-up-options'
            )
          }
          className='text-green-700 mt-2'
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          <span className='ml-2'>
            {type.includes('sign-in')
              ? 'All sign in options'
              : 'All sign up options'}
          </span>
        </button>
      </div>
    </div>
  )
}

export default SignInForm
