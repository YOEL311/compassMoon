import React, {Component} from 'react';
import {
  View,
  Text,
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
import {_angle} from '../logic/logicCompass';

const {height, width} = Dimensions.get('window');

export default class Compass extends Component {
  constructor() {
    super();
    this.state = {
      magnetometer: '0',
      altitude: 0,
      delta: 0,
      direction_up_down: ' ',
      direction_up_down_color: 'red',
      scoreEnd: 0,
    };
    this.magnetometer = 0;
    this.altitude = 0;
    this.moonAz = 20; //TODO
    this.moonAl = 5; //TODO
  }

  // ✓✔

  // static navigationOptions = {
  //   title: 'Compass',
  //   headerStyle: {
  //     backgroundColor: '#f4511e',
  //   },
  // };

  componentDidMount() {
    this._toggle();
    // this.moonAz = this.props.navigation.getParam('moon_az', 'NO-ID');
    // this.moonAl = this.props.navigation.getParam('moon_al', 'NO-ID');

    // this._unsubscribe();
    // this._unsubscribeAcc();
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
      sensorData => {
        this.magnetometer = _angle(sensorData);
        this.setState({magnetometer: this.magnetometer});
        this.calculation();
      },
      error => console.log('The sensor is not available'),
    );
  };

  _subscribeAcc = async () => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    this._subscriptionAcc = accelerometer.subscribe(({x, y, z, timestamp}) => {
      this.altitude = y.toFixed(4);
      this.calculation();
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

  calculation = () => {
    let deltaAl = Math.abs(this.moonAl - this.altitude);
    this.setArrowUpDown(deltaAl);
    //delta azimuth
    let deltaAz = Math.abs(this.moonAz - this.magnetometer);
    deltaAz = deltaAz < 180 ? deltaAz : 360 - deltaAz;
    //calculate score end
    let scoreEnd = 100 - (deltaAz / 3.6 + deltaAl * 5);
    // console.log('score end', scoreEnd);
    // console.log('delta al', deltaAl);
    // console.log('delta az', deltaAz);
    // console.log(scoreEnd);
    this.setState({scoreEnd});
    if (scoreEnd > 95) {
      // console.log('===');
      this.setState({
        direction_up_down: '✔',
        direction_up_down_color: 'green',
      });
    }
  };

  setArrowUpDown(deltaAz) {
    if (this.moonAl < this.altitude) {
      // console.log('<');

      this.setState({
        direction_up_down: '▼',
        direction_up_down_color: 'red',
      });
    } else if (this.moonAl > this.altitude) {
      this.setState({
        direction_up_down: '▲',
        direction_up_down_color: 'red',
      });
    }
    // this.setState({
    //   altitude: this.altitude,
    //   delta: deltaAz,
    // });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          alignItems: 'center',
        }}>
        <Text style={{color: this.state.direction_up_down_color, fontSize: 90}}>
          {this.state.direction_up_down}
        </Text>
        {/*<Text style={{color: 'green', fontSize: 30}}>{this.state.scoreEnd}</Text>*/}
        {/*<Text style={{color: 'red', fontSize: 30}}>{this.state.altitude}</Text>*/}
        <View style={[styles.container]}>
          <ImageBackground
            source={require('../../assets/aroow_vertical.png')}
            imageStyle={styles.imageStyle}
            style={[styles.imageBackground]}>
            <Image
              source={require('../../assets/arrow.png')}
              style={[
                styles.image,
                {
                  transform: [
                    {
                      rotate:
                        360 - this.state.magnetometer + this.moonAz + 'deg',
                    },
                  ],
                },
              ]}
            />
          </ImageBackground>
          <ProgressBar
            style={{alignSelf: 'center'}}
            pr={this.state.scoreEnd + 2}
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
    overflow: 'visible',
    height: '100%',
    width: '100%',
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
