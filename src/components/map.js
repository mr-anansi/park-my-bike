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
        width: 400,
        height: 400,
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
        width: 400,
        height: 400,
        latitude: parseFloat(this.props.match.params.latitude),
        longitude: parseFloat(this.props.match.params.longitude),
        zoom: 15,
        mapboxApiAccessToken: process.env.MAPBOX_KEY
      }
    })
    setTimeout(() => {
      this.hook()
    }, 500)
  }

  loadBikeParks = () => {
    return this.state.bikedata.places.map((ele, i) => {
      return (
        <Marker
          key={i}
          latitude={ele.lat}
          longitude={ele.lon}
        >
          <Pin size={20} onClick={() => this.setState({ showPopup: ele })}/>
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
          <ParkInfo info={ showPopup } />
        </Popup>
      )
    )
  }


  render() {
    if (this.state.bikedata === null) return <div>loading</div>
    return (
      <div>
        <ReactMapGL
          {...this.state.viewport}
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          onViewportChange={(viewport) => this.setState({ viewport })}>
          {this.loadBikeParks()}
          {this.loadBikePopup()}
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            style={ geolocateStyle }
          />
        </ReactMapGL>
        <button onClick={() => this.hook()}>Refresh</button>
        <Directions showPopup={ this.state.showPopup } />
      </div>
    )
  }
}
export default Map1