import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import isEqual from 'lodash/isEqual'
import type { RootState, TypedDispatch } from '../../store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<TypedDispatch<RootState>>()
export const useAppSelector: TypedUseSelectorHook<RootState> = (selector) =>
  useSelector(selector, isEqual)
