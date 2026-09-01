import { useLayoutEffect, useEffect } from 'react'
import { isServer } from 'utils/helpers/isServer'

const useIsomorphicEffect = isServer ? useEffect : useLayoutEffect

export { useIsomorphicEffect }
