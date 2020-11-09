import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { Title, Separator, Container } from './note-item.style';

const NoteItem: React.FC = ({ note, onUpdate, onDelete, status }) => {
  useEffect(() => {
    console.log('note => ', note)
  }, [])

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY HH:mm')
  }

  return (
    <Container>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
        <View>
          <TouchableOpacity
            onPress={() => onUpdate(note)}
          >
            <Title>{note.title.replace(/<\/?[^>]+(>|$)/g, "")}</Title>
            <Text>{note.updatedAt ? formatDate(note.updatedAt) : formatDate(note.createdAt)}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
              onPress={() => onDelete(note)}
              style={{ paddingLeft: 25, paddingRight: 15 }}
            >
              <Ionicons
                name="ios-trash-outline"
                color={'black'}
                size={23}
              />
            </TouchableOpacity>
        </View>
      </View>
      <Separator />
    </Container>
  );
}

export default NoteItem;