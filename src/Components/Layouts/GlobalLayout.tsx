// react
import { Outlet } from 'react-router-dom'

// library
import { CSSTransition } from 'react-transition-group'
import { useTransition, animated } from 'react-spring'

// src
import Header from '../Global/Header'
import Modal from '../UI/Modal'
import { useContext } from 'react'
import UserContext from '../../Context/user-context'

const AnimatedModal = animated(Modal)

const GlobalLayout = () => {
  // context
  const userContext = useContext(UserContext)
  const {
    isLoginModalOpen,
    loginModalType,
    toggleLoginModal,
    loginModalTransition,
    setLoginModalType
  } = userContext

  const overlayTransition = useTransition(isLoginModalOpen, {
    from: { opacity: 0 },
    enter: { opacity: 0.7 },
    leave: { opacity: 0 },
    config: {
      duration: 200
    }
  })

  return (
    <>
      <Header toggleModal={toggleLoginModal} />
      <main>
        <Outlet />
      </main>

      {loginModalTransition((style: any, item: any) => {
        return (
          item && (
            <AnimatedModal
              style={style}
              type={loginModalType}
              toggleModal={toggleLoginModal}
              classes='top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] h-full md:h-[650px] w-full md:max-w-[680px]'
              isCloseButton={true}
              setModalType={setLoginModalType}
              setIsModalOpen={() => {}}
            />
          )
        )
      })}

      {overlayTransition((style, item) => {
        return (
          item && (
            <animated.div
              style={style}
              onClick={() => toggleLoginModal()}
              className='mask bg-white opacity-70 fixed top-0 left-0 w-full h-full'
            ></animated.div>
          )
        )
      })}
    </>
  )
}

export default GlobalLayout
