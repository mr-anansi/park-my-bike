import React, { PureComponent } from 'react'
import axios from 'axios'


export default class Directions extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      postcodeStart: null,
      postcodeFinish: null,
      errors: null,
      directions: null,
      savedPostcodeStart: null
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

  }
  hooktfl = () => {
    axios.get(`https://api.tfl.gov.uk/Journey/JourneyResults/${this.state.savedPostcodeStart}/to/${this.state.postcodeFinish}?cyclePreference=AllTheWay&bikeProficiency=Easy`)
      .then(resp => {
        this.setState({
          directions: resp.data.journeys[0]

        })
      })
      .catch(() => this.setState({
        errors: 'Invalid Postcode',
        savedPostcodeStart: null
      }))
  }
  handleSubmit(e) {
    e.preventDefault()
    this.setState({
      savedPostcodeStart: this.state.postcodeStart
    })
    if (this.state.savedPostcodeStart === null) {
      setTimeout(() => {
        this.hooktfl()
      }, 300)
      return
    }
    this.hooktfl()

  }
  resetLocation() {
    this.setState({
      postcodeStart: null,
      errors: '',
      directions: null,
      savedPostcodeStart: null
    })
  }
  directions = () => {
    if (this.state.savedPostcodeStart === null) {
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
    } else if (this.state.directions === null) {
      this.hooktfl()
      return
    } else {
      const data = this.state.directions.legs[0].instruction.steps
      return (
        <section className="section">
          <div className="container">
            <button className="button" onClick={() => this.resetLocation()}>Change starting location</button>
            <table className="table table is-hoverable table">
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
        </section>
      )
    }
  }


  render() {
    if (this.props.showPopup === null) {
      this.setState({
        errors: '',
        directions: null,
        postcodeStart: null
      })
      return <div>Click on a Pin for Directions</div>
    } else {
      this.hook()
      return (
        <div>
          {this.directions()}
        </div>

      )
    }
  }
}