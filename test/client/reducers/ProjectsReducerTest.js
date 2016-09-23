import '../UnitSpec'
import {describe, it} from 'mocha'
import {expect} from 'chai'
import {reduce} from '../../../src/client/reducers/ProjectsReducer'
import {TRAY_ADDED, REMOVE_TRAY, PROJECTS_FETCHED} from '../../../src/client/actions/TrackingActions'
import {INITIALISED} from '../../../src/client/actions/NevergreenActions'
import Immutable from 'immutable'

describe('ProjectsReducer', function () {

  it('should return the state unmodified for an unknown action', function () {
    const existingState = {foo: 'bar'}
    const newState = reduce(existingState, {type: 'not-a-real-action'})
    expect(newState).to.deep.equal(existingState)
  })

  describe('initialised action', function () {

    it('should merge the projects data', function () {
      const existingState = Immutable.Map()
      const action = {type: INITIALISED, data: Immutable.Map({projects: {foo: 'bar'}})}
      const newState = reduce(existingState, action)
      expect(newState).to.have.property('foo', 'bar')
    })
  })

  describe('tray added action', function () {

    it('should add a tray id property', function () {
      const existingState = Immutable.fromJS()
      const action = {type: TRAY_ADDED, trayId: 'trayId'}
      const newState = reduce(existingState, action)
      expect(newState).to.have.property('trayId').that.is.empty
    })
  })

  describe('removed tray action', function () {

    it('should delete the tray id property', function () {
      const existingState = Immutable.fromJS({trayId: {}})
      const action = {type: REMOVE_TRAY, trayId: 'trayId'}
      const newState = reduce(existingState, action)
      expect(newState).to.not.have.property('trayId')
    })
  })

  describe('projects fetched action', function () {

    it('should filter removed projects', function () {
      const existingState = Immutable.fromJS({trayId: {projectId: {removed: true}}})
      const action = {type: PROJECTS_FETCHED, trayId: 'trayId', data: Immutable.List()}
      const newState = reduce(existingState, action)
      expect(newState).to.have.property('trayId').that.is.empty
    })

    it('should set existing (non filtered) projects as old', function () {
      const existingState = Immutable.fromJS({trayId: {projectId: {isNew: true}}})
      const action = {type: PROJECTS_FETCHED, trayId: 'trayId', data: Immutable.List()}
      const newState = reduce(existingState, action)
      expect(newState).to.have.property('trayId').that.has.property('projectId').that.has.property('isNew', false)
    })

    it('should set existing (non filtered) projects as removed if they haven\'t been fetched again', function () {
      const existingState = Immutable.fromJS({trayId: {projectId: {removed: false}}})
      const action = {type: PROJECTS_FETCHED, trayId: 'trayId', data: Immutable.List()}
      const newState = reduce(existingState, action)
      expect(newState).to.have.property('trayId').that.has.property('projectId').that.has.property('removed', true)
    })

    it('should add newly fetched projects with the is new property', function () {
      const existingState = Immutable.fromJS({trayId: {}})
      const action = {
        type: PROJECTS_FETCHED,
        trayId: 'trayId',
        data: Immutable.fromJS([{projectId: 'projectId'}])
      }
      const newState = reduce(existingState, action)
      expect(newState).to.have.property('trayId').that.has.property('projectId').that.has.property('isNew', true)
    })

    it('should mark existing projects that have been fetched again as old', function () {
      const existingState = Immutable.fromJS({trayId: {projectId: {}}})
      const action = {
        type: PROJECTS_FETCHED,
        trayId: 'trayId',
        data: Immutable.fromJS([{projectId: 'projectId'}])
      }
      const newState = reduce(existingState, action)
      expect(newState).to.have.property('trayId').that.has.property('projectId').that.has.property('isNew', false)
    })

    it('should mark existing projects that have been fetched again as not removed', function () {
      const existingState = Immutable.fromJS({trayId: {projectId: {}}})
      const action = {
        type: PROJECTS_FETCHED,
        trayId: 'trayId',
        data: Immutable.fromJS([{projectId: 'projectId'}])
      }
      const newState = reduce(existingState, action)
      expect(newState).to.have.property('trayId').that.has.property('projectId').that.has.property('removed', false)
    })
  })
})
