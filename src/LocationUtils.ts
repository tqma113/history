import invariant from 'tiny-invariant'
import { parsePath } from './PathUtils'
import Actions, { POP } from './Actions'
import type { ParsedUrlQuery } from 'querystring'
import type {
  BaseLocation,
  Location
} from './index'

export function createQuery(props?: object): ParsedUrlQuery {
  return Object.assign(Object.create(null), props)
}

export function createLocation<
  BL extends BaseLocation = BaseLocation,
  IL extends Location = Location
>(
  input: BL | string = '/',
  action: Actions = POP,
  key: string = ''
): IL {
  let location = typeof input === 'string'
    ? parsePath(input)
    : input

  let pathname: string = location.pathname || '/'
  let search: string = location.search || ''
  let hash: string = location.hash || ''
  let state: unknown = location.state

  try {
    pathname = decodeURI(pathname)
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError(
        'Pathname "' +
          location.pathname +
          '" could not be decoded. ' +
          'This is likely caused by an invalid percent-encoding.'
      )
    } else {
      throw e
    }
  }

  return {
    pathname,
    search,
    hash,
    state,
    action,
    key
  } as IL
}

export function defaultGetUserConfirmation(
  message: string,
  callback: Function
): void {
  callback(window.confirm(message))
}

function isDate(object: object): boolean {
  return Object.prototype.toString.call(object) === '[object Date]'
}

function getKeys<T extends {}>(o: T): Array<keyof T>{
  return Object.keys(o) as Array<keyof T>
} 

export function statesAreEqual(a: unknown, b: unknown): boolean {
  if (a === b)
    return true

  if (typeof a !== typeof b)
    return false
  
  

  invariant(
    typeof a !== 'function',
    'You must not store functions in location state'
  )


  // Not the same object, but same type.
  if (typeof a === 'object' && typeof b === 'object') {
    if (a === null || b === null) {
      return false
    } else {
      invariant(
        !(isDate(a) && isDate(b)),
        'You must not store Date objects in location state'
      )
  
      if (!Array.isArray(a)) {
        const keysofA = getKeys(a)
        const keysofB = getKeys(b)
  
        return (
          keysofA.length === keysofB.length &&
            keysofA.every(key => statesAreEqual(a[key], b[key]))
        )
      }
  
      return (
        Array.isArray(b) &&
          a.length === b.length &&
            a.every((item, index) => statesAreEqual(item, b[index]))
      )
    }
  }

  // All other serializable types (string, number, boolean)
  // should be strict equal.
  return false
}

export function locationsAreEqual(a: Location, b: Location): boolean {
  return (
    a.key === b.key && // Different key !== location change.
      a.pathname === b.pathname &&
        a.search === b.search &&
          a.hash === b.hash &&
            statesAreEqual(a.state, b.state)
  )
}
