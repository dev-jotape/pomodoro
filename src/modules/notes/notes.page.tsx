import React, { useState, useEffect } from 'react';
import { View, Button, Modal, Alert, Text, TouchableHighlight, StyleSheet, Dimensions, FlatList } from 'react-native';
import CreateNote from './create-note'
import { Header, HeaderTitle, Container,NoFoundIcon, TextNotFound } from '../todo/todo.style';
import { ViewInputTodo, FabButton } from './notes.style';
import { useSelector } from "react-redux";
import Icon from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-community/async-storage';
import NoteItem from './components/note-item'

export const NotesPage: React.FC = ({ navigation }) => {
  const counter = useSelector(state => state);

  const [modalVisible, setModalVisible] = useState(false);
  const [statusPomodoro, setStatusPomodoro] = useState('');
  const [filteredData, setFilteredData] = useState([])
  const [editMode, setEditMode] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState({})
 
  useEffect(() => {
    setStatusPomodoro(counter.clickState.status === 'pomodoroRound' ? 'break' : 'pomodoro')
  }, [counter])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getNotes()
    });

    return unsubscribe;
  }, [navigation])

  const getNotes = async () => {
    const notes = await AsyncStorage.getItem('notes')
    console.log(notes)
    setFilteredData(notes && notes.length ? JSON.parse(notes) : []);
  }

  const goToCreateNote = () => {
    setModalVisible(true)
  }

  const closeModal = () => {
    setEditMode(false)
    setNoteToEdit({})
    setModalVisible(false)
    getNotes()
  }

  const destroy = async (item) => {
    Alert.alert(
      "Excluir nota",
      "Deseja realmente excluir está nota?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Confirmar", onPress: async () => {
          const notes = await AsyncStorage.getItem('notes')
          const parseNotes = JSON.parse(notes)
          const newNotes = parseNotes.filter(note => note.id !== item.id)
          await AsyncStorage.setItem('notes', JSON.stringify(newNotes))
          getNotes()
        }}
      ],
      { cancelable: false }
    );
  }

  const editNote = (item) => {
    console.log('edit note => ', item)
    setEditMode(true)
    setNoteToEdit(item)
    setModalVisible(true)
  }

  return (
    <>
      <Header status={statusPomodoro}>
        <HeaderTitle style={{color: 'white'}}>Todas as Notas</HeaderTitle>
      </Header>
      <Container>
        {filteredData && filteredData.length ? (
          <FlatList
            style={{ width: '100%', top: 15 }}
            data={filteredData}
            removeClippedSubviews={false}
            keyExtractor={item => item.id}
            renderItem={({ item: note }) => (
              <NoteItem 
                note={note} 
                onUpdate={editNote} 
                onDelete={destroy} 
                status={statusPomodoro}
              />
            )}
          />
        ) : (
          <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <NoFoundIcon
              name="search"
              size={40}
              status={statusPomodoro}
            />
            <TextNotFound status={statusPomodoro}>Nenhuma nota encontrada...</TextNotFound>
          </View>
        )}
      </Container>
      <ViewInputTodo>
        <Text style={{flex: 1, textAlign: 'center'}}>{filteredData.length} Notas</Text>
        <FabButton status={statusPomodoro} onPress={goToCreateNote}>
          <Icon
            name="plus"
            size={25}
            color="white"
          />
        </FabButton>
      </ViewInputTodo>
        <Modal transparent={true}
         visible={modalVisible}
         onRequestClose={() => closeModal()}>
          <View>
            <View style={{
                    width: '100%',
                    height: '100%',
                    }}>
              <CreateNote note={noteToEdit} closeModal={() => closeModal()} />
            </View>
          </View>
        </Modal>
    </>
    // <View style={{height: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
    //   <Button title="Criar Note" onPress={goToCreateNote} />
    // </View>
  )
}
