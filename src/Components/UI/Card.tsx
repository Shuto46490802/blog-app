const Card = (props: { children: JSX.Element; classes: string }) => {
  const { classes, children } = props
  return <div className={`rounded shadow-lg ${classes}`}>{children}</div>
}

export default Card
