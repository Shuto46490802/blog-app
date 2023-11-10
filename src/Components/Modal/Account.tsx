// react
import { Link } from 'react-router-dom'

// library
import {
  faMagnifyingGlass,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Account = () => {
  return (
    <div className='account-modal w-full h-full pt-6 flex flex-col'>
      <div className='account-modal__group'>
        <ul className='flex flex-col gap-4'>
          <li>
            <Link to='/write-story' className='header__link'>
              <FontAwesomeIcon
                icon={faPenToSquare}
                size='lg'
                className='mr-4'
              />
              <span>Write</span>
            </Link>
          </li>
          <li>
            <button type='button' className='header__link'>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className='mr-4'
                size='lg'
              />
              <span>Search</span>
            </button>
          </li>
        </ul>
      </div>

      <div className='account-modal__group'>
        <ul className='flex flex-col gap-4'>
          <li>
            <Link to='/account' className='header__link'>
              <span>Account</span>
            </Link>
          </li>
          <li>
            <Link to='/account/settings' className='header__link'>
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link to='/account/posts' className='header__link'>
              <span>Your Posts</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className='account-modal__group'>
        <ul className='flex flex-col gap-4'>
          <li>
            <button type='button' className='header__link'>
              <span>Sign out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Account
