import { type ComponentType, Suspense } from 'react'
import { Loading } from './Loading'

type Prop<P> = P & {}

function Loadable<P>(Component: ComponentType<P>) {
  return function LoadableComponent(props: Prop<P>) {
    return (
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

export default Loadable
