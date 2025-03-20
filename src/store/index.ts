import { ApolloQueryResult, OperationVariables } from '@apollo/client'
import { create } from 'zustand'

type IFunction = (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>

type State = {
    refetchList: null | IFunction
}

type Action =  {
    setRefetch: (refetch: State['refetchList']) => void
}

const useStore = create<State & Action>((set) => ({
    refetchList: null,
    setRefetch: (refetch: State['refetchList']) => set(() => ({ refetchList: refetch })),
}))

export default useStore