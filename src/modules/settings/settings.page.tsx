import AsyncStorage from '@react-native-community/async-storage';
import { PickerComponent } from './components/picker';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Container, Separator, ConfigGroup, ConfigLine, TextInput } from './settings.style';

const times = [5,10,15,20,25,30,35,40,45,50,55,60]

export const SettingsPage: React.FC = () => {
  const [focusLength, setFocusLength] = useState(0)
  const [shortBreakLength, setShortBreakLength] = useState('')
  const [longBreakLength, setLongBreakLength] = useState('')

  useEffect(() => {
    getPomodoroConfig()
  }, [])

  const getPomodoroConfig = async () => {
    let config = await AsyncStorage.getItem('settings')
    config = JSON.parse(config);
    console.log('config ===> ', config)
    setFocusLength(config.focusLength ? config.focusLength : 25)
    setShortBreakLength(config.shortBreakLength ? config.shortBreakLength : 5)
    setLongBreakLength(config.longBreakLength ? config.longBreakLength : 25)
  }

  const saveFocusTime = async (time) => {
    console.log('save focus => ', time)
    let settingsStorage = await AsyncStorage.getItem('settings');
    settingsStorage = !!settingsStorage ? JSON.parse(settingsStorage) : {}
    console.log('settingsStorage', settingsStorage)
    await AsyncStorage.setItem('settings', JSON.stringify({
      focusLength: time,
      shortBreakLength: shortBreakLength,
      longBreakLength: longBreakLength
    }))
    getPomodoroConfig()
  }

  const saveShortBreak = async(time) => {
    let settingsStorage = await AsyncStorage.getItem('settings');
    settingsStorage = !!settingsStorage ? JSON.parse(settingsStorage) : {}
    await AsyncStorage.setItem('settings', JSON.stringify({
      focusLength: focusLength,
      shortBreakLength: time,
      longBreakLength: longBreakLength
    }))
    getPomodoroConfig()
  }

  const saveLongBreak = async(time) => {
    let settingsStorage = await AsyncStorage.getItem('settings');
    settingsStorage = !!settingsStorage ? JSON.parse(settingsStorage) : {}
    await AsyncStorage.setItem('settings', JSON.stringify({
      focusLength: focusLength,
      shortBreakLength: shortBreakLength,
      longBreakLength: time
    }))
    getPomodoroConfig()
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps='handled'
    >
      <Container>
        <Text style={{margin: 20, marginBottom: 10, color: '#6a6a6a'}}>POMODORO</Text>
        <ConfigGroup>
          <PickerComponent title="Tempo de foco" onChange={saveFocusTime} times={times} actualTime={focusLength} />

          <Separator />

          <PickerComponent title="Tempo de intervalo curto" onChange={saveShortBreak} times={times} actualTime={shortBreakLength} />

          <Separator />

          <PickerComponent title="Tempo de intervalo longo" onChange={saveLongBreak} times={times} actualTime={longBreakLength} />

        </ConfigGroup>
      </Container>
    </ScrollView>
  );
}
