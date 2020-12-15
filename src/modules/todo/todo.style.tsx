import styled from 'styled-components'
import { Platform } from 'react-native'
import { pomodoroStatus } from '../../services/color'
import Icon from 'react-native-vector-icons/Feather'

export const Container = styled.View`
    background: white;
    height: 100%;
    flex: 10;
`

export const Header = styled.View`
    background: ${props => props.status === pomodoroStatus.pomodoroStatus ? pomodoroStatus.pomodoroColor : pomodoroStatus.breakColor };
    height: ${Platform.OS === 'ios' ? '100px' : '60px'};
    elevation: 10;
    /* justify-content: center; */
    shadow-color: #000;
    shadow-opacity: 1.0;
    shadow-radius: 3.8px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export const HeaderTitle = styled.Text`
    margin-left: 10px;
    margin-top: ${Platform.OS === 'ios' ? '30px' : '0'};
    font-size: 17px;
`

export const IconOptions = styled(Icon)`
    margin-top: ${Platform.OS === 'ios' ? '30px' : '0'};
    margin-right: 10px;
`

export const ViewInputTodo = styled.KeyboardAvoidingView`
    background-color: #F3F3F3;
    /* align-items: center; */
    display: flex;
    flex-direction: row;
    flex: 1;
    /* position: absolute;
    bottom: 0; */
    shadow-color: #000;
    shadow-opacity: 0.16;
    shadow-radius: 16px;
    elevation: 5;
    shadow-offset: {
        width: 0,
        height: 2,
    };
    padding-top: 20px;
    padding-bottom: 15px;
`

export const InputTodo = styled.TextInput`
    border-radius: 20px;
    border-color: #F3F3F3;
    background-color: white;
    border-width: 1px;
    flex: 1;
    margin-right: 10px;
    margin-left: 10px;
    padding-left: 10px;
    height: 40px;
    margin-top: -5px;
`

export const FabButton = styled.TouchableOpacity`
    background: ${props => props.status === pomodoroStatus.pomodoroStatus ? pomodoroStatus.pomodoroColor : pomodoroStatus.breakColor };
    height: 40px;
    width: 40px;
    border-radius: 50px;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    margin-top: -5px;
    /* bottom: 10px; */
    /* right: 10px; */
    /* position: absolute; */
`

export const NoFoundIcon = styled(Icon)`
    color: ${props => props.status === pomodoroStatus.pomodoroStatus ? pomodoroStatus.pomodoroColor : pomodoroStatus.breakColor };
`

export const TextNotFound = styled.Text`
    /* color: ${props => props.status === pomodoroStatus.pomodoroStatus ? pomodoroStatus.pomodoroColor : pomodoroStatus.breakColor }; */
    margin-top: 10px;
    font-size: 15px;
`

