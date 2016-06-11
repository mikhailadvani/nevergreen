jest.dontMock('../../../../src/js/common/gateways/ProjectsGateway')

describe('projects gateway', () => {

  let subject, gateway

  beforeEach(() => {
    subject = require('../../../../src/js/common/gateways/ProjectsGateway')
    gateway = require('../../../../src/js/common/gateways/Gateway')
  })

  describe('getting all projects', () => {
    it('has all data', () => {
      const trays = [{
        url: 'url',
        username: 'uname',
        password: 'pword',
        serverType: 'GO'
      }, {
        url: 'another-url',
        username: 'another-uname',
        password: 'another-pword',
        serverType: 'GO'
      }]

      subject.fetchAll(trays)

      expect(gateway.post).toBeCalledWith('/api/projects/all', trays)
    })
  })

  describe('getting interesting projects', () => {
    it('has all data', () => {
      const selected = {id: ['some-project-id']}
      const tray = {
        trayId: 'id',
        url: 'url',
        username: 'uname',
        password: 'pword',
        serverType: 'GO'
      }
      const trays = [tray]

      subject.interesting(trays, selected)

      const data = [{
        trayId: tray.trayId,
        url: tray.url,
        username: tray.username,
        password: tray.password,
        included: ['some-project-id'],
        serverType: tray.serverType
      }]

      expect(gateway.post).toBeCalledWith('/api/projects/interesting', data)
    })
  })
})