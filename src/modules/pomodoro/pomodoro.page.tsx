import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';

// import { Container } from './styles';

enum Status {
  pomodoroRound = 'pomodoroRound',
  smallBreak = 'smallBreak',
  longBreak = 'longBreak',
}

const inicialMinutes = 0;
const initialSeconds = 5;

export const PomodoroPage: React.FC = ({navigation}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setPause] = useState(false);
  const [minutes, setMinutes] = useState(inicialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [interval, setStateInterval] = useState(null);
  const [status, setStatus] = useState(Status.pomodoroRound);
  const [round, setRound] = useState(1);

  const startCountDown = (
    stateMinutes: number,
    stateSeconds: number,
    statusParam = Status.pomodoroRound,
    roundParam = round,
  ) => {
    setStatus(statusParam);
    setRound(roundParam);
    setIsPlaying(true);
    setPause(false);

    let createInterval = setInterval(() => {
      if (stateSeconds === 0) {
        if (stateMinutes === 0) {
          clearInterval(createInterval);
          nextRound(statusParam, roundParam);
        } else {
          stateSeconds = 59;
          stateMinutes--;
          setSeconds(stateSeconds);
          setMinutes(stateMinutes);
        }
      } else {
        stateSeconds--;
        setSeconds(stateSeconds);
      }
    }, 1000);
    setStateInterval(createInterval);
  };

  const nextRound = (statusParam, roundParam) => {
    if (statusParam === Status.pomodoroRound) {
      roundParam === 4 ? setLongBreak(roundParam) : setSmallBreak(roundParam);
    } else if (statusParam === Status.smallBreak) {
      setPomodoroRound(roundParam);
    } else if (statusParam === Status.longBreak) {
      setPomodoroRound(1);
    }
  };

  const setTabColor = (status) => {
    console.log('set tab color => ', status)
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Pomodoro',
        params: {status},
      }),
    );
  }

  const setLongBreak = (roundParam) => {
    startCountDown(0, 15, Status.longBreak, roundParam);
    setTabColor('break');
  };

  const setSmallBreak = (roundParam) => {
    startCountDown(0, 5, Status.smallBreak, roundParam + 1);
    setTabColor('break');
  };

  const setPomodoroRound = (roundParam) => {
    startCountDown(0, 5, Status.pomodoroRound, roundParam);
    setTabColor('pomodoro');
  };

  const pause = () => {
    setPause(true);
    setIsPlaying(false);
    clearInterval(interval);
  };

  const reiniciar = () => {
    clearInterval(interval);
    setStatus(Status.pomodoroRound);
    setPause(false);
    setIsPlaying(false);
    setRound(1);
    setMinutes(inicialMinutes);
    setSeconds(initialSeconds);
    setTabColor('pomodoro');
  };

  const generateActionButtons = () => {
    if (isPlaying) {
      return (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            pause();
          }}>
          <Text style={styles.buttonText}>Pausar</Text>
        </TouchableOpacity>
      );
    }
    if (isPaused) {
      return (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => startCountDown(minutes, seconds)}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => reiniciar()}>
            <Text style={styles.buttonText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => startCountDown(minutes, seconds)}>
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>
    );
  };

  const formatTime = (time) => {
    if (time < 10) {
      let stringFormat = time.toString();
      return '0' + stringFormat;
    }
    return time;
  };

  const getMessage = () => {
    switch (status) {
      case Status.pomodoroRound:
        return <Text style={styles.messageText}>Foco!</Text>;
      case Status.smallBreak:
        return <Text style={styles.messageText}>Respire!</Text>;
      case Status.longBreak:
        return <Text style={styles.messageText}>Pausa Longa!</Text>;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pomodoroGroup}>
        <LinearGradient
          style={styles.containerPost}
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          colors={
            status === Status.pomodoroRound
              ? ['#E33B3F', '#E33B3F']
              : ['#17b7dd', '#17b7dd']
          }>
          <View style={styles.pomodoro}>
            <View>
              <Text style={styles.countDown}>
                {formatTime(minutes)}:{formatTime(seconds)}
              </Text>
            </View>
            <View style={styles.divider} />
            {generateActionButtons()}
            <View style={styles.divider} />
            {getMessage()}
          </View>
        </LinearGradient>
      </View>
      <View style={styles.goalGroup}>
        <View>
          <Text
            style={{
              color: '#777',
              fontFamily: 'Rajdhani-Medium',
              fontSize: 16,
            }}>
            ROUND
          </Text>
        </View>
        <View style={styles.goal}>
          <Text
            style={{
              color: '#777',
              fontFamily: 'Rajdhani-SemiBold',
              fontSize: 30,
            }}>
            {round}
          </Text>
          <Text
            style={{
              color: '#777',
              fontFamily: 'Rajdhani-Medium',
              fontSize: 16,
            }}>
            / 4
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  pomodoroGroup: {
    flex: 5,
  },
  pomodoro: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: 'white',
  },
  goalGroup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPost: {
    width: '100%',
    height: '100%',
  },
  goal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 30,
  },
  countDown: {
    color: 'white',
    fontFamily: 'Rajdhani-Light',
    fontSize: 100,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    height: 80,
    width: 80,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Rajdhani-Light',
  },
  messageText: {
    color: 'white',
    fontFamily: 'Rajdhani-Regular',
    fontSize: 30,
  },
});
