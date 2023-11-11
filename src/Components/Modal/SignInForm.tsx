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
import { emailReducer, passwordReducer } from '../../Reducer/form-reducer'
import UserContext from '../../Context/user-context'

type StateType = {
  value: string
  isValid: boolean
}

type ErrorStateType = {
  email: string
  password: string
  apiError: string
}

const initialState: StateType = {
  value: '',
  isValid: false
}

const initilaErrorState: ErrorStateType = {
  email: '',
  password: '',
  apiError: ''
}

const SignInForm = (props: {
  type: string
  setModalType: Dispatch<SetStateAction<string>>
}) => {
  // props
  const { type, setModalType } = props

  // states
  const [isFormValid, setIsFormValid] = useState(false)
  const [errors, setErrors] = useState(initilaErrorState)

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
  const {
    handleSignInEmailPassword,
    handleSignInEmail,
    handleSignUpEmailPassword
  } = userContext

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

    if (errors.email) {
      resetErrors('email')
    }
  }

  const handleEmailBlur = () => {
    dispatchEmail({ type: 'INPUT_BLUR' })
  }

  const handlePasswordChange = (val: string) => {
    dispatchPassword({ type: 'USER_INPUT', value: val })

    if (errors.password) {
      resetErrors('password')
    }
  }

  const handlePasswordBlur = () => {
    dispatchPassword({ type: 'INPUT_BLUR' })
  }

  const validateInputs = () => {
    let isValid = true

    if (!isEmailValid) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          email: 'Please enter a valid email'
        }
      })
    }

    if (type.includes('password') && !isPasswordValid) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          password: 'Password must be longer than '
        }
      })
    }

    return isValid
  }

  const onSubmitSignIn = async () => {
    if (!validateInputs()) {
      return
    }

    if (type.includes('password')) {
      const res = await handleSignInEmailPassword(emailValue, passwordValue)

      if (!res.status) {
        setErrors((prev) => {
          return {
            ...prev,
            apiError: 'Ooops... Please enter a valid email and password'
          }
        })
      }
    } else {
      handleSignInEmail(emailValue)
        .then((res: Promise<any>) => {
          localStorage.setItem('emailForSignIn', emailValue)
          setModalType('sent-link')
        })
        .catch((error: Promise<any>) => console.log(error))
    }
  }

  const onSubmitSignUp = async () => {
    if (!validateInputs()) {
      return
    }

    if (type.includes('password')) {
      const res = await handleSignUpEmailPassword(emailValue, passwordValue)

      if (!res.status) {
        let message = 'Ooops... Please enter a valid email and password'

        if (res.error.code.includes('already')) {
          message = 'The email is already in use'
        }

        setErrors((prev) => {
          return {
            ...prev,
            apiError: message
          }
        })
      }
    } else {
      handleSignInEmail(emailValue)
        .then((res: Promise<any>) => {
          localStorage.setItem('emailForSignIn', emailValue)
          setModalType('sent-link')
        })
        .catch((error: Promise<any>) => console.log(error))
    }
  }

  const resetErrors = (key: string) => {
    setErrors((prev) => {
      return {
        ...prev,
        key: '',
        apiError: ''
      }
    })
  }

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
        <div>
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
          {errors.email && (
            <p className='text-red-600 text-center mt-2 text-xs'>
              {errors.email}
            </p>
          )}
        </div>
        {type.includes('password') && (
          <div>
            <div
              className={`input-group ${passwordValue ? 'input-entered' : ''}`}
            >
              <input
                type='password'
                id='Password'
                value={passwordValue}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={handlePasswordBlur}
              />
              <label htmlFor='Password'>Password</label>
            </div>
            {errors.password && (
              <p className='text-red-600 text-center mt-2 text-xs'>
                {errors.password}
              </p>
            )}
          </div>
        )}
        <div className='flex flex-col items-center'>
          <button
            type='button'
            className='button button-primary mt-6'
            disabled={!isFormValid}
            onClick={() =>
              type.includes('sign-in-form')
                ? onSubmitSignIn()
                : onSubmitSignUp()
            }
          >
            {type.includes('sign-in-form') ? 'Sign in' : 'Sign up'}
          </button>
          {errors.apiError && (
            <p className='text-red-600 text-center mt-2 text-xs'>
              {errors.apiError}
            </p>
          )}
        </div>
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
