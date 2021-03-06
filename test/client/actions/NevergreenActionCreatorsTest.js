import {proxyquire} from '../TestUtils'
import {before, beforeEach, describe, it} from 'mocha'
import {expect} from 'chai'
import sinon from 'sinon'
import {
  FULL_SCREEN,
  INITIALISED,
  INITIALISING,
  NAVIGATED,
  REQUEST_FULL_SCREEN
} from '../../../src/client/actions/Actions'

describe('NevergreenActionCreators', function () {
  let NevergreenActions, LocalRepository, Migrations

  before(function () {
    LocalRepository = {}
    Migrations = {}
    NevergreenActions = proxyquire('../../src/client/actions/NevergreenActionCreators', {
      '../common/repo/LocalRepository': LocalRepository,
      '../common/repo/Migrations': Migrations
    })
  })

  describe('initalising', function () {

    it('should return the correct type', function () {
      const actual = NevergreenActions.initalising({foo: 'bar'})
      expect(actual).to.have.property('type', INITIALISING)
    })
  })

  describe('initalised', function () {

    it('should return the correct type', function () {
      const actual = NevergreenActions.initalised()
      expect(actual).to.have.property('type', INITIALISED)
    })

    it('should return the configuration', function () {
      const actual = NevergreenActions.initalised({foo: 'bar'})
      expect(actual).to.have.property('data').that.contains.property('foo', 'bar')
    })
  })

  describe('navigated', function () {

    it('should return the correct type', function () {
      const actual = NevergreenActions.navigated()
      expect(actual).to.have.property('type', NAVIGATED)
    })
  })

  describe('initalise', function () {
    let dispatch

    beforeEach(function () {
      dispatch = sinon.spy()
      Migrations.migrate = (data) => data
    })

    it('should dispatch initalising action', function () {
      LocalRepository.init = sinon.stub().returns(Promise.resolve({}))
      LocalRepository.load = sinon.stub().returns(Promise.resolve({}))
      NevergreenActions.initalise()(dispatch)
      expect(dispatch).to.have.been.calledWithMatch({type: INITIALISING})
    })

    it('should initalise the local repository', function () {
      LocalRepository.init = sinon.stub().returns(Promise.resolve({}))
      LocalRepository.load = sinon.stub().returns(Promise.resolve({}))
      NevergreenActions.initalise()(dispatch)
      expect(LocalRepository.init).to.have.been.called()
    })

    it('should dispatch initalised action once configuration is loaded', function () {
      LocalRepository.init = sinon.stub().returns(Promise.resolve({}))
      LocalRepository.load = sinon.stub().returns(Promise.resolve({}))
      return NevergreenActions.initalise()(dispatch).then(() => {
        expect(dispatch).to.have.been.calledWithMatch({type: INITIALISED})
      })
    })
  })

  describe('full screen', function () {

    it('should return the correct type', function () {
      const actual = NevergreenActions.enableFullScreen()
      expect(actual).to.have.property('type', FULL_SCREEN)
    })

    it('should return the enabled flag', function () {
      const actual = NevergreenActions.enableFullScreen(true)
      expect(actual).to.have.property('enabled', true)
    })
  })

  describe('request full screen', function () {

    it('should return the correct type', function () {
      const actual = NevergreenActions.requestFullScreen()
      expect(actual).to.have.property('type', REQUEST_FULL_SCREEN)
    })

    it('should return the requested flag', function () {
      const actual = NevergreenActions.requestFullScreen(true)
      expect(actual).to.have.property('requested', true)
    })
  })
})
