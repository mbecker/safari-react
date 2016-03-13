import React from 'react'

const ParkPage = React.createClass({
  render() {
        return (
            <div className="park">
              <h3>Park: { this.props.params.park }</h3>
            </div>
        )
    }
})

export default ParkPage

