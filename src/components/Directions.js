import React, { PureComponent } from 'react'
import axios from 'axios'

export default class Directions extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      postcodeStart: null,
      postcodeFinish: null,
      errors: null,
      directions: null
    }
  }

  hook = () => {
    const long = this.props.showPopup.lon
    const lat = this.props.showPopup.lat
    axios.get(`http://api.postcodes.io/postcodes?lon=${long}&lat=${lat}`)
      .then(resp => this.setState({ postcodeFinish: resp.data.result[0].postcode }))
      .catch(() => this.setState({ err: 'Invalid Postcode' }))
  }

  handleChange(e) {
    const postcode = (e.target.value).replace(/\s/g, '')
    this.setState({
      postcodeStart: postcode,
      errors: ''
    })
    console.log(this.state.postcodeStart)
    console.log(this.state.postcodeFinish)
  }
  handleSubmit(e) {
    e.preventDefault()
    axios.get(`https://api.tfl.gov.uk/Journey/JourneyResults/${this.state.postcodeStart}/to/${this.state.postcodeFinish}?cyclePreference=AllTheWay&bikeProficiency=Easy`)
      .then(resp => {
        this.setState({
          directions: resp.data.journeys[0]
        })
      })
      .catch(() => this.setState({ errors: 'Invalid Postcode' }))

  }
  resetLocation() {
    this.setState({
      postcodeStart: null,
      errors: '',
      directions: null
    })
  }
  directions = () => {
    if (this.state.directions === null) {
      return (
        <section className="section">
          <div className="container">
            <div className="title">Where are you starting from?</div>
            <form className="form" onSubmit={(e) => this.handleSubmit(e)}>
              <div className="field">
                <label htmlFor="" className="label">Postcode</label>
                <div className="control">
                  <input
                    onChange={(e) => this.handleChange(e)}
                    type="text"
                    name="postcode"
                    className="postcode"
                  />
                </div>
              </div>
              {this.state.errors && <small className="help is-danger">
                {this.state.errors}
              </small>}
              <button className="button is-success">Search</button>
            </form>
          </div>
        </section>
      )
    } else {
      const data = this.state.directions.legs[0].instruction.steps
      return (
        <div>
          <button onClick={() => this.resetLocation()}>Change starting location</button>
          <table className="table table is-hoverable table is-fullwidth">
            <thead>
              <tr>
                <th>Direction</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((ele, i) => {
                return (
                  <tr key={i}>
                    <td>{ele.descriptionHeading}</td>
                    <td>{ele.description}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }
  }


  render() {
    if (this.props.showPopup === null) {
      this.setState({ errors: null })
      return <div>Click on a Pin for Directions</div>
    } else {
      this.hook()
      console.log(this.state.directions)
      return (
        <div>
          {this.directions()}
        </div>

      )
    }
  }
}