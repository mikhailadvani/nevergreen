import {proxyquire} from '../TestUtils'
import {before, beforeEach, describe, it} from 'mocha'
import {expect} from 'chai'
import sinon from 'sinon'
import {
  ENCRYPTING_PASSWORD,
  HIGHLIGHT_TRAY,
  PASSWORD_ENCRYPT_ERROR,
  PASSWORD_ENCRYPTED,
  PROJECTS_FETCH_ERROR,
  PROJECTS_FETCHED,
  PROJECTS_FETCHING,
  REMOVE_TRAY,
  SELECT_PROJECT,
  SET_SERVER_TYPE,
  SET_TRAY_ID,
  SET_TRAY_NAME,
  SET_TRAY_URL,
  SET_TRAY_USERNAME,
  TRAY_ADDED
} from '../../../src/client/actions/Actions'

describe('TrackingActionCreators', function () {
  let TrackingActions, SecurityGateway, ProjectsGateway, Gateway, nameGenerator

  before(function () {
    SecurityGateway = {}
    ProjectsGateway = {}
    Gateway = {}
    nameGenerator = {}
    TrackingActions = proxyquire('../../src/client/actions/TrackingActionCreators', {
      '../common/gateways/SecurityGateway': SecurityGateway,
      '../common/gateways/ProjectsGateway': ProjectsGateway,
      '../common/gateways/Gateway': Gateway,
      '../common/project/Name': nameGenerator
    })
  })

  describe('tray added', function () {

    before(function () {
      nameGenerator.generateRandomName = sinon.stub().returns('')
    })

    it('should return the correct type', function () {
      const actual = TrackingActions.trayAdded()
      expect(actual).to.have.property('type', TRAY_ADDED)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.trayAdded('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
      expect(actual).to.have.property('data').that.includes.property('trayId', 'some-tray-id')
    })

    it('should return the tray url', function () {
      const actual = TrackingActions.trayAdded('irrelevant', 'some-url')
      expect(actual).to.have.property('data').that.includes.property('url', 'some-url')
    })

    it('should return the tray username', function () {
      const actual = TrackingActions.trayAdded('irrelevant', 'irrelevant', 'some-username')
      expect(actual).to.have.property('data').that.includes.property('username', 'some-username')
    })

    it('should return a generated tray name', function () {
      nameGenerator.generateRandomName = sinon.stub().returns('some-generated-name')
      const actual = TrackingActions.trayAdded()
      expect(actual).to.have.property('data').that.includes.property('name', 'some-generated-name')
    })

    it('should return highlight', function () {
      const actual = TrackingActions.trayAdded('irrelevant', 'irrelevant', 'some-username')
      expect(actual).to.have.property('data').that.includes.property('highlight', true)
    })
  })

  describe('highlight tray', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.highlightTray()
      expect(actual).to.have.property('type', HIGHLIGHT_TRAY)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.highlightTray('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })
  })

  describe('encrypting password', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.encryptingPassword()
      expect(actual).to.have.property('type', ENCRYPTING_PASSWORD)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.encryptingPassword('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should return the password being encrypted', function () {
      const actual = TrackingActions.encryptingPassword('irrelevant', 'some-password')
      expect(actual).to.have.property('password', 'some-password')
    })

    it('should return the request', function () {
      const actual = TrackingActions.encryptingPassword('irrelevant', 'irrelevant', 'some-request')
      expect(actual).to.have.property('request', 'some-request')
    })
  })

  describe('password encrypted', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.passwordEncrypted()
      expect(actual).to.have.property('type', PASSWORD_ENCRYPTED)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.passwordEncrypted('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should return the encrypted password', function () {
      const actual = TrackingActions.passwordEncrypted('irrelevant', 'encrypted-password')
      expect(actual).to.have.property('password', 'encrypted-password')
    })
  })

  describe('password encrypt error', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.passwordEncryptError()
      expect(actual).to.have.property('type', PASSWORD_ENCRYPT_ERROR)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.passwordEncryptError('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should return the errors', function () {
      const actual = TrackingActions.passwordEncryptError('some-tray-id', ['some-error'])
      expect(actual).to.have.property('errors').that.includes('some-error')
    })
  })

  describe('remove tray', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.removeTray()
      expect(actual).to.have.property('type', REMOVE_TRAY)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.removeTray('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should abort the pending request', function () {
      const abort = sinon.spy()
      TrackingActions.removeTray('some-tray-id', {abort})
      expect(abort).to.have.been.called()
    })
  })

  describe('projects fetching', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.projectsFetching()
      expect(actual).to.have.property('type', PROJECTS_FETCHING)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.projectsFetching('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should return the request', function () {
      const actual = TrackingActions.projectsFetching('irrelevant', 'some-request')
      expect(actual).to.have.property('request', 'some-request')
    })
  })

  describe('projects fetched', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.projectsFetched('irrelevant', [])
      expect(actual).to.have.property('type', PROJECTS_FETCHED)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.projectsFetched('some-tray-id', [])
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should return the projects', function () {
      const actual = TrackingActions.projectsFetched('irrelevant', [{foo: 'bar', webUrl: ''}])
      expect(actual).to.have.property('data').that.includes.deep.property('[0].foo', 'bar')
    })

    it('should return a timestamp', function () {
      const actual = TrackingActions.projectsFetched('irrelevant', [])
      expect(actual).to.have.property('timestamp').that.is.not.empty()
    })

    it('should return the server type', function () {
      const actual = TrackingActions.projectsFetched('irrelevant', [{
        serverType: 'some-type'
      }])
      expect(actual).to.have.property('serverType', 'some-type')
    })
  })

  describe('projects fetch error', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.projectsFetchError()
      expect(actual).to.have.property('type', PROJECTS_FETCH_ERROR)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.projectsFetchError('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should return the errors', function () {
      const actual = TrackingActions.projectsFetchError('some-tray-id', ['some-error'])
      expect(actual).to.have.property('errors').that.includes('some-error')
    })
  })

  describe('set tray name', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.setTrayName()
      expect(actual).to.have.property('type', SET_TRAY_NAME)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.setTrayName('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should return the tray name', function () {
      const actual = TrackingActions.setTrayName('irrelevant', 'some-name')
      expect(actual).to.have.property('name', 'some-name')
    })
  })

  describe('set server type', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.setServerType()
      expect(actual).to.have.property('type', SET_SERVER_TYPE)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.setServerType('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should return the server type', function () {
      const actual = TrackingActions.setServerType('irrelevant', 'some-type')
      expect(actual).to.have.property('serverType', 'some-type')
    })
  })

  describe('set tray username', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.setTrayUsername()
      expect(actual).to.have.property('type', SET_TRAY_USERNAME)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.setTrayUsername('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should return the tray username', function () {
      const actual = TrackingActions.setTrayUsername('irrelevant', 'some-username')
      expect(actual).to.have.property('username', 'some-username')
    })
  })

  describe('set tray url', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.setTrayUrl()
      expect(actual).to.have.property('type', SET_TRAY_URL)
    })

    it('should return the url', function () {
      const actual = TrackingActions.setTrayUrl('irrelevant', 'some-url')
      expect(actual).to.have.property('url', 'some-url')
    })
  })

  describe('set tray id', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.setTrayId()
      expect(actual).to.have.property('type', SET_TRAY_ID)
    })

    it('should return the original tray id', function () {
      const actual = TrackingActions.setTrayId('some-tray-id')
      expect(actual).to.have.property('originalTrayId', 'some-tray-id')
    })

    it('should return the new tray id', function () {
      const actual = TrackingActions.setTrayId('some-tray-id', 'some-url')
      expect(actual).to.have.property('newTrayId', 'some-url')
    })
  })

  describe('encrypt password', function () {
    let dispatch

    beforeEach(function () {
      dispatch = sinon.spy()
    })

    it('should dispatch encrypting password action', function () {
      SecurityGateway.encryptPassword = sinon.stub().returns({})
      Gateway.send = sinon.stub().returns(Promise.resolve(''))
      TrackingActions.encryptPassword('irrelevant', 'irrelevant')(dispatch)
      expect(dispatch).to.have.been.calledWithMatch({type: ENCRYPTING_PASSWORD})
    })

    it('should dispatch password encrypted action', function () {
      SecurityGateway.encryptPassword = sinon.stub().returns({})
      Gateway.send = sinon.stub().returns(Promise.resolve(''))
      return TrackingActions.encryptPassword('irrelevant', 'irrelevant')(dispatch).then(() => {
        expect(dispatch).to.have.been.calledWithMatch({type: PASSWORD_ENCRYPTED})
      })
    })

    it('should dispatch password encrypted action if password is blank without calling the gateway', function () {
      SecurityGateway.encryptPassword = sinon.spy()
      Gateway.send = sinon.spy()
      return TrackingActions.encryptPassword('irrelevant', '')(dispatch).then(() => {
        expect(dispatch).to.have.been.calledWithMatch({type: PASSWORD_ENCRYPTED})
        expect(SecurityGateway.encryptPassword).to.not.have.been.called()
        expect(Gateway.send).to.not.have.been.called()
      })
    })

    it('should abort pending request', function () {
      SecurityGateway.encryptPassword = sinon.stub().returns({})
      Gateway.send = sinon.stub().returns(Promise.resolve(''))
      const pendingRequest = {abort: sinon.spy()}
      TrackingActions.encryptPassword('irrelevant', 'irrelevant', pendingRequest)(dispatch)
      expect(pendingRequest.abort).to.have.been.called()
    })
  })

  describe('select project', function () {

    it('should return the correct type', function () {
      const actual = TrackingActions.selectProject()
      expect(actual).to.have.property('type', SELECT_PROJECT)
    })

    it('should return the tray id', function () {
      const actual = TrackingActions.selectProject('some-tray-id')
      expect(actual).to.have.property('trayId', 'some-tray-id')
    })

    it('should return the web url', function () {
      const actual = TrackingActions.selectProject('irrelevant', 'some-project-url')
      expect(actual).to.have.property('projectId', 'some-project-url')
    })

    it('should return if the project was selected', function () {
      const actual = TrackingActions.selectProject('irrelevant', 'irrelevant', true)
      expect(actual).to.have.property('selected', true)
    })
  })

  describe('add tray', function () {
    let dispatch

    beforeEach(function () {
      dispatch = sinon.spy()
    })

    it('should dispatch tray added action', function () {
      ProjectsGateway.fetchAll = sinon.stub().returns({})
      Gateway.send = sinon.stub().returns(Promise.resolve(''))
      TrackingActions.addTray()(dispatch)
      expect(dispatch).to.have.been.calledWithMatch({type: TRAY_ADDED})
    })

    it('should automatically append http:// to urls missing a scheme')

    it('should encrypt any password given')

    it('should refresh tray')

    it('should not dispatch anything if the tray has already been added')
  })

  describe('refresh tray', function () {

    it('should dispatch projects fetching action')

    it('should dispatch projects fetched action on success')

    it('should filter projects containing jobs')

    it('should dispatch projects fetch error action on failure')

    it('should abort any pending request')
  })
})
