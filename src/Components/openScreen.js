import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import {requestLocationPermissionEndGetLocation} from '../logic/logicCompass';
import AsyncStorage from '@react-native-community/async-storage';
import {model} from 'geomagnetism';

export default class openScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      devi: 0,
      moonAz: 0,
      moonAl: 0,
      decl: 0,
    };
  }

  static navigationOptions = {
    title: 'open Screen',
  };

  getData = async () => {
    try {
      const latitude = await AsyncStorage.getItem('@lat');
      const longitude = await AsyncStorage.getItem('@long');
      const devi = await AsyncStorage.getItem('@dec');

      latitude && this.setState({latitude});
      longitude && this.setState({longitude});
      devi && this.setState({devi});
    } catch (e) {
      console.error(e);
    }
  };

  whereMoon() {
    console.log('where moon');

    const {latitude, longitude} = this.state;
    if (latitude === 0 || longitude === 0) {
      return;
    }

    const SunCalc = require('suncalc');

    const result = SunCalc.getMoonPosition(Date.now(), latitude, longitude);
    this.setState({
      moonAz: (result.azimuth * 180) / Math.PI,
      moonAl: result.altitude,
    });

    // console.log(this.state.moonAl);
    // console.log(result.altitude);
    // console.log((result.altitude * 180) / Math.PI);
    // console.log((result.azimuth * 180) / Math.PI);
    // console.log(result);
    // information for "right now"

    let info = model().point([latitude, longitude]);
    console.log('declination:', info.decl);
    this.setState({decl: info.decl});
  }

  async componentDidMount(): void {
    await this.getData();
    this.whereMoon();
  }

  getLocation = async () => {
    console.log('get location');
    await requestLocationPermissionEndGetLocation.call(this);
    console.log('get location end');
    this.whereMoon();
  };

  render() {
    return (
      <View>
        <Text>hello navigator</Text>
        <Button title={'get location'} onPress={this.getLocation} />
        <Button
          title="Go to Compass"
          onPress={() =>
            this.props.navigation.navigate('Compass', {
              // moon: this.state.,
              devi: 34,
            })
          }
        />
        <Text>
          Your Location : {this.state.latitude + '  -  ' + this.state.longitude}
          {'\n'}
          deviationCompass : {this.state.decl}
          {'\n'}
          moon Azimuth :{this.state.moonAz}
          {'\n'}
          moon altitude :{this.state.moonAl}
          {'\n'}
        </Text>
      </View>
    );
  }
}
