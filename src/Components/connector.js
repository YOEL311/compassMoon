import React, {Component} from 'react';
import {View} from 'react-native'
import Compass from './Compass'
import ProgressBar from './progressBar'

export default class connector extends Component {
  constructor() {
    super()

    // this.state({
    //   compass: 0,
    //   progress: 0
    // })
  }

  render() {
    return (
      <View>
        <Compass/>
        {/*<ProgressBar/>*/}
      </View>
    )
  }
}
