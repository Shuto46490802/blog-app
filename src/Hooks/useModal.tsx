import { useEffect, useState } from 'react'
import { useTransition } from 'react-spring'

const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')

  const transition = useTransition(isModalOpen, {
    from: { opacity: 0, x: '-50%', y: '-50%', z: 0, scale: 0.7 },
    enter: { opacity: 1, x: '-50%', y: '-50%', z: 0, scale: 1 },
    leave: { opacity: 0, x: '-50%', y: '-50%', z: 0, scale: 0.7 },
    config: {
      duration: 200
    }
  })

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
  }, [isModalOpen])

  const toggleModal = (type: string = '') => {
    setIsModalOpen((prev) => !prev)
    setModalType(type)
  }

  return {
    isModalOpen,
    modalType,
    transition,

    setIsModalOpen,
    setModalType,
    toggleModal
  }
}

export default useModal
