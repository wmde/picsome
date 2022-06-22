const ConditionalWrapper = (props: {
  condition: boolean
  wrapper: (children: JSX.Element) => JSX.Element
  elseWrapper?: (children: JSX.Element) => JSX.Element
  children: JSX.Element
}) => {
  const { condition, wrapper, elseWrapper, children } = props
  return condition
    ? wrapper(children)
    : elseWrapper !== undefined
    ? elseWrapper(children)
    : children
}

export default ConditionalWrapper
