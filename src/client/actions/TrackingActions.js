import Immutable from 'immutable'
import {encryptPassword as encrypt} from '../common/gateways/SecurityGateway'
import {fetchAll} from '../common/gateways/ProjectsGateway'
import uuid from 'node-uuid'
import moment from 'moment'
import _ from 'lodash'
import nameGenerator from 'project-name-generator'

function hasScheme(url) {
  return _.size(_.split(url, '://')) > 1
}

function isNotBlank(value) {
  return _.size(value) > 0
}

function generateRandomName() {
  return _.startCase(nameGenerator().spaced)
}

export const TRAY_ADDED = 'TRAY_ADDED'
export function trayAdded(trayId, url, username) {
  return {
    type: TRAY_ADDED,
    trayId,
    data: Immutable.Map({
      trayId,
      url,
      username,
      name: generateRandomName()
    })
  }
}

export const ENCRYPTING_PASSWORD = 'ENCRYPTING_PASSWORD'
export function encryptingPassword(trayId, password) {
  return {
    type: ENCRYPTING_PASSWORD,
    trayId,
    password
  }
}

export const PASSWORD_ENCRYPTED = 'PASSWORD_ENCRYPTED'
export function passwordEncrypted(trayId, password) {
  return {
    type: PASSWORD_ENCRYPTED,
    trayId,
    password
  }
}

export const PASSWORD_ENCRYPT_ERROR = 'PASSWORD_ENCRYPT_ERROR'
export function passwordEncryptError(trayId, errors) {
  return {
    type: PASSWORD_ENCRYPT_ERROR,
    trayId,
    errors: Immutable.List(errors)
  }
}

export const REMOVE_TRAY = 'REMOVE_TRAY'
export function removeTray(trayId) {
  return {
    type: REMOVE_TRAY,
    trayId
  }
}

export const PROJECTS_FETCHING = 'PROJECTS_FETCHING'
export function projectsFetching(trayId) {
  return {
    type: PROJECTS_FETCHING,
    trayId
  }
}

export const PROJECTS_FETCHED = 'PROJECTS_FETCHED'
export function projectsFetched(trayId, projects) {
  return {
    type: PROJECTS_FETCHED,
    trayId,
    data: Immutable.fromJS(projects).map((project) => project.set('projectId', project.get('webUrl'))),
    timestamp: moment().format()
  }
}

export const PROJECTS_FETCH_ERROR = 'PROJECTS_FETCH_ERROR'
export function projectsFetchError(trayId, errors) {
  return {
    type: PROJECTS_FETCH_ERROR,
    trayId,
    errors: Immutable.List(errors)
  }
}

export const UPDATING_TRAY = 'UPDATING_TRAY'
export function updatingTray(trayId, name, url, username) {
  return {
    type: UPDATING_TRAY,
    trayId,
    data: Immutable.Map({
      trayId,
      name,
      url,
      username
    }),
    timestamp: moment().format()
  }
}

export function encryptPassword(trayId, password) {
  return function (dispatch) {
    dispatch(encryptingPassword(trayId, password))
    return encrypt(password)
      .then((encryptedPassword) => {
        dispatch(passwordEncrypted(trayId, encryptedPassword))
        return encryptedPassword
      }).catch((error) => dispatch(passwordEncryptError(trayId, [
        'Unable to encrypt password because of an error:',
        `${error.status} - ${error.message}`
      ])))
  }
}

export function addTray(enteredUrl, username, rawPassword) {
  return function (dispatch) {
    const trayId = uuid.v4()
    const url = hasScheme(enteredUrl) ? enteredUrl : 'http://' + enteredUrl

    dispatch(trayAdded(trayId, url, username))

    if (isNotBlank(rawPassword)) {
      return dispatch(encryptPassword(trayId, rawPassword))
        .then((encryptedPassword) => dispatch(refreshTray({trayId, url, username, password: encryptedPassword})))
    } else {
      return dispatch(refreshTray({trayId, url, username}))
    }
  }
}

export function updateTray(trayId, name, url, username, password, passwordUpdated) {
  return function (dispatch) {
    dispatch(updatingTray(trayId, name, url, username))

    if (passwordUpdated) {
      return dispatch(encryptPassword(trayId, password))
        .then((encryptedPassword) => dispatch(refreshTray({trayId, url, username, password: encryptedPassword})))
    } else {
      return dispatch(refreshTray({trayId, url, username, password}))
    }
  }
}

export function refreshTray(tray) {
  return function (dispatch) {
    const trayId = tray.trayId
    dispatch(projectsFetching(trayId))
    return fetchAll([tray])
      .then((json) => dispatch(projectsFetched(trayId, json)))
      .catch((error) => dispatch(projectsFetchError(trayId, [
        'Unable to fetch projects because of an error:',
        `${error.status} - ${error.message}`
      ])))
  }
}
