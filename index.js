/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import AppNavigation from '@navigation/AppNavigation';
import {Provider} from 'react-redux';
import store from './app/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  </SafeAreaProvider>
);

AppRegistry.registerComponent(appName, () => App);
