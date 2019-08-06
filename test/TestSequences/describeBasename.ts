import { PUSH, REPLACE, POP } from '../../src/Actions'
import useBasename from '../../src/useBasename'
import { NativeHistory } from '../../src/createHistory'
import { Location } from '../../src/LocationUtils'
import execSteps from './execSteps'
import { Step, Done, Describe } from '../type'

const stripHash: (path: string) => string = (path) =>
  path.replace(/^#/, '')

const describeBasename: Describe = (createHistory) => {
  describe('basename handling', () => {
    let history: NativeHistory
    beforeEach(() => {
      history = useBasename(createHistory)({
        basename: '/base/url'
      })
    })

    describe('in push', () => {
      it('works with string', (done: Done) => {
        const steps: Step[] = [
          (location: Location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBeUndefined()
            expect(location.action).toEqual(POP)
            expect(location.key).toBeNull()
            expect(location.basename).toEqual('')

            history.push('/home')
          },
          (location: Location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toBeUndefined()
            expect(location.action).toEqual(PUSH)
            expect(location.key).toBeDefined()
            expect(location.basename).toEqual('/base/url')
          }
        ]

        execSteps(steps, history, done)
      })

      it('works with object', (done: Done) => {
        const steps = [
          (location: Location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBeUndefined()
            expect(location.action).toEqual(POP)
            expect(location.key).toBeNull()
            expect(location.basename).toEqual('')

            history.push({
              pathname: '/home',
              state: { the: 'state' }
            })
          },
          (location: Location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.key).toBeDefined()
            expect(location.basename).toEqual('/base/url')

            history.push({
              ...location,
              pathname: '/foo'
            })
          },
          (location: Location) => {
            expect(location.pathname).toEqual('/foo')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.key).toBeDefined()
            expect(location.basename).toEqual('/base/url')
          }
        ]

        execSteps(steps, history, done)
      })
    })

    describe('in replace', () => {
      it('works with string', (done: Done) => {
        const steps = [
          (location: Location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBeUndefined()
            expect(location.action).toEqual(POP)
            expect(location.key).toBeNull()
            expect(location.basename).toEqual('')

            history.replace('/home')
          },
          (location: Location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toBeUndefined()
            expect(location.action).toEqual(REPLACE)
            expect(location.key).toBeDefined()
            expect(location.basename).toEqual('/base/url')
          }
        ]

        execSteps(steps, history, done)
      })

      it('works with object', (done: Done) => {
        const steps = [
          (location: Location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBeUndefined()
            expect(location.action).toEqual(POP)
            expect(location.key).toBeNull()
            expect(location.basename).toEqual('')

            history.replace({
              pathname: '/home',
              state: { the: 'state' }
            })
          },
          (location: Location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)
            expect(location.key).toBeDefined()
            expect(location.basename).toEqual('/base/url')

            history.replace({
              ...location,
              pathname: '/foo'
            })
          },
          (location: Location) => {
            expect(location.pathname).toEqual('/foo')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)
            expect(location.key).toBeDefined()
            expect(location.basename).toEqual('/base/url')
          }
        ]

        execSteps(steps, history, done)
      })
    })

    describe('in createPath', () => {
      it('works', () => {
        expect(
          history.createPath('/the/path')
        ).toEqual('/base/url/the/path')
      })
    })

    describe('in createHref', () => {
      it('works', () => {
        expect(
          stripHash(history.createHref('/the/path'))
        ).toEqual('/base/url/the/path')
      })
    })

    describe('in createLocation', () => {
      it('works with string', () => {
        const location = history.createLocation('/the/path')

        expect(location.pathname).toEqual('/the/path')
        expect(location.basename).toEqual('/base/url')
      })

      it('works with object without query', () => {
        const location = history.createLocation({
          pathname: '/the/path'
        })

        expect(location.pathname).toEqual('/the/path')
        expect(location.basename).toEqual('/base/url')
      })

      it('works with string contains search', () => {
        const location = history.createLocation('/the/path?a=1&b=2')

        expect(location.pathname).toEqual('/the/path')
        expect(location.basename).toEqual('/base/url')
        expect(location.search).toEqual('?a=1&b=2')
      })
    })
  })
}

export default describeBasename