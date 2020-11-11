/**
 * Rich Editor Example
 * @author tangzehua
 * @since 2019-06-24 14:52
 */
import React from 'react';
import {
    Appearance,
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Alert
} from 'react-native';
import {actions, defaultActions, RichEditor, RichToolbar} from './pell-rich-editor';
import {EmojiView} from './emoji';

import phizIcon from './img/phiz.png';
import htmlIcon from './img/h5.png';
import strikethrough from './img/strikethrough.png';
import { Header, HeaderTitle } from './notes.style';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-community/async-storage';
import uuid from 'react-native-uuid';
import { isEmpty } from 'lodash'

class CreateNote extends React.Component {
    
    constructor(props) {
        super(props);
        this.richText = React.createRef();
        this.linkModal = React.createRef();
        // const that = this;
        // const theme = props.theme || Appearance.getColorScheme();
        const theme = 'light'
        const contentStyle = this.createContentStyle(theme);
        this.state = { theme: theme, contentStyle, emojiVisible: false, disabled: false, statusPomodoro: '', htmlNote: this.props.note ? this.props.note.text : ''};
        // this.htmlNote = this.props.html ? this.props.html : '';
        // that.onTheme = that.onTheme;
        // that.onPressAddImage = that.onPressAddImage;
        // that.onInsertLink = that.onInsertLink;
        // that.onLinkDone = that.onLinkDone;
        // that.themeChange = that.themeChange;
        // this.handleChange = this.handleChange;
        // that.handleHeightChange = that.handleHeightChange;
        // that.insertEmoji = that.insertEmoji;
        // that.insertHTML = that.insertHTML;
        // that.insertVideo = that.insertVideo;
        // that.handleEmoji = that.handleEmoji;
        // that.onDisabled = that.onDisabled;
        // that.editorInitializedCallback = that.editorInitializedCallback;
        // that.saveNote = that.saveNote;
    }

    componentDidMount() {
        Appearance.addChangeListener(this.themeChange);
        Keyboard.addListener('keyboardDidShow', this.onKeyBoard);
    }

    componentWillUnmount() {
        Appearance.removeChangeListener(this.themeChange);
        Keyboard.removeListener('keyboardDidShow', this.onKeyBoard);
    }
    onKeyBoard = () => {
        TextInput.State.currentlyFocusedInput() && this.setState({emojiVisible: false});
    };

    editorInitializedCallback() {
        if(this.richText) {
            this.richText.current?.registerToolbar(function (items) {
                console.log('Toolbar click, selected items (insert end callback):', items);
            });
        }
    }

    /**
     * theme change to editor color
     * @param colorScheme
     */
    themeChange({colorScheme}) {
        const theme = colorScheme;
        const contentStyle = this.createContentStyle(theme);
        this.setState({theme, contentStyle});
    }

    handleChange = (html) => {
        this.setState({htmlNote: html});
    }

    /**
     * editor height change
     * @param {number} height
     */
    handleHeightChange(height) {
        console.log('editor height change:', height);
    }

    insertEmoji(emoji) {
        this.richText.current?.insertText(emoji);
        this.richText.current?.blurContentEditor();
    }

    handleEmoji() {
        const {emojiVisible} = this.state;
        Keyboard.dismiss();
        this.richText.current?.blurContentEditor();
        this.setState({emojiVisible: !emojiVisible});
    }

    // insertHTML() {
    //     this.richText.current?.insertHTML(`<span style="color: blue; padding:0 10px;">HTML</span>`);
    // }

    // onInsertLink() {
    //     // this.richText.current?.insertLink('Google', 'http://google.com');
    //     this.linkModal.current?.setModalVisible(true);
    // }

    onLinkDone({title, url}) {
        this.richText.current?.insertLink(title, url);
    }

    createContentStyle(theme) {
        // Can be selected for more situations (cssText or contentCSSText).
        const contentStyle = {
            backgroundColor: '#000033',
            color: '#fff',
            placeholderColor: 'gray',
            // cssText: '#editor {background-color: #f3f3f3}', // initial valid
            contentCSSText: 'font-size: 16px; min-height: 200px; height: 100%;', // initial valid
        };
        if (theme === 'light') {
            contentStyle.backgroundColor = '#fff';
            contentStyle.color = '#000033';
            contentStyle.placeholderColor = '#a9a9a9';
        }
        return contentStyle;
    }

    onTheme() {
        let {theme} = this.state;
        theme = theme === 'light' ? 'dark' : 'light';
        let contentStyle = this.createContentStyle(theme);
        this.setState({theme, contentStyle});
    }

    onDisabled() {
        this.setState({disabled: !this.state.disabled});
    }

    closeModal() {
        Alert.alert('Tem certeza que deseja cancelar nota?', 'Todas as alterações serão perdidas', [
            {
                text: 'Não',
                style: "cancel"
            },
            {
              text: 'Sim',
              onPress: () => {
                  this.setState({
                      htmlNote: '',
                  })
                  this.props.closeModal()
              },
            }
          ])
    }

