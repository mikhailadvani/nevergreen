import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {enableFullScreen, initalise} from './actions/NevergreenActionCreators'
import {checkForNewVersion, dismiss} from './actions/NotificationActionCreators'
import {keyboardShortcut} from './actions/ShortcutActionCreators'
import Nevergreen from './Nevergreen'
import Package from '../../package'
import {withRouter} from 'react-router-dom'

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    initalise,
    checkForNewVersion,
    dismiss,
    keyboardShortcut,
    enableFullScreen
  }, dispatch)
}

function mapStateToProps(store) {
  return {
    loaded: store.getIn(['nevergreen', 'loaded']),
    versionNumber: `${Package.version}+${Package.versionMeta}`,
    versionName: Package.versionName,
    versionColour: Package.versionColour,
    commitHash: Package.commitHash,
    notification: store.get('notification'),
    isFullScreen: store.getIn(['nevergreen', 'fullScreen']),
    fullScreenRequested: store.getIn(['nevergreen', 'fullScreenRequested'])
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nevergreen))
