const Message = (props: { type: string; toggleModal: Function }) => {
  const { type, toggleModal } = props
  const email = localStorage.getItem('emailForSignIn')

  return (
    <div className='flex flex-col items-center py-[44px] px-[56px]'>
      <h2 className='mb-8'>
        {type === 'sent-link' ? 'Check your inbox.' : ''}
      </h2>
      <p>
        {type === 'sent-link'
          ? `Click the link we sent to ${email} to sign in.`
          : ''}
      </p>
      <button
        type='button'
        onClick={() => toggleModal()}
        className='button button-primary mt-20 min-w-auto'
      >
        OK
      </button>
    </div>
  )
}

export default Message
