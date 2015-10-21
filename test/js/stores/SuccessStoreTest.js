jest.dontMock('../../../src/js/stores/SuccessStore')
  .dontMock('../../../src/js/constants/NevergreenConstants')

describe('success store', function () {

  var store, AppDispatcher, Constants, callback

  beforeEach(function () {
    AppDispatcher = require('../../../src/js/dispatcher/AppDispatcher')
    Constants = require('../../../src/js/constants/NevergreenConstants')
    store = require('../../../src/js/stores/SuccessStore')
    callback = AppDispatcher.register.mock.calls[0][0]
  })

  it('registers a callback with the dispatcher', function () {
    expect(AppDispatcher.register.mock.calls.length).toBe(1)
  })

  it('adds a message', function () {
    callback({
      type: Constants.MessageAdd,
      message: 'some-message'
    })
    expect(store.getMessages()).toEqual(['some-message'])
  })

  it('adds an image', function () {
    callback({
      type: Constants.MessageAdd,
      message: 'http://some-url'
    })
    expect(store.getImages()).toEqual(['http://some-url'])
  })

  it('removes a message', function () {
    callback({
      type: Constants.MessageAdd,
      message: 'some-message'
    })
    callback({
      type: Constants.MessageRemove,
      message: 'some-message'
    })
    expect(store.getMessages()).toEqual([])
  })

  it('removes an image', function () {
    callback({
      type: Constants.MessageAdd,
      message: 'http://some-url'
    })
    callback({
      type: Constants.MessageRemove,
      message: 'http://some-url'
    })
    expect(store.getImages()).toEqual([])
  })

  it('returns a blank random message if none have been added', function () {
    expect(store.randomMessage()).toEqual('')
  })

  it('returns a random message', function () {
    callback({
      type: Constants.MessageAdd,
      message: 'some-message'
    })
    callback({
      type: Constants.MessageAdd,
      message: 'http://some-url'
    })
    expect(store.randomMessage()).not.toEqual('')
  })

  it('can return just messages', function () {
    callback({
      type: Constants.MessageAdd,
      message: 'some-message'
    })
    callback({
      type: Constants.MessageAdd,
      message: 'http://some-url'
    })
    expect(store.getMessages()).toEqual(['some-message'])
  })

  it('can return just images', function () {
    callback({
      type: Constants.MessageAdd,
      message: 'some-message'
    })
    callback({
      type: Constants.MessageAdd,
      message: 'http://some-url'
    })
    expect(store.getImages()).toEqual(['http://some-url'])
  })

  it('can return all images and messages', function () {
    callback({
      type: Constants.MessageAdd,
      message: 'some-message'
    })
    callback({
      type: Constants.MessageAdd,
      message: 'http://some-url'
    })
    expect(store.getAll()).toEqual(['some-message', 'http://some-url'])
  })

  it('clears the store state when new data is imported', function () {
    callback({
      type: Constants.ImportedData
    })
    expect(store.getAll()).toEqual([])
  })

  describe('knows if a string is a url or not', function () {
    it('returns true for any string starting with http', function () {
      expect(store.isUrl('http')).toBeTruthy()
    })

    it('if returns false if the string does not start with http', function () {
      expect(store.isUrl('ftp')).toBeFalsy()
    })
  })

})