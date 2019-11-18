/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Compass from './src/Components/Compass.js';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Compass);
