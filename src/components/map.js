import React from 'react'
import ReactMapGL, { Marker, Popup, GeolocateControl } from 'react-map-gl'
import axios from 'axios'

import Pin from './Pin'
import ParkInfo from './ParkInfo'
import Directions from './Directions'

const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 10
}

class Map1 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        // width: 400,
        // height: 400,
        latitude: null,
        longitude: null,
        zoom: 15,
        mapboxApiAccessToken: process.env.MAPBOX_KEY
      },
      showPopup: null,
      bikedata: null

    }
  }

  hook = () => {
    const lat = this.state.viewport.latitude
    const long = this.state.viewport.longitude
    axios.get(`https://api.tfl.gov.uk/Place?radius=250&type=CyclePark&placeGeo.lat=${lat}&placeGeo.lon=${long}`)
      .then(resp => this.setState({ bikedata: resp.data }))
      .catch(err => this.setState({ err: err.response.status }))
  }

  componentDidMount() {
    this.setState({
      viewport: {
        // width: 400,
        // height: 400,
        latitude: parseFloat(this.props.match.params.latitude),
        longitude: parseFloat(this.props.match.params.longitude),
        zoom: 15,
        mapboxApiAccessToken: process.env.MAPBOX_KEY
      }
    })
    setTimeout(() => {
      this.hook()
    }, 300)
  }

  loadBikeParks = () => {
    return this.state.bikedata.places.map((ele, i) => {
      return (
        <Marker
          key={i}
          latitude={ele.lat}
          longitude={ele.lon}
        >
          <Pin size={20} onClick={() => this.setState({ showPopup: ele })} />
        </Marker>
      )
    })
  }

  loadBikePopup = () => {
    const { showPopup } = this.state

    return (
      showPopup && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={showPopup.lon}
          latitude={showPopup.lat}
          closeOnClick={false}
          onClose={() => this.setState({ showPopup: null })}
        >
          <ParkInfo info={showPopup} />
        </Popup>
      )
    )
  }


  render() {
    if (this.state.bikedata === null) return <div>loading</div>
    return (
      <section className="section">
        <div className="container">
          <div className="title">Find your nearest cycle park</div>
          <div className="columns">
            <div className="column">
              <div id="center2">
                <div id="center">

                  <ReactMapGL
                    {...this.state.viewport}
                    width="310px" // It always override the view(viewport) width state.
                    height="310px"
                    id="center2"
                    mapStyle="mapbox://styles/mapbox/outdoors-v11"
                    onViewportChange={(viewport) => this.setState({ viewport })}>
                    {this.loadBikeParks()}
                    {this.loadBikePopup()}
                    <GeolocateControl
                      positionOptions={{ enableHighAccuracy: true }}
                      trackUserLocation={true}
                      style={geolocateStyle}
                    />
                  </ReactMapGL>

                </div>
              </div>
              <div className="button-center">
                <button className="button" id="button1" onClick={() => this.hook()}>Find more locations 🚲</button>
              </div>
            </div>
            <div className="column">
              <Directions showPopup={this.state.showPopup} />
            </div>
          </div>
        </div>
      </section>
    )
  }
}
export default Map1