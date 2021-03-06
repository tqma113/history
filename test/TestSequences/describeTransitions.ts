import execSteps from './execSteps'
import { Location, Actions, History } from '../../src'

import { Step, Done, Describe, } from '../type'

const describeTransitions: Describe = (createHistory) => {
  describe('a synchronous transition hook', () => {
    let history: History = createHistory()
    let unlistenBefore: Function
    beforeEach(() => {
      history = createHistory()
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()
    })

    it('receives the next location', (done: Done) => {
      let nextLocation: Location
      const steps: Step[] = [
        () => {
          history.push({
            pathname: '/home',
            search: '?the=query',
            state: { the: 'state' }
          })
        },
        (location: Location) => {
          expect(nextLocation).toBe(location)
        }
      ]

      unlistenBefore = history.listenBefore((location: Location) => {
        nextLocation = location
      })

      execSteps(steps, history, done)
    })
  })

  describe('an asynchronous transition hook', () => {
    let history: History = createHistory()
    let unlistenBefore: Function
    beforeEach(() => {
      history = createHistory()
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()
    })

    it('receives the next location', (done: Done) => {
      let nextLocation: Location
      const steps: Step[] = [
        () => {
          history.push({
            pathname: '/home',
            search: '?the=query',
            state: { the: 'state' }
          })
        },
        (location: Location) => {
          expect(nextLocation).toBe(location)
        }
      ]

      unlistenBefore = history.listenBefore((location: Location, callback?: Function) => {
        nextLocation = location
        callback && setTimeout(callback)
      })

      execSteps(steps, history, done)
    })
  })

  describe('when the user confirms a transition', () => {
    let location: Location
    let history: History = createHistory()
    let unlisten: Function
    let unlistenBefore: Function
    beforeEach(() => {

      const confirmationMessage: string = 'Are you sure?'

      let options = {
        getUserConfirmation(message: string, callback: Function) {
          expect(message).toBe(confirmationMessage)
          callback(true)
        }
      }

      history = createHistory(options)

      location = history.getCurrentLocation()

      unlistenBefore = history.listenBefore(() => confirmationMessage)

      unlisten = history.listen((loc: Location) => {
        location = loc
      })
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('updates the location', () => {
      const prevLocation: Location = location

      history.push({
        pathname: '/home',
        search: '?the=query',
        state: { the: 'state' }
      })

      expect(prevLocation).not.toBe(location)

      expect(location.pathname).toEqual('/home')
      expect(location.search).toEqual('?the=query')
      expect(location.state).toEqual({ the: 'state' })
      expect(location.action).toEqual(Actions.PUSH)
      expect(location.key).toBeDefined()
    })
  })

  describe('when the user cancels a transition', () => {
    let location: Location
    let history: History = createHistory()
    let unlisten: Function
    let unlistenBefore: Function
    beforeEach(() => {

      const confirmationMessage: string = 'Are you sure?'

      let options = {
        getUserConfirmation(message: string, callback: Function) {
          expect(message).toBe(confirmationMessage)
          callback(false)
        }
      }

      history = createHistory(options)
      location = history.getCurrentLocation()

      unlistenBefore = history.listenBefore(() => confirmationMessage)

      unlisten = history.listen((loc: Location) => {
        location = loc
      })
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('does not update the location', () => {
      const prevLocation: Location = location
      history.push('/home')
      expect(location).toBe(prevLocation)
    })
  })

  describe('when the transition hook cancels a transition', () => {
    let location: Location
    let history: History = createHistory()
    let unlisten: Function
    let unlistenBefore: Function
    beforeEach(() => {

      history = createHistory()
      location = history.getCurrentLocation()

      unlistenBefore = history.listenBefore(() => false)

      unlisten = history.listen((loc: Location) => {
        location = loc
      })
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('does not update the location', () => {
      const prevLocation: Location = location
      history.push('/home')
      expect(location).toBe(prevLocation)
    })
  })
}

export default describeTransitions
