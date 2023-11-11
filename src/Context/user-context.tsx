// react
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from 'react'

// library
import {
  createUserWithEmailAndPassword,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut
} from '@firebase/auth'
import { auth, signInWithGooglePopup } from '../Utils/firebase'
import useModal from '../Hooks/useModal'
import { useNavigate } from 'react-router-dom'

//src

type ContextType = {
  user: {} | null
  isSignedIn: boolean
  setIsSignedIn: Dispatch<SetStateAction<boolean>>
  isLoginModalOpen: boolean
  loginModalType: string
  setLoginModalType: Dispatch<SetStateAction<string>>
  toggleLoginModal: Function
  handleGoogleSignin: Function
  handleSignInEmailPassword: Function
  handleSignInEmail: Function
  handleSignUpEmailPassword: Function
  handleLogout: Function
}

const UserContext = createContext<ContextType>({
  user: null,
  isSignedIn: false,
  setIsSignedIn: () => {},
  isLoginModalOpen: false,
  loginModalType: '',
  setLoginModalType: () => {},
  toggleLoginModal: () => {},
  handleGoogleSignin: () => {},
  handleSignInEmailPassword: () => {},
  handleSignInEmail: () => {},
  handleSignUpEmailPassword: () => {},
  handleLogout: () => {}
})

export const UserProvider = (props: { children: JSX.Element }) => {
  const [user, setUser] = useState<any>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const { children } = props
  const {
    isModalOpen: isLoginModalOpen,
    modalType: loginModalType,
    setModalType: setLoginModalType,
    setIsModalOpen: setIsLoginModalOpen,
    toggleModal: toggleLoginModal
  } = useModal()
  const navigate = useNavigate()

  useEffect(() => {
    const uid = localStorage.getItem('uid') || ''
    if (uid) setIsSignedIn(true)
    handleAuthStateChange(uid)
  }, [isSignedIn])

  useEffect(() => {
    handleSignInWithEmailLink()
  }, [])

  // auth observer
  const handleAuthStateChange = (uid: string) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)

        if (!uid) {
          localStorage.setItem('uid', uid)
          setIsSignedIn(true)
        }
      } else {
        if (uid) {
          localStorage.removeItem('uid')
          setIsSignedIn(false)
        }
      }
    })
  }

  const handleGoogleSignin = () => {
    signInWithGooglePopup()
      .then((res) => {
        toggleLoginModal()
        localStorage.setItem('uid', res.user.uid)
        setIsSignedIn(true)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // sign in
  const handleSignInWithEmailLink = () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = localStorage.getItem('emailForSignIn')
      if (!email) {
        email = window.prompt('Please provide your email for confirmation')
      }

      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            setUser(result.user)
            setIsSignedIn(true)
            localStorage.setItem('uid', result.user.uid)
            localStorage.removeItem('emailForSignIn')
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            navigate('/')
          })
      }
    }
  }

  const handleSignInEmailPassword = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        localStorage.setItem('uid', res.user.uid)
        setIsSignedIn(true)
        toggleLoginModal()

        return {
          status: true
        }
      })
      .catch((error) => {
        console.log(error)

        return {
          status: false,
          error
        }
      })
  }

  const handleSignInEmail = (email: string) => {
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true
    }
    return sendSignInLinkToEmail(auth, email, actionCodeSettings)
  }

  // sign up
  const handleSignUpEmailPassword = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        localStorage.setItem('uid', res.user.uid)
        setIsSignedIn(true)
        toggleLoginModal()

        return {
          status: true
        }
      })
      .catch((error) => {
        console.log(error)

        return {
          status: false,
          error
        }
      })
  }

  //sign out
  const handleLogout = async () => {
    await signOut(auth)
      .then(() => {
        navigate('/')
        setIsSignedIn(false)
        localStorage.removeItem('uid')
      })
      .catch((error) => {
        console.log(error)
      })

    setLoginModalType('')
    setIsLoginModalOpen(false)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isSignedIn,
        setIsSignedIn,

        isLoginModalOpen,
        loginModalType,
        setLoginModalType,
        toggleLoginModal,

        handleGoogleSignin,
        handleSignInEmailPassword,
        handleSignInEmail,
        handleSignUpEmailPassword,
        handleLogout
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
