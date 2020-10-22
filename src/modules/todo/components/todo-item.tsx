import React, { Component } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { View, CheckBox, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import { pomodoroStatus } from '../../../services/color'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },

  row: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

class TodoItem extends Component {  
  onTodoItemToggle = (todo, propAction) => {
    propAction({
      ...todo,
      completed: !todo.completed,
    });
  };

  state = {
    text: this.props.todo.title
  }
  
  async getStatus() {
    let statusResponse = await AsyncStorage.getItem('status')
    this.setState({ status: statusResponse })
  }

  render() {
    let { todo, onUpdate, onDelete, status } = this.props;
    return (
      <View style={styles.row}>
        <View
          style={{
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 10,
            paddingVertical: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => this.onTodoItemToggle(todo, onUpdate)}
            style={{
              flex: 1,
            }}
          >
            <CheckBox
              checked={todo.completed}
              onPress={() => this.onTodoItemToggle(todo, onUpdate)}
              color={status === pomodoroStatus.pomodoroStatus ? pomodoroStatus.pomodoroColor : pomodoroStatus.breakColor}
            />
            </TouchableOpacity>
            <Body
              style={{
                flex: 6,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingLeft: 25,
                // backgroundColor: 'red'
              }}
            >
              <TextInput
                multiline={true}
                onChangeText={(text: string) => this.setState({ text })}
                value={this.state.text}
                onSubmitEditing={() => onUpdate({...todo, title: this.state.text })}
                onEndEditing={() => onUpdate({...todo, title: this.state.text })}
                style={{
                  color: todo.completed ? 'grey' : 'black',
                  textDecorationLine: todo.completed ? 'line-through' : 'none',
                  marginLeft: -15,
                  width: '100%',
                }}
                editable={!todo.completed}
                blurOnSubmit
              />
                {/* {todo.title} */}
              {/* </TextInput> */}
            </Body>
          </View>
          <TouchableOpacity
            onPress={() => onDelete(todo)}
            style={{ paddingLeft: 25, paddingRight: 15 }}
          >
            <Ionicons
              name="ios-trash-outline"
              color={`${todo.title.length > 0 ? 'black' : 'grey'}`}
              size={23}
            />
          </TouchableOpacity>
        {/* </View> */}
      </View>
    );
  }
}

export default TodoItem;