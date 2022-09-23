import CollectModal from "./CollectModal"
import Loader from "./Loader"
import React, { Suspense, SyntheticEvent } from "react"
import { PrivilegedActionModal } from "app/auth/components/PrivilegedActionModal"
import { Resource } from "db"
import { useSession } from "blitz"

const PrivilegedCollectModal = (props: {
  resource: Resource
  showModal: boolean
  onClose: (event?: SyntheticEvent) => void
}) => {
  if (!props.showModal) {
    return null
  }

  return (
    <Suspense fallback={<></>}>
      <UserAwarePrivilegedCollectModal resource={props.resource} onClose={props.onClose} />
    </Suspense>
  )
}

export default PrivilegedCollectModal

const UserAwarePrivilegedCollectModal = (props: {
  resource: Resource
  onClose: (event?: SyntheticEvent) => void
}) => {
  const { userId } = useSession()

  if (userId === null) {
    return <PrivilegedActionModal onClose={props.onClose} />
  }

  return (
    <Suspense fallback={<></>}>
      <CollectModal onClose={props.onClose} resource={props.resource} userId={userId} />
    </Suspense>
  )
}
