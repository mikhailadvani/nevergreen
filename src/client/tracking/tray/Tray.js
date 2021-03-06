import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Container from '../../common/container/Container'
import AvailableProjectsContainer from '../projects/AvailableProjectsContainer'
import TraySettingsContainer from '../settings/TraySettingsContainer'
import Loading from '../../common/loading/Loading'
import Tabs from '../../common/tabs/Tabs'

class Tray extends Component {
  constructor(props) {
    super(props)
    this.state = {hidden: false}
  }

  render() {
    const title = this.props.name || this.props.url
    const subTitle = this.props.name ? this.props.url : ''

    return (
      <Container title={title} subTitle={subTitle} highlight={this.props.highlight}>
        <div data-locator='tray'>
          <Tabs titles={['projects', 'settings']}>
            <Loading loaded={this.props.loaded}>
              <AvailableProjectsContainer trayId={this.props.trayId} index={this.props.index}/>
            </Loading>
            <TraySettingsContainer trayId={this.props.trayId}/>
          </Tabs>
        </div>
      </Container>
    )
  }
}

Tray.propTypes = {
  trayId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  loaded: PropTypes.bool,
  name: PropTypes.string,
  url: PropTypes.string.isRequired,
  highlight: PropTypes.bool
}

export default Tray
