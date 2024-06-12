import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009AFA',
    },

    header: {
        width: '100%',
        height: 90,
        justifyContent: 'flex-end',
    },

    body: {
        flex: 1,
        backgroundColor: '#F1F2F4',
    },

    pressBack: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 250,
        height: 40,
    },

    txtInHeader: {
        fontSize: 20,
        color: '#F1FFFF',
        marginLeft: 10,
    }, 

    viewAccount:{
        height: 163,
        width: '100%',
        backgroundColor: '#FFFFFF',
        // backgroundColor: 'blue',
    },

    txtTitle :{
        fontSize: 17,
        color: '#07439B',
        fontWeight: '500',
        marginLeft: 15,
        marginTop: 15,
        marginBottom: 15
    },

    textBirthDay: {
        fontSize: 18,
        marginLeft: 15
    },

    pressBirthDay: {
        // backgroundColor: 'red', 
        height: 55, 
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    viewSecutity: {
        marginTop: 9,
        height: 106,
        width: '100%',
        backgroundColor: '#FFFFFF',
        // backgroundColor: 'blue'
    },

    viewLogin: {
        marginTop: 9,
        height: 179,
        width: '100%',
        backgroundColor: '#FFFFFF',
        // backgroundColor: 'blue'
    },

    line1: {
        height: 1,
        backgroundColor: '#FFFFFF',
        width: '5%'
    },

    line2: {
        height: 1,
        backgroundColor: '#F1F2F4',
        width: '95%'
    },

    line: {
        flexDirection: 'row'
    },
    
    viewSearchAndF: {
        marginTop: 9,
        height: 107,
        width: '100%',
        backgroundColor: '#FFFFFF',
        // backgroundColor: 'blue'
    },

    button: {
        alignSelf: 'center',
        backgroundColor: '#A8ADB1',
        // backgroundColor: 'red',
        borderRadius: 15,
        height: 25,
        width: 45,
        marginRight: 15,
        justifyContent: 'center'
    },

    circleButton: {
        height: 20, width: 20, 
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginLeft: 2
    },

    circleButton1: {
        height: 20, width: 20, 
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginLeft: 23
    },

    toggledButton: {
        backgroundColor: 'blue',
    },

    buttonText: {
        color: 'white',
    },

    viewEnd: {
        marginTop: 9,
        height: 107,
        width: '100%',
        backgroundColor: '#FFFFFF',
        // backgroundColor: 'blue'
    }
})