    getTitle = () => {
        let title = this.state.htmlNote.split('</')[0]
        return title.split('&nbsp')[0]
    }

    async saveNote() {
        console.log('empty => ', isEmpty(this.props.note))
        if(!this.state.htmlNote) return

        if(!isEmpty(this.props.note)) await this.updateNote()
        else await this.createNote()

        this.props.closeModal()
    }

    createNote = async() => {
        const notes = await AsyncStorage.getItem('notes')
        const newNotes = {
            id: uuid.v1(),
            title: this.getTitle(),
            text: this.state.htmlNote,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        if(!notes || !notes.length) {
            await AsyncStorage.setItem('notes', JSON.stringify([newNotes]))
        } else {
            let parseNote = JSON.parse(notes)
            parseNote.push(newNotes);
            await AsyncStorage.setItem('notes', JSON.stringify(parseNote))
        }
    }

    updateNote = async() => {
        const notes = await AsyncStorage.getItem('notes')
        let parseNote = JSON.parse(notes)
        parseNote.forEach(note => {
          if(note.id === this.props.note.id) {
            note.title = this.getTitle()
            note.text = this.state.htmlNote
            note.updatedAt = new Date()
          }
        })
        await AsyncStorage.setItem('notes', JSON.stringify(parseNote))
    }

    render() {
        // let that = this;
        const {contentStyle, theme, emojiVisible, disabled, statusPomodoro} = this.state;
        const {backgroundColor, color, placeholderColor} = contentStyle;
        const themeBg = {backgroundColor};
        return (
            <>
            <Header status={statusPomodoro === 'pomodoroRound' ? 'break' : 'pomodoro'}>
                <HeaderTitle>
                    <TouchableOpacity onPress={() => { this.closeModal() }}>
                        <Icon
                            name="x"
                            size={25}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Text style={{color: 'white', fontSize: 17}}>Editar Nota</Text>
                    <TouchableOpacity onPress={() => { this.saveNote() }}>
                        <Icon
                            name="check"
                            size={25}
                            color="white"
                        />
                    </TouchableOpacity>
                </HeaderTitle>
            </Header>
            {/* <SafeAreaView style={[styles.container, themeBg]}> */}
                <ScrollView style={[styles.scroll, themeBg]} keyboardDismissMode={'none'}>
                    <RichEditor
                        initialFocus={false}
                        disabled={disabled}
                        editorStyle={contentStyle} // default light style
                        containerStyle={themeBg}
                        ref={this.richText}
                        style={[styles.rich, themeBg]}
                        // placeholder={'please input content'}
                        initialContentHTML={this.state.htmlNote}
                        editorInitializedCallback={() => this.editorInitializedCallback}
                        onChange={this.handleChange}
                        onHeightChange={() => this.handleHeightChange}
                    />
                </ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <RichToolbar
                        style={[styles.richBar, themeBg]}
                        editor={this.richText}
                        disabled={disabled}
                        iconTint={color}
                        selectedIconTint={'#2095F2'}
                        disabledIconTint={'#8b8b8b'}
                        // onPressAddImage={that.onPressAddImage}
                        // onInsertLink={that.onInsertLink}
                        iconSize={40} // default 50
                        actions={[
                            // 'insertVideo',
                            ...defaultActions,
                            actions.setStrikethrough,
                            actions.heading1,
                            actions.heading4,
                            // actions.removeFormat,
                            // 'insertEmoji',
                            // 'insertHTML',
                        ]}
                        iconMap={{
                            insertEmoji: phizIcon,
                            [actions.removeFormat]: ({tintColor}) => (
                                <Text style={[styles.tib, {color: tintColor}]}>C</Text>
                            ),
                            [actions.setStrikethrough]: strikethrough,
                            [actions.heading1]: ({tintColor}) => (
                                <Text style={[styles.tib, {color: tintColor}]}>H1</Text>
                            ),
                            [actions.heading4]: ({tintColor}) => (
                                <Text style={[styles.tib, {color: tintColor}]}>H3</Text>
                            ),
                            insertHTML: htmlIcon,
                            // insertVideo: videoIcon,
                        }}
                        insertEmoji={this.handleEmoji}
                        // insertHTML={that.insertHTML}
                        // insertVideo={that.insertVideo}
                    />
                    {emojiVisible && <EmojiView onSelect={this.insertEmoji} />}
                </KeyboardAvoidingView>
            {/* </SafeAreaView> */}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },
    rich: {
        minHeight: 300,
        flex: 1,
    },
    richBar: {
        height: 50,
        backgroundColor: '#F5FCFF',
    },
    scroll: {
        backgroundColor: '#ffffff',
    },
    item: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#e8e8e8',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
    },

    tib: {
        textAlign: 'center',
        color: '#515156',
    },
});

const mapStateToProps = store => ({
    statusPomodoro: store.clickState.status
  });

export default connect(mapStateToProps)(CreateNote);

// export {CreateNote};
