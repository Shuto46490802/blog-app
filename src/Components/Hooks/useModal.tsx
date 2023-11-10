import { useEffect, useState } from 'react'

const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
  }, [isModalOpen])

  const toggleModal = (type: string = '') => {
    setIsModalOpen((prev) => !prev)

    if (type) {
      setModalType(type)
    }
  }

  return {
    isModalOpen,
    modalType,

    setModalType,
    toggleModal
  }
}

export default useModal
