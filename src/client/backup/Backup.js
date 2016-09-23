import React, {Component, PropTypes} from 'react'
import Import from './Import'
import Export from './Export'
import './backup.scss'

class Backup extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const importProps = {
      errors: this.props.errors,
      infos: this.props.infos,
      loaded: this.props.loaded,
      importData: this.props.importData
    }
    const exportProps = {
      configuration: this.props.configuration
    }

    return (
      <section className='backup'>
        <h2 className='visually-hidden'>Export</h2>
        <Import {...importProps}/>
        <Export {...exportProps}/>
      </section>
    )
  }
}

Backup.propTypes = {
  configuration: PropTypes.string.isRequired,
  loaded: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  infos: PropTypes.arrayOf(PropTypes.string),
  importData: PropTypes.func.isRequired
}

export default Backup
