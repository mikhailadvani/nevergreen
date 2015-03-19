var $ = require('jquery')
var React = require('react')
var ProjectsView = require('./projects')
var Success = require('./success')
var Error = require('../general/error')
var LoadingView = require('../general/loading')
var projectsService = require('../../services/projects')
var successRepository = require('../../storage/successRepository')

var MonitorSection = React.createClass({
    getDefaultProps: function() {
        return {
            pollingInterval: 5000
        }
    },

    propTypes: {
        pollingInterval: React.PropTypes.number
    },

    getInitialState: function () {
        return {
            loaded: false,
            error: false,
            projects: []
        }
    },

    render: function () {
        var content
        if (!this.state.loaded) {
            content = <LoadingView.Bars />
        } else if (this.state.error) {
            content = <Error.SimpleMessage status={this.state.error.status} reason={this.state.error.statusText} />
        } else if (this.hasProjects()) {
            content = <ProjectsView.InterestingProjects projects={this.state.projects} />
        } else {
            var message = successRepository.randomSuccessMessage()
            if (message.isUrl) {
                content = <Success.Image url={message.value} />
            } else {
                content = <Success.Message message={message.value} />
            }
        }

        return (
            <div className='monitor'>{content}</div>
        )
    },

    componentWillMount: function () {
        projectsService.fetchInteresting(this.updateProjects, this.updateFailed)
    },

    componentDidMount: function () {
        var timer = setInterval(function () {
            projectsService.fetchInteresting(this.updateProjects, this.updateFailed)
        }.bind(this), this.props.pollingInterval)

        this.setState({timer: timer})
    },

    componentWillUnmount: function () {
        clearInterval(this.state.timer)
    },

    updateProjects: function (data) {
        if (this.isMounted()) {
            this.setState({
                loaded: true,
                error: false,
                projects: data
            })
        }
    },

    updateFailed: function (data) {
        if (this.isMounted()) {
            this.setState({
                loaded: true,
                error: data
            })
        }
    },

    hasProjects: function () {
        return this.state.projects.length > 0
    }
})

module.exports = {
    render: function (pollingInterval) {
        React.render(<MonitorSection pollingInterval={pollingInterval} />, $('#content')[0])
    }
}
