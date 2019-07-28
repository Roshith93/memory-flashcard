import React, {Component} from "react";
import { Provider } from "react-redux";
import { View } from "react-native";

import { setLocalNotification } from "./utils/helpers";
import { darkBlue } from "./utils/colors";
import { createStore, applyMiddleware, compose } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import reducer from "./reducers";
import MainNavigator from "./components/Navigation";
import CardStatusBar from "./components/StatusBar";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk, logger))
);

class App extends Component {
  componentDidMount() {
    setLocalNotification();
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <MainNavigator />
          <CardStatusBar
            backgroundColor={darkBlue}
            barStyle="light-content"
          />
        </View>
      </Provider>
    );
  }
}

export default App;