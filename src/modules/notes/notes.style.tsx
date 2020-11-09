import styled from 'styled-components'
import { Platform } from 'react-native'
import { pomodoroStatus } from '../../services/color'

export const Header = styled.View`
    background: ${props => props.status === pomodoroStatus.pomodoroStatus ? pomodoroStatus.pomodoroColor : pomodoroStatus.breakColor };
    height: ${Platform.OS === 'ios' ? '100px' : '60px'};
    elevation: 10;
    justify-content: center;
    shadow-color: #000;
    shadow-opacity: 1.0;
    shadow-radius: 3.8px;
`

export const HeaderTitle = styled.View`
    margin-left: 10px;
    margin-right: 10px;
    margin-top: ${Platform.OS === 'ios' ? '30px' : '0'};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between
`

export const ViewInputTodo = styled.View`
    background-color: #F3F3F3;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: row;
    flex: 1;
    shadow-color: #000;
    shadow-opacity: 0.16;
    shadow-radius: 16px;
    elevation: 5;
    shadow-offset: {
        width: 0,
        height: 2,
    };
    padding-top: 10px;
    padding-bottom: 10px;
`

export const FabButton = styled.TouchableOpacity`
    background: ${props => props.status === pomodoroStatus.pomodoroStatus ? pomodoroStatus.pomodoroColor : pomodoroStatus.breakColor };
    height: 40px;
    width: 40px;
    border-radius: 50px;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    position: absolute;
    right: 0;
`