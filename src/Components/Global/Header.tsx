// react
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'

// library
import {
  faMagnifyingGlass,
  faPenToSquare,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// src
import UserContext from '../../Context/user-context'
import useModal from '../Hooks/useModal'
import Modal from '../UI/Modal'

const Header = (props: { toggleModal: Function }) => {
  // props
  const { toggleModal } = props
  // context
  const userContext = useContext(UserContext)
  const { isSignedIn, setIsSignedIn, handleLogout } = userContext

  // hooks
  const navigate = useNavigate()
  const {
    isModalOpen: isAccountModalOpen,
    modalType: accountModalType,
    toggleModal: toggleAccountModal,
    setModalType: setAccountModalType
  } = useModal()

  return (
    <header>
      <div className='flex justify-between items-center px-4 border-b-[1px] flfe'>
        <div className='flex items-center'>
          <div>
            <Link to='/'>
              <img src='/blog-logo.png' alt='' width='60' height='60' />
            </Link>
          </div>
          {isSignedIn && (
            <div className='rounded-[24px] overflow-hidden ml-2 sm:block hidden'>
              <div className='bg-gray-100 px-3 py-2'>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input
                  type='text'
                  className='bg-gray-100 ml-4 outline-0 text-sm'
                  placeholder='Search'
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <nav>
            <ul className='flex items-center gap-6 text-sm'>
              {isSignedIn && (
                <li className='sm:hidden block'>
                  <button
                    type='button'
                    className='header__link'
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} size='lg' />
                  </button>
                </li>
              )}
              <li>
                {isSignedIn ? (
                  <Link
                    to='/write-story'
                    className='flex items-center header__link'
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size='lg'
                      className='sm:mr-2'
                    />
                    <span className='sm:block hidden'>Write</span>
                  </Link>
                ) : (
                  <button
                    type='button'
                    onClick={() => toggleModal('sign-in-required')}
                    className='header__link'
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size='lg'
                      className='sm:mr-2'
                    />
                    <span className='sm:block hidden'>Write</span>
                  </button>
                )}
              </li>
              <li className='relative'>
                {isSignedIn ? (
                  <>
                    <button
                      type='button'
                      onClick={() => toggleAccountModal('account')}
                      className='header__link'
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        size='lg'
                        className='sm:mr-2'
                      />
                      <span className='sm:block hidden'>Account</span>
                    </button>

                    {isAccountModalOpen && (
                      <Modal
                        type={accountModalType}
                        toggleModal={toggleAccountModal}
                        classes='top-[calc(100%+10px)] min-w-[250px] right-0'
                        isCloseButton={false}
                        setModalType={setAccountModalType}
                      />
                    )}
                  </>
                ) : (
                  <button
                    type='button'
                    onClick={() => toggleModal('sign-in-options')}
                    className='header__link'
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      size='lg'
                      className='sm:mr-2'
                    />
                    <span className='sm:block hidden'>Sign in</span>
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
