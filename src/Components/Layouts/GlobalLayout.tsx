// react
import { Outlet } from 'react-router-dom'

// library
import { CSSTransition } from 'react-transition-group'

// src
import Header from '../Global/Header'
import Modal from '../UI/Modal'
import { useContext } from 'react'
import UserContext from '../../Context/user-context'

const GlobalLayout = () => {
  // context
  const userContext = useContext(UserContext)
  const {
    isLoginModalOpen,
    loginModalType,
    toggleLoginModal,
    setLoginModalType
  } = userContext

  return (
    <>
      <Header toggleModal={toggleLoginModal} />
      <main>
        <Outlet />
      </main>
      <CSSTransition
        in={isLoginModalOpen}
        timeout={300}
        classNames='modal'
        unmountOnExit
        onExited={() => {
          setLoginModalType('')
        }}
      >
        <Modal
          type={loginModalType}
          toggleModal={toggleLoginModal}
          classes='top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] h-full md:h-[650px] w-full md:max-w-[680px]'
          isCloseButton={true}
          setModalType={setLoginModalType}
          setIsModalOpen={() => {}}
        />
      </CSSTransition>
      <CSSTransition
        in={isLoginModalOpen}
        timeout={300}
        classNames='modal-overlay'
        unmountOnExit
      >
        <div
          onClick={() => toggleLoginModal()}
          className='mask bg-white opacity-70 fixed top-0 left-0 w-full h-full'
        ></div>
      </CSSTransition>
    </>
  )
}

export default GlobalLayout
