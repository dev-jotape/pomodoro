import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import IconIonic from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {PomodoroPage} from './src/modules/pomodoro/pomodoro.page';
import {NotesPage} from './src/modules/notes/notes.page';
import {TodoPage} from './src/modules/todo/todo.page';
import AsyncStorage from '@react-native-community/async-storage';

const Tab = createBottomTabNavigator();
const activeTintColor = '#ff260a';
const inactiveTintColor = '#777';

export default function App() {
  let status = 'pomodoro';
  const getColor = (color) => {
    return color === activeTintColor
      ? status === 'pomodoro'
        ? ['#EB4B3B', '#D5383C']
        : ['#17b7dd', '#17b7dd']
      : ['#fff', '#fff'];
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Pomodoro"
        screenOptions={({route, navigation}) => {
          console.log('Voltou pra ca => ', route.params);
          if (route.params && route.params.status) status = route.params.status;

          return {
            tabBarIcon: ({color, size}) => {
              let iconName;

              switch (route.name) {
                case 'Todo':
                  iconName = 'check-square';
                  break;
                case 'Pomodoro':
                  iconName = 'edit';
                  return (
                    <View>
                      <LinearGradient
                        style={styles.iconTabRound}
                        start={{x: 0, y: 1}}
                        end={{x: 0, y: 0}}
                        colors={getColor(color)}>
                        <IconIonic
                          name="timer-outline"
                          size={26}
                          color={color === activeTintColor ? '#fff' : color}
                        />
                      </LinearGradient>
                    </View>
                  );
                case 'Notes':
                  iconName = 'edit-3';
                  break;
                default:
                  iconName = 'circle';
                  break;
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
          };
        }}
        tabBarOptions={{
          activeTintColor,
          inactiveTintColor,
          showLabel: false,
        }}>
        <Tab.Screen name="Todo" component={TodoPage} />
        <Tab.Screen name="Pomodoro" component={PomodoroPage} />
        <Tab.Screen name="Notes" component={NotesPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPost: {
    width: '100%',
    height: '100%',
  },
  iconTabRound: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#9C27B0',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
