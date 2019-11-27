/**
 * @format
 */

import {AppRegistry} from 'react-native';
import openScreen from './src/Components/openScreen.js';
import Compass from './src/Components/Compass.js';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Compass);
