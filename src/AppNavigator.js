import {createStackNavigator} from 'react-navigation';
import openScreen from './Components/openScreen';

const AppNavigator = createStackNavigator({
  OpenScreen: {screen: openScreen},
});

export default AppNavigator;
