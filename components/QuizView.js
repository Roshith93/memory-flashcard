import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated
} from "react-native";
import {  AntDesign } from "@expo/vector-icons";
import {
  setLocalNotification,
  clearLocalNotifications,
  btnWidth
} from "../utils/helpers";
import { darkBlue, white, red, green } from "../utils/colors";

class QuizView extends Component {
  state = {
    selectedQuestion: 0,
    showAnswer: false,
    correctAnswers: 0
  };

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ["0deg", "180deg"]
    });
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ["180deg", "360deg"]
    });
    this.frontOpacity = this.animatedValue.interpolate({
      inputRange: [89, 90],
      outputRange: [1, 0]
    });
    this.backOpacity = this.animatedValue.interpolate({
      inputRange: [89, 90],
      outputRange: [0, 1]
    });
  }

  componentWillUnmount() {
    this.animatedValue.removeAllListeners();
  }

  handleClick = () => {
    this.setState({ showAnswer: !this.state.showAnswer });
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true
      }).start();
    }
  };

  //No of the number of correct answer given
  correctAnswers = () => {
    this.setState({
      correctAnswers: this.state.correctAnswers + 1
    });
    this.nextQuestion();
  };

  //Keeps tracks of which question should be displayed next
  nextQuestion = () => {
    this.setState({
      selectedQuestion: this.state.selectedQuestion + 1,
      showAnswer: false
    });
    this.animatedValue.setValue(0);
    const { deck } = this.props.navigation.state.params;
    //Check if quiz is completed. If so, clear notifications.
    if (deck.questions.length - 1 <= this.state.selectedQuestion) {
      clearLocalNotifications().then(setLocalNotification());
    }
  };

  //Clears the values for the number of correct answers and the question that
  //should be displayed, so the quiz can be taken again.
  reset = () => {
    this.setState({
      selectedQuestion: 0,
      correctAnswers: 0
    });
  };

  render() {
    const { deck } = this.props.navigation.state.params;
    const frontAnimatedStyle = {
      opacity: this.frontOpacity,
      transform: [{ rotateY: this.frontInterpolate }]
    };
    const backAnimatedStyle = {
      opacity: this.backOpacity,
      transform: [{ rotateY: this.backInterpolate }]
    };
    return (
      <View style={styles.container}>
        {/*Display the number of questions answered, and the total number of questions,
      to notify user of progress*/}
        {this.state.selectedQuestion + 1 <= deck.questions.length && (
          <View style={styles.questionCount}>
            <Text>
              {this.state.selectedQuestion + 1}/{deck.questions.length}
            </Text>
          </View>
        )}

        <View style={styles.container}>
          {/*Check if the deck has cards/questions. If not, display a message for the user, to add a question/card*/}
          {deck.questions.length === 0 && (
            <View>
              <View style={styles.shadow}>
                <Text style={styles.title}>
                  Your deck has no questions yet. Please add a question/card to
                  your deck, so you can start the quiz.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("DeckView", {
                    deck
                  })
                }
              >
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Go Back</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          
          {deck.questions.length > 0 &&
          deck.questions.length <= this.state.selectedQuestion ? (
            <View>
              <Text style={styles.correct}>
                {`You answered ${this.state.correctAnswers} out of ${
                  deck.questions.length
                } questions correctly`}.
              </Text>

              {/*Calculate the score*/}
              <Text style={styles.score}>
                {`Total Score: ${(
                  this.state.correctAnswers /
                  deck.questions.length *
                  100
                ).toFixed(0)}%`}
              </Text>

              {/*Display Score*/}
              {this.state.correctAnswers / deck.questions.length < 0.6 && (
                <View>
                  <Text style={styles.message}>
                    Please practice more
                  </Text>
                  <AntDesign
                    style={styles.icon}
                    name="close"
                    size={40}
                    color={red}
                  />
                </View>
              )}
              {this.state.correctAnswers / deck.questions.length > 0.8 &&
                this.state.correctAnswers / deck.questions.length < 1 && (
                  <View>
                    <Text style={styles.message}>Well done!</Text>
                    <AntDesign
                      style={styles.icon}
                      name="check"
                      size={40}
                      color={green}
                    />
                  </View>
                )}

              {this.state.correctAnswers / deck.questions.length === 1 && (
                <View>
                  <Text style={styles.message}>
                    Warmest congratulations on your achievement!!!
                  </Text>
                  <AntDesign
                    style={styles.icon}
                    name="check"
                    size={50}
                    color={green}
                  />
                </View>
              )}

              <TouchableOpacity onPress={() => this.reset()}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Restart Quiz</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("DeckView", {
                    deck
                  })
                }
              >
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Back to Deck</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            //Check to see if the question is the selected question, if so, display the question.
            deck.questions
              .filter((question, i) => i === this.state.selectedQuestion)
              .map(question => (
                <View key={question.question}>
                  {/*Check if we need to display the question or the answer*/}
                  {!this.state.showAnswer ? (
                    <Animated.View style={[styles.shadow, frontAnimatedStyle]}>
                      <Text style={styles.title}>{question.question}</Text>
                      <TouchableOpacity onPress={() => this.handleClick()}>
                        <View>
                          <Text style={styles.text}>Show Answer</Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  ) : (
                    <Animated.View
                      style={[backAnimatedStyle, styles.flipCardBack]}
                    >
                      <Text style={styles.title}>{question.answer}</Text>
                      <TouchableOpacity onPress={() => this.handleClick()}>
                        <View>
                          <Text style={styles.text}>Show Question</Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                  {/*If user presses correct, count + 1 on the correctAnswers, and go to the next question*/}
                  <TouchableOpacity onPress={() => this.correctAnswers()}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Correct</Text>
                    </View>
                  </TouchableOpacity>
                  {/*If user presses incorrect go to the next question*/}
                  <TouchableOpacity onPress={() => this.nextQuestion()}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Incorrect</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  questionCount: {
    flex: -1,
    justifyContent: "flex-start",
    alignSelf: "flex-start"
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    padding: 10,
    color: white
  },
  score: {
    fontSize: 25,
    textAlign: "center",
    padding: 10
  },
  correct: {
    fontSize: 18,
    textAlign: "center"
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    paddingTop: 5,
    color: white
  },
  btn: {
    width: btnWidth,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 16,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: darkBlue
  },
  btnText: {
    fontSize: 16,
    textAlign: "center",
    color: darkBlue
  },
  shadow: {
    borderColor: "rgba(0, 128, 128, 0.5)",
    borderWidth: 1,
    elevation: 2,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 2,
    backgroundColor: darkBlue
  },
  message: {
    textAlign: "center",
    fontSize: 18
  },
  icon: {
    textAlign: "center",
    fontSize: 50,
    marginTop: 10
  },
  flipCardBack: {
    borderRadius: 2,
    borderColor: darkBlue,
    borderWidth: 1,
    elevation: 2,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: darkBlue
  }
});

export default QuizView;
