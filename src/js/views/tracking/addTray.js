const React = require('react')
const LinkedStateMixin = require('react-addons-linked-state-mixin')
const ValidationMessages = require('../general/validationMessages')

module.exports = React.createClass({
  mixins: [LinkedStateMixin],

  propTypes: {
    addTray: React.PropTypes.func.isRequired,
    validationMessages: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getInitialState() {
    return {
      url: '',
      username: '',
      password: ''
    }
  },

  render() {
    return (
      <div className='tracking-cctray-group-cctray-form'>
        <label htmlFor='cctray-url' className='tracking-cctray-group-cctray-form-label'>url</label>
        <input ref='urlInput'
               id='cctray-url'
               className='tracking-cctray-group-cctray-form-input'
               type='text'
               placeholder='e.g. http(s)://host:port/cc.xml'
               valueLink={this.linkState('url')}
               onKeyPress={this._onKeyPress}/>
        <button ref='addButton' id='cctray-fetch' className='button-primary' onClick={this._onClick}>add</button>
        <div>
          <div id='authentication-group' className='tracking-cctray-group-authentication'>
            <label htmlFor='username'>username</label>
            <input ref='usernameInput'
                   id='username'
                   className='tracking-cctray-group-cctray-form-input-authentication tracking-cctray-group-cctray-form-input'
                   type='text'
                   valueLink={this.linkState('username')}
                   onKeyPress={this._onKeyPress}/>
            <label htmlFor='password'>password</label>
            <input ref='passwordInput'
                   id='password'
                   className='tracking-cctray-group-cctray-form-input-authentication tracking-cctray-group-cctray-form-input'
                   type='password'
                   valueLink={this.linkState('password')}
                   onKeyPress={this._onKeyPress}/>
          </div>
        </div>
        <ValidationMessages messages={this.props.validationMessages}/>
      </div>
    )
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.validationMessages) {
      this.setState({
        url: '',
        username: '',
        password: ''
      })
    }
  },

  _onClick() {
    this.props.addTray(this.state)
  },

  _onKeyPress(evt) {
    if (evt.key === 'Enter') {
      this.props.addTray(this.state)
    }
  }
})
