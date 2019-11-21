import React from 'react'
import axios from 'axios'



class Input extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      postcode: null,
      errors: '',
      export: {
        longitude: null,
        latitude: null
      }
    }
  }

  handleChange(e) {
    const postcode = (e.target.value).replace(/\s/g, '')
    this.setState({
      postcode: postcode,
      errors: ''
    })
    console.log(this.state.postcode)
  }

  handleSubmit(e) {
    e.preventDefault()
    axios.get(`http://api.postcodes.io/postcodes/${this.state.postcode}`)
      .then(resp => {
        console.log(resp)
        this.setState({
          export: {
            longitude: resp.data.result.longitude,
            latitude: resp.data.result.latitude
          }
        })
        this.props.history.push(`/map/${this.state.export.latitude}/${this.state.export.longitude}`)
      })
      .catch(() => this.setState({ errors: 'Invalid Postcode' }))

  }


  render() {
    console.log(this.state.export)
    return (
      <section className="section">
        <div className="container">
          <div className="title">Submit Destiation Postcode</div>
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
  }
}
export default Input



