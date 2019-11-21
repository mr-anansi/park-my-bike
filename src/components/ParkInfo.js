import React, { PureComponent } from 'react'

export default class ParkInfo extends PureComponent {
  render() {
    const { info } = this.props

    return (
      <div>
        <div>
          <p>Cycle Parking</p>
          <img width={180} src={info.additionalProperties[8].value} />
          <p>Distance is {Math.round(info.distance)} m</p>
          <p>Total number of spaces {info.additionalProperties[10].value}</p>
        </div>
        
      </div>
    )
  }
}

