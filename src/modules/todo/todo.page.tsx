import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header, HeaderTitle, FabButton, ViewInputTodo, InputTodo, Container } from './todo.style';
import Icon from 'react-native-vector-icons/Feather'
import TodoItem from './components/todo-item';
import uuid from 'react-native-uuid';

export const TodoPage: React.FC = ({ navigation }) => {
  const [statusPomodoro, setStatusPomodoro] = useState('');
  const [value, setValue] = useState('');

  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStatus()
      getTodos()
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation])

  const getStatus = async () => {
    let statusResponse = await AsyncStorage.getItem('status')
    setStatusPomodoro(statusResponse)
  }

  const getTodos = async () => {
    const todos = await AsyncStorage.getItem('todos')
    setFilteredData(todos && todos.length ? JSON.parse(todos) : []);
  }

  const update = async (item) => {
    const todos = await AsyncStorage.getItem('todos')
    let parseTodo = JSON.parse(todos)
    parseTodo.forEach(todo => {
      if(todo.id === item.id) {
        todo.title = item.title
        todo.completed = item.completed
      }
    })
    await AsyncStorage.setItem('todos', JSON.stringify(parseTodo))
    getTodos()
  }

  const destroy = async (item) => {
    Alert.alert(
      "Excluir Atividade",
      "Deseja realmente excluir está atividade?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Confirmar", onPress: async () => {
          const todos = await AsyncStorage.getItem('todos')
          const parseTodo = JSON.parse(todos)
          const newTodos = parseTodo.filter(todo => todo.id !== item.id)
          await AsyncStorage.setItem('todos', JSON.stringify(newTodos))
          getTodos()
        }}
      ],
      { cancelable: false }
    );
  }

  const create = async () => {
    const todos = await AsyncStorage.getItem('todos')
    const newTodos = {
      id: uuid.v1(),
      title: value,
      completed: false,
      createdAt: new Date()
    }

    if(!todos || !todos.length) {
      await AsyncStorage.setItem('todos', JSON.stringify([newTodos]))
    } else {
      let parseTodo = JSON.parse(todos)
      parseTodo.push(newTodos);
      await AsyncStorage.setItem('todos', JSON.stringify(parseTodo))
    }

    getTodos()
    setValue('')
  }

  return (
    <>
      <Header status={statusPomodoro}>
        <HeaderTitle style={{color: 'white'}}>Todas Atividades</HeaderTitle>
      </Header>
      <Container>
        <FlatList
          style={{ width: '100%', top: 15 }}
          data={filteredData}
          removeClippedSubviews={false}
          keyExtractor={item => item.id}
          renderItem={({ item: todo }) => (
            <TodoItem todo={todo} onUpdate={update} onDelete={destroy} status={statusPomodoro}
            />
          )}
        />
      </Container>
      <ViewInputTodo>
        <InputTodo 
          onChangeText={(text: string) => setValue(text)}
          onSubmitEditing={create}
          value={value}
          placeholder={"O que preciso fazer..."}
        />
        {/* <TouchableOpacity onPress={create} > */}
          <FabButton status={statusPomodoro} onPress={create}>
            <Icon
              name="plus"
              size={25}
              color="white"
            />
          </FabButton>
        {/* </TouchableOpacity> */}
      </ViewInputTodo>
    </>
  );
}
