import React, {Component} from 'react'
import {View, Text, Button} from 'react-native'
import {requestLocationPermissionEndGetLocation} from '../logic/logicCompass'
import AsyncStorage from '@react-native-community/async-storage';


export default class openScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      devi: 0
    }
    this.getLocation = this.getLocation.bind(this)
  }

  static navigationOptions = {
    title: 'open Screen',
  }

  getData = async () => {
    try {
      const latitude = await AsyncStorage.getItem('@lat')
      const longitude = await AsyncStorage.getItem('@long')
      const devi = await AsyncStorage.getItem('@dec')

      latitude && this.setState({latitude})
      longitude && this.setState({longitude})
      devi && this.setState({devi})

    } catch (e) {
      console.error(e);
    }
  }

  componentDidMount(): void {
    this.getData()
  }

  async getLocation() {
    console.log("get location");
    await requestLocationPermissionEndGetLocation.call(this)
  }


  render() {
    return (<View>
        <Text>
          hello navigator
        </Text>
        <Button title={'get location'}
                onPress={this.getLocation}/>
        <Button
          title="Go to Compass"
          onPress={() => this.props.navigation.navigate('Compass', {
            // moon: this.state.,
            devi: 34
          })}
        />
        <Text>
          Your Location : {this.state.latitude + '  -  ' + this.state.longitude}
          {"\n"}
          deviationCompass : {this.state.devi}
        </Text>
      </View>
    )

  }
}
