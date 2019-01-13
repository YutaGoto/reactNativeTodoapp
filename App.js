import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { CheckBox, FormInput, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from './firebase';
import { ALWAYS_THIS_DEVICE_ONLY } from 'expo/build/SecureStore/SecureStore';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      items: [],
    };
  }

  getItems = async () => {
    firebase.getItems().then((querySnapshow) => {
      const items = [];
      querySnapshow.forEach((doc) => {
        const data = doc.data();
        data.itemId = doc.id;
        items.push(data);
      })
      this.setState({ items });
    });
  }

  componentWillMount() {
    this.getItems();
  }

  addItem = async () => {
    const { text } = this.state;
    const inputText = text;
    if (inputText !== '') {
      await firebase.addItem(inputText);
      await this.getItems();
      this.setState({
        text: '',
      });
    }
  }

  completeItem = async (item) => {
    await firebase.completeItem(item);
    await this.getItems();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <View>
      <ListItem
        containerStyle={styles.listItem}
        title={item.content}
        leftIcon={
          <CheckBox
            iconLeft
            size={28}
            containerStyle={styles.checkBox}
            onPress = {() => {
              this.completeItem(item);
            }}
            checked={false}
          />}
        hideChevron
      />
    </View>
  )

  render() {
    const { text, items } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.formView}>
          <FormInput
            inputStyle={styles.formInput}
            onChangeText={(changedText) => {
              this.setState({ text: changedText });
            }}
            value={text}
            clearButtonMode="always"
          />
          <Icon
            name="plus-circle"
            size={32}
            onPress={() => {
              this.addItem();
            }}
          />
        </View>
        <View style={styles.todoList}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={items}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formView: {
    paddingTop: 30,
    flexDirection: 'row',
  },
  formInput: {
    borderWidth: 0,
    borderBottomWidth: 1,
    width: 200,
  },
  container: {
    flex: 1,
    height: '100%',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  checkBox: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    width: 46,
  },
  todoList: {
    paddingTop: 10,
  },
});
