/// <reference path="../../src/type.d.ts" />
import execSteps from './execSteps'
import { Step, Done, Describe } from '../type'

const describeHashSupport: Describe = (createHistory) => {
  describe('when a URL with a hash is pushed', () => {
    let history: CH.NativeHistory
    beforeEach(() => {
      history = createHistory()
    })

    it('preserves the hash', (done: Done) => {
      const steps: Step[] = [
        (location: CH.Location) => {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.hash).toEqual('')
          expect(location.state).toBeUndefined()
          expect(location.action).toEqual(CH.Actions.POP)
          expect(location.key).toBeNull()

          history.push({
            pathname: '/home',
            search: '?the=query',
            hash: '#the-hash',
            state: { the: 'state' }
          })
        },
        (location: CH.Location) => {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.hash).toEqual('#the-hash')
          expect(location.state).toEqual({ the: 'state' })
          expect(location.action).toEqual(CH.Actions.PUSH)
          expect(location.key).toBeDefined()
        }
      ]

      execSteps(steps, history, done)
    })

    it('does not convert PUSH to REPLACE if path does not change', (done: Done) => {
      const steps: Step[] = [
        (location: CH.Location) => {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.hash).toEqual('')
          expect(location.state).toBeUndefined()
          expect(location.action).toEqual(CH.Actions.POP)
          expect(location.key).toBeNull()

          history.push('/#the-hash')
        },
        (location: CH.Location) => {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.hash).toEqual('#the-hash')
          expect(location.state).toBeUndefined()
          expect(location.action).toEqual(CH.Actions.PUSH)
          expect(location.key).toBeDefined()
        }
      ]

      execSteps(steps, history, done)
    })
  })
}

export default describeHashSupport
