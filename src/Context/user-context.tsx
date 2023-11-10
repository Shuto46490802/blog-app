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
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut
} from '@firebase/auth'
import { auth, signInWithGooglePopup } from '../Utils/firebase'
import useModal from '../Components/Hooks/useModal'
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
    toggleModal: toggleLoginModal
  } = useModal()
  const navigate = useNavigate()

  useEffect(() => {
    const uid = localStorage.getItem('uid') || ''
    if (uid) setIsSignedIn(true)
    console.log(uid)
    handleAuthStateChange(uid)
  }, [isSignedIn])

  useEffect(() => {
    handleSignInWithEmailLink()
  }, [])

  // auth observer
  const handleAuthStateChange = (uid: string) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
      } else {
        if (uid) {
          toggleLoginModal('sign-in-options')
          localStorage.removeItem('uid')
        }
      }
    })
  }

  const handleGoogleSignin = () => {
    signInWithGooglePopup()
      .then((res) => {
        localStorage.setItem('uid', res.user.uid)
        setIsSignedIn(true)
        toggleLoginModal()
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

  const handleSignInEmailPassword = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleSignInEmail = async (email: string) => {
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true
    }
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then((res) => {
        localStorage.setItem('emailForSignIn', email)
      })
      .catch((error) => console.log(error))
  }

  // sign up

  //sign out
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/')
        setIsSignedIn(false)
        localStorage.removeItem('uid')
      })
      .catch((error) => {
        console.log(error)
      })
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
        handleLogout
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
