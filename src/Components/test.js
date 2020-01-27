import React, {Component} from 'react';
import {View, Button, Animated} from 'react-native';

class Test extends Component {
  state = {
    movementAnimation: new Animated.ValueXY({x: 0, y: 100}),
  };

  animateMove = () => {
    Animated.timing(this.state.movementAnimation, {
      toValue: {x: 0, y: 2},
      duration: 500,
    }).start();
  };

  render() {
    const interpolateMovement = this.state.movementAnimation.y.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ['100', '50', '100'],
    });

    return (
      <View>
        <Animated.View
          style={[this.state.movementAnimation.getLayout(), {width: '100%'}]}>
          <Button title={'GO!!!!!'} onPress={this.animateMove} />
        </Animated.View>
      </View>
    );
  }
}

export default Test;
