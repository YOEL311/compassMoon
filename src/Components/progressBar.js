import React, {Component} from 'react';
import {StyleSheet, Text, View, ImageBackground} from 'react-native';

export default class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressStatus: 0,
      height: 7,
      colorBar: 'green',
      pr: this.props.pr,
    };
    this.color = 'green';
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.pr !== prevState.height) {
      return {pr: nextProps.pr};
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.pr !== prevProps.pr) {
      this.renderColorBar(prevProps.pr);
    }
  }

  hsl_col_perc(percent, start = 0, end = 120) {
    let a = percent / 100,
      b = (end - start) * a,
      c = b + start;
    let result = 'hsl(' + c + ', 100%, 50%)';
    return result;
  }

  renderColorBar(value) {
    this.color = this.hsl_col_perc(parseInt(value));
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/progress_bar2.png')}
          imageStyle={styles.imageStyle}
          style={styles.imageBackgroundStyle}>
          <View
            style={[
              styles.inner,
              {
                backgroundColor: this.color,
                height: parseInt(this.state.pr) + '%',
              },
            ]}
          />
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  imageStyle: {
    resizeMode: 'contain',
    overflow: 'visible',
  },
  imageBackgroundStyle: {
    flex: 1,
    borderRadius: 360,
    overflow: 'visible',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    resizeMode: 'contain',
    justifyContent: 'flex-end',
  },
  container: {
    width: 100,
    height: 400,
    padding: 0,
    // marginTop: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  inner: {
    width: '70%',
    opacity: 0.6,
    height: '30%',
    borderRadius: 15,
    backgroundColor: 'red',
  },
});
