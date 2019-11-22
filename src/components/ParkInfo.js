import React, { PureComponent } from 'react'

export default class ParkInfo extends PureComponent {
  render() {
    const { info } = this.props

    return (

      <div className="container" id="background-transparent">
        <p>Cycle Parking</p>
        <img width={140} src={info.additionalProperties[8].value} className="padd"/>
        <p>Distance is <span className="bold">{Math.round(info.distance)} m</span></p>
        <p>Total number of spaces <span className="bold">{info.additionalProperties[10].value}</span></p>
      </div>

    )
  }
}

