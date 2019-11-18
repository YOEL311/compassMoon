import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import openScreen from './openScreen'
import Compass from './Compass'

const MainNavigator = createStackNavigator({
    Home: {screen: openScreen,},
    Compass: {screen: Compass},
  },
  {
    initialRouteName: 'Home',
  }
);

const App = createAppContainer(MainNavigator);

export default App;
