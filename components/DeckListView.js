import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { fetchDecks } from "../actions";
import { white, darkBlue, cardBlue} from "../utils/colors";
import {  btnWidth } from "../utils/helpers";

class DeckListView extends React.Component {
  componentDidMount() {
    //clearAll();
    this.props.fetchDecks();
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={styles.shadow}
          onPress={() =>
            this.props.navigation.navigate("DeckView", {
              deck: item
            })
          }
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.cardCount}>{`${
            item.questions.length
          } cards`}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.decks &&
          Object.keys(this.props.decks).length === 0 && (
            <View>
              <Text style={styles.deckTitle}>
                No Decks available, please add a deck!
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("NewDeckView")}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Add Deck</Text>
              </TouchableOpacity>
            </View>
          )}

        <FlatList
          data={this.props.decks && Object.values(this.props.decks)}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.title}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  decks: state
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop:50,
  },
  deckTitle: {
    marginTop:150,
    textAlign: "center",
    width:btnWidth,
    fontWeight:"bold",
    fontSize:20
  },
  title: {
    textAlign: "center",
    width:btnWidth,
    fontWeight:"bold",
    fontSize:20
  },
  cardCount: {
    color: white,
    textAlign: "center",
    marginBottom: 15,
    fontSize:15

  },
  btn: {
    padding: 10,
    borderRadius: 1,
    borderWidth: 2,
    borderColor: darkBlue,
    width: btnWidth,
    marginBottom: 8,
    marginTop: 30
  },
  btnText: {
    textAlign: "center",
    width:btnWidth,
    fontWeight:"bold"

  },
  shadow: {
    borderColor: darkBlue,
    borderWidth: 2,
    borderRadius: 5,
    elevation: 2,
    width:btnWidth,
    justifyContent: "center",
    alignItems: "center",
    padding:15,
    marginBottom: 10,
    backgroundColor: cardBlue,
    shadowColor: "black",
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.8,
  }
});

export default connect(mapStateToProps, { fetchDecks })(DeckListView);