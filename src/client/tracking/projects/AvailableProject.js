import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Checkbox from '../../common/forms/Checkbox'
import styles from './available-project.scss'

class AvailableProject extends Component {
  render() {
    const listClasses = classNames(styles.availableProject, {[styles.removedProject]: this.props.removed})
    let info = null

    if (this.props.isNew) {
      info = <span className={styles.infoNew} data-locator='new'>new</span>
    } else if (this.props.removed) {
      info = <span className={styles.infoRemoved} data-locator='removed'>removed</span>
    }

    const displayName = this.props.stage ? `${this.props.name} ${this.props.stage}` : this.props.name

    return (
      <li className={listClasses}>
        <Checkbox checked={this.props.selected} onToggle={this.props.selectProject} disabled={this.props.removed}>
          {info}
          <span className={styles.name} data-locator='name'>{displayName}</span>
        </Checkbox>
      </li>
    )
  }
}

AvailableProject.propTypes = {
  name: PropTypes.string.isRequired,
  stage: PropTypes.string,
  isNew: PropTypes.bool,
  removed: PropTypes.bool,
  selected: PropTypes.bool,
  selectProject: PropTypes.func.isRequired
}

export default AvailableProject
