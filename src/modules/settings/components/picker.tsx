import React, { useEffect, useState } from 'react';
import { Platform, Text } from 'react-native';
import {Picker} from '@react-native-community/picker'
import {
    InputForm,
    Col,
  } from './picker.style';

// import { Container } from './styles';

export const PickerComponent: React.FC = (props) => {
    // const [actualTime, setTime] = useState(props.actualTime)

    useEffect(() => {
        console.log('useEffect => ', props)
    }, [])
  
  return Platform.OS === 'android' ? (
        <InputForm>
            <Col style={{flex: 1}}>
                <Text style={{fontSize: 17, color: '#898989'}}>{props.title}</Text>
            </Col>
            <Col style={{flex: 1}}>
                <Picker
                selectedValue={props.actualTime}
                style={{height: 50}}
                onValueChange={(itemValue => {
                    // setTime(itemValue)
                    props.onChange(itemValue)
                })}>
                {props.times.map(time => <Picker.Item label={time.toString()} value={time} />) }
            
                </Picker>
            </Col>
        </InputForm>
      ) : (
        <InputForm>
            <Text style={{fontSize: 17, color: '#898989'}}>{props.title}</Text>
            <Picker
                selectedValue={props.actualTime}
                style={{height: 170, width: 70, marginTop: -35}}
                onValueChange={(itemValue => {
                    props.onChange(itemValue)
                })}>
                {props.times.map(time => <Picker.Item label={time.toString()} value={time} />) }
            </Picker>
        </InputForm>
      )
}

