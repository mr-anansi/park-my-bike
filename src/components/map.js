import React from 'react'
import ReactMapGL, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl'
import axios from 'axios'



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
      showPopup: [],
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

  // bikedata.places[].lon / .lat
  loadBikeParks = () => {
    return this.state.bikedata.places.map((ele, i) => {
      return (
        <Marker
          key={i}
          latitude={ele.lat}
          longitude={ele.lon}
        >
          <p>Bike Park</p>
        </Marker>
      )
    })
  }


  render() {
    if (this.state.bikedata === null) return <div>loading</div>
    return (
      <div>
        <ReactMapGL
          {...this.state.viewport}
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          onViewportChange={(viewport) => this.setState({ viewport })}>
          <Marker
            latitude={51.464093}
            longitude={-0.12001}
          >
            Hello
          </Marker>
          {this.loadBikeParks()}
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            fitBoundsOptions={{ maxZoom: 14 }}
          />
        </ReactMapGL>
        <button onClick={() => this.hook()}>Refresh</button>
      </div>
    )
  }
}
export default Map1