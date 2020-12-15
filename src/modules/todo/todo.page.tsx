import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Alert, ActionSheetIOS, Platform, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header, HeaderTitle, FabButton, ViewInputTodo, InputTodo, Container, IconOptions, NoFoundIcon, TextNotFound } from './todo.style';
import Icon from 'react-native-vector-icons/Feather'
import TodoItem from './components/todo-item';
import uuid from 'react-native-uuid';
import { useSelector } from "react-redux";
import RBSheet from "react-native-raw-bottom-sheet";
import { orderBy, sortBy } from 'lodash'

export const TodoPage: React.FC = ({ navigation }) => {
  const counter = useSelector(state => state);

  const [statusPomodoro, setStatusPomodoro] = useState('');
  const [value, setValue] = useState('');

  // const [padding, setPadding] = useState(20);
  // const [margin, setMargin] = useState(-5)

  const [filteredData, setFilteredData] = useState([])

  // useEffect(() => {
  //   Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
  //   Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

  //   return () => {
  //     Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
  //     Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
  //   };
  // }, []);

  // const _keyboardDidShow = () => {
  //   console.log("Keyboard Shown");
  //   setPadding(80)
  //   setMargin(-70)
  // };

  // const _keyboardDidHide = () => {
  //   console.log("Keyboard Hidden");
  //   setPadding(20)
  //   setMargin(-5)
  // };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTodos()
    });

    return unsubscribe;
  }, [navigation])

  useEffect(() => {
    setStatusPomodoro(counter.clickState.status === 'pomodoroRound' ? 'break' : 'pomodoro')
  }, [counter])

  const getTodos = async (completed = null) => {
    const storageCompleted = await AsyncStorage.getItem('showCompleted');
    const showCompleted = (storageCompleted === "true");

    const storageTodos = await AsyncStorage.getItem('todos');
    if(!showCompleted) {
      let todos = storageTodos && storageTodos.length ? JSON.parse(storageTodos) : [];
      setFilteredData(todos.filter(el => !el.completed))
    } else {
      if(storageTodos && storageTodos.length) {
        let orderedTodos = sortBy(JSON.parse(storageTodos), ['completed', 'createdAt'], ['asc', 'asc'])
        console.log(orderedTodos)
        setFilteredData(orderedTodos);
      }
    }
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

  const updateStatus = async (item) => {
    const beforeUpdate = filteredData.map((el) => {
      if(el.id === item.id) {
        el.completed = item.completed
      }
      return el
    })
    setFilteredData(beforeUpdate)

    setTimeout(() => {
      update(item)
    }, 300)
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
    if(!value) return 
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

  const options = async () => {
    const storageCompleted = await AsyncStorage.getItem('showCompleted');
    const showCompleted = (storageCompleted === "true");

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", showCompleted ? "Esconder lembretes concluídos" : "Mostrar lembretes concluídos"],
        // destructiveButtonIndex: 2,
        cancelButtonIndex: 0
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          await AsyncStorage.setItem('showCompleted', String(!showCompleted))
          getTodos()
        } 
      }
    );
  }
  
  const refRBSheet = useRef();

  const setShowComplete = async () => {
    const storageCompleted = await AsyncStorage.getItem('showCompleted');
    const showCompleted = (storageCompleted === "true");
    console.log('showcomplete => ', showCompleted)
    await AsyncStorage.setItem('showCompleted', String(!showCompleted))
    getTodos()
    refRBSheet.current.close()
  }

  return (
    <>
      <Header status={statusPomodoro}>
        <HeaderTitle style={{color: 'white'}}>Todos os lembretes</HeaderTitle>
        {Platform.OS === 'android' ? (
          <>
            <TouchableOpacity 
              onPress={() => refRBSheet.current.open()}>
                <IconOptions
                  name="more-vertical"
                  size={25}
                  color="white"
                />
            </TouchableOpacity>
            <RBSheet
              ref={refRBSheet}
              closeOnDragDown={true}
              closeOnPressMask={true}
              height={80}
              customStyles={{
                container: {
                  
                }
                // wrapper: {
                //   backgroundColor: "transparent"
                // },
                // draggableIcon: {
                //   backgroundColor: "#fff"
                // },
              }}
            >
              <View style={{paddingLeft: 20}}>
                <TouchableOpacity onPress={setShowComplete} style={{flexDirection: 'row', alignItems: 'center'}}>
                  <>
                    <Icon name={"eye"} size={20} style={{marginRight: 20}}/>
                    <Text>Mostar/Esconder lembretes concluídos</Text>
                  </>
                </TouchableOpacity>
              </View>
            </RBSheet>
            </>
        ) : (
          <TouchableOpacity onPress={options}>
            <IconOptions
              name="more-horizontal"
              size={25}
              color="white"
            />
          </TouchableOpacity>
        )}
        
      </Header>
      <ViewInputTodo
        behavior={Platform.OS == "ios" ? "padding" : "heigth"}
        // keyboardVerticalOffset={40}
      >
        <InputTodo 
          onChangeText={(text: string) => setValue(text)}
          onSubmitEditing={create}
          value={value}
          placeholder={"O que preciso fazer..."}
          placeholderTextColor="#b6b6b6" 
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
      <Container>
        {filteredData && filteredData.length ? (
          <FlatList
            style={{ width: '100%', top: 15 }}
            data={filteredData}
            removeClippedSubviews={false}
            keyExtractor={item => item.id}
            renderItem={({ item: todo }) => (
              <TodoItem todo={todo} onUpdate={update} onDelete={destroy} updateStatus={updateStatus} status={statusPomodoro}
              />
            )}
          />
        ) : (
          <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled' >
            <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <NoFoundIcon
              name="search"
              size={40}
              status={statusPomodoro}
            />
            <TextNotFound status={statusPomodoro}>Nenhum lembrete encontrado...</TextNotFound>
            </View>
          </ScrollView>
        )}
        
      </Container>
      
    </>
  );
}
