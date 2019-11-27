import {PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {model} from 'geomagnetism';
import AsyncStorage from '@react-native-community/async-storage';

export let _angle = magnetometer => {
  let angle = 0;
  if (magnetometer) {
    let {x, y} = magnetometer;
    if (Math.atan2(y, x) >= 0) {
      angle = Math.atan2(y, x) * (180 / Math.PI);
    } else {
      angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
    }
  }
  return Math.round(angle);
};
export let failCompass = () => {
  // information for "right now"
  let info = model().point([44.53461, -109.05572]);
  console.log('declination:', info.decl);
  return info.decl;
};

export async function requestLocationPermissionEndGetLocation() {
  try {
    console.log('rty');

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Example App',
        message: 'Example App access to your location ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          // console.log(position);
          const {latitude, longitude} = position.coords;
          // console.log(latitude, longitude);
          this.setState({latitude, longitude});

          let info = model().point([latitude, longitude]);
          // console.log('declination:', info.decl);
          this.setState({devi: info.decl});
          storeData(latitude, longitude, info.decl);
          console.log('return');

          return;
        },
        error => {
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: false,
          maximumAge: 100000000,
          timeout: 150000,
        },
      );
    } else {
    }
  } catch (err) {
    console.warn(err);
  }
}

const storeData = async (lat, long, dec) => {
  try {
    await AsyncStorage.setItem('@lat', lat.toString());
    await AsyncStorage.setItem('@long', long.toString());
    await AsyncStorage.setItem('@dec', dec.toString());
  } catch (e) {
    // saving error
    console.error(e);
  }
};
