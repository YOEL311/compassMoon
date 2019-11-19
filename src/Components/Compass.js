import React, {Component} from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  Image,
  Dimensions,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {
  accelerometer,
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import ProgressBar from './progressBar';
import {
  _angle,
  requestLocationPermissionEndGetLocation,
} from '../logic/logicCompass';

const {height, width} = Dimensions.get('window');

export default class Compass extends Component {
  constructor() {
    super();
    // requestLocationPermissionEndGetLocation()
    this.state = {
      magnetometer: '0',
      altitude: 0,
      moonAz: 20,
      moonAl: 20,
      direction_up_down: ' ',
      // direction_up_down: '▼',
      direction_up_down_color: 'red',
    };
  }

  static navigationOptions = {
    title: 'Compass',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
  };

  componentDidMount() {
    this._toggle();

    // this.moonAz = this.props.navigation.getParam('moon_az', 'NO-ID');
    // this.moonAl = this.props.navigation.getParam('moon_al', 'NO-ID');

    console.log('param', this.moonAz);
    console.log('param');
  }

  componentWillUnmount() {
    this._unsubscribe();
    this._unsubscribeAcc();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }

    if (this._subscriptionAcc) {
      this._unsubscribeAcc();
    } else {
      this._subscribeAcc();
    }
  };

  _subscribe = async () => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 100);
    this._subscription = magnetometer.subscribe(
      sensorData => this.setState({magnetometer: _angle(sensorData)}),
      error => console.log('The sensor is not available'),
    );
  };

  _subscribeAcc = async () => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    this._subscriptionAcc = accelerometer.subscribe(({x, y, z, timestamp}) => {
      console.log({x, y, z, timestamp});
      this.setState({altitude: y.toFixed(4)});
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.unsubscribe();
    this._subscription = null;
  };

  _unsubscribeAcc = () => {
    this._subscriptionAcc && this._subscriptionAcc.unsubscribe();
    this._subscriptionAcc = null;
  };

  calculet() {}

  render() {
    console.log(this.state.altitude);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          alignItems: 'center',
          // direction: 'row',
        }}>
        <Text style={{color: this.state.direction_up_down_color, fontSize: 90}}>
          {this.state.direction_up_down}
        </Text>
        {/*<Text style={{color: 'green', fontSize: 90}}> ✓</Text>*/}
        {/*<Text style={{color: 'green', fontSize: 90}}>✔</Text>*/}
        <Text style={{color: 'red', fontSize: 30}}>{this.state.altitude}</Text>
        <View style={[styles.container]}>
          <ImageBackground
            source={require('../../assets/aroow_vertical.png')}
            imageStyle={styles.imageStyle}
            style={[styles.imageBackground]}>
            <Animated.Image
              source={require('../../assets/arrow.png')}
              style={[
                styles.image,
                {
                  transform: [
                    {
                      rotate:
                        360 -
                        this.state.magnetometer +
                        this.state.moonAz +
                        'deg',
                    },
                  ],
                },
              ]}
            />
          </ImageBackground>
          <ProgressBar
            style={{alignSelf: 'center'}}
            pr={this.state.altitude * 10}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    resizeMode: 'contain',
    overflow: 'visible',
  },
  imageBackground: {
    flex: 4,
    borderRadius: 360,
    // backgroundColor: 'black',
    overflow: 'visible',
    height: '100%',
    width: '100%',
    // alignItems: "center",
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  image: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: height / 4,
    resizeMode: 'contain',
  },
});
