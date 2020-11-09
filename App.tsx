import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import IconIonic from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {PomodoroPage} from './src/modules/pomodoro/pomodoro.page';
import {NotesPage} from './src/modules/notes/notes.page';
import {TodoPage} from './src/modules/todo/todo.page';
import { SettingsPage } from './src/modules/settings/settings.page';
import AsyncStorage from '@react-native-community/async-storage';
import { pomodoroStatus } from './src/services/color';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
import { Provider } from 'react-redux';
import { Store } from './src/store';

Icon.loadFont();
IconIonic.loadFont();
AsyncStorage.setItem('status', 'pomodoro')

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  let status = 'pomodoro';

  const getColor = (color: string) => {
    return color === pomodoroStatus.activeTintColor
      ? status === pomodoroStatus.pomodoroStatus
        ? [pomodoroStatus.pomodoroColor, pomodoroStatus.pomodoroColor]
        : [pomodoroStatus.breakColor, pomodoroStatus.breakColor]
      : [pomodoroStatus.whiteColor, pomodoroStatus.whiteColor];
  };

  const TabNavigator = () => {
    return (
      <Tab.Navigator
        initialRouteName="Pomodoro"
        screenOptions={({route, navigation}) => {
          // console.log('route param ==> ', route);

          if (route.params && route.params.statusParam) {
            AsyncStorage.setItem('status', route.params.statusParam)
            status = route.params.statusParam;
            route.params.statusParam = undefined;
          }

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
                          color={color === pomodoroStatus.activeTintColor ? pomodoroStatus.whiteColor : color}
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

              return <Icon name={iconName} size={size} color={color === pomodoroStatus.inactiveTintColor ? color : status === pomodoroStatus.pomodoroStatus ? pomodoroStatus.pomodoroColor : pomodoroStatus.breakColor} />;
            },
          };
        }}
        tabBarOptions={{
          activeTintColor: pomodoroStatus.activeTintColor,
          inactiveTintColor: pomodoroStatus.inactiveTintColor,
          showLabel: false,
        }}>
        <Tab.Screen name="Todo" component={TodoPage} />
        <Tab.Screen name="Pomodoro" component={PomodoroPage} />
        <Tab.Screen name="Notes" component={NotesPage} />
      </Tab.Navigator>
    );
  };

  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{
              headerTransparent: true,
              title: '',
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsPage}
            options={{
              headerTransparent: true,
              title: '',
              headerLeft: null,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
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
    // elevation: 6,
    shadowColor: '#9C27B0',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
