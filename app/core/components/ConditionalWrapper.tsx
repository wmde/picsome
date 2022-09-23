const ConditionalWrapper = (props: {
  condition: boolean
  wrapper: (children: React.ReactNode) => JSX.Element
  elseWrapper?: (children: React.ReactNode) => JSX.Element
  children: React.ReactNode
}): JSX.Element => {
  const { condition, wrapper, elseWrapper, children } = props
  return condition ? (
    wrapper(children)
  ) : elseWrapper !== undefined ? (
    elseWrapper(children)
  ) : (
    <>{children}</>
  )
}

export default ConditionalWrapper
