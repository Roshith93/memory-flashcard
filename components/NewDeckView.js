import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { addDeck } from '../actions';
import { btnWidth, inputWidth } from '../utils/helpers';
import { red, darkBlue } from '../utils/colors';

class NewDeckView extends Component {
  state = {
    text: '',
    errorMessage: '',
    color: darkBlue
  };

  onInputChange = text =>
    this.setState({ text, errorMessage: '', color: darkBlue });

  handleSubmit = () => {
    if (this.state.text !== '') {
      const newDeck = {
        [this.state.text]: { title: this.state.text, questions: [] },
      };
      this.props.addDeck(newDeck);
      console.log(newDeck[this.state.text]);
      this.props.navigation.navigate('DeckView', {
        deck: newDeck[this.state.text],
      });
      this.setState({
        text: '',
      });
    } else {
      this.setState({
        errorMessage: 'Please fill in a title for your deck',
        color: red,
        fontWeight: 'bold'
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={this.state.text}
          placeholder="Create Deck"
          onChangeText={this.onInputChange}
          underlineColorAndroid={this.state.color}
        />
        <View>
          <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
        </View>
        <TouchableOpacity
          onPress={() => this.handleSubmit()}
          style={styles.btn}>
          <Text style={styles.btnText}>Add Deck</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop:25
  },
  btn: {
    padding: 10,
    borderRadius: 1,
    borderWidth: 2,
    borderColor: darkBlue,
    width: btnWidth,
    marginTop: 20,
  },
  btnText: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  input: {
    width: inputWidth,
    fontSize: 15,
    padding: 10,
  
  },
  errorMessage: {
    color: red,
    textAlign: 'center',
  },
});

export default connect(null,{ addDeck })(NewDeckView);
