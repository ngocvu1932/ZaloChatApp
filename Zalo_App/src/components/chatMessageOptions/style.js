import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5F6F8',
        backgroundColor: '#FFFFFF',
    }, 

    header: {
        width: '100%',
        height: 90,
        justifyContent: 'flex-end'
    },

    txtInHeader: {
        color: '#F1FFFF',
        marginLeft: 15,
        color: "white",
        fontSize: 18,
        fontWeight: '500'
    },
    
    body: {
        backgroundColor: '#F5F6F8',
        height: '100%',
    },

    iconInPress: {
        justifyContent: 'center',
        alignItems: 'center', 
        height: 40,
        width: 40,
        backgroundColor: '#E6E6E6',
        borderRadius: 20
    },

    pressbtnOP :{
        height: 90,
        width: '20%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    pressFindMessage:{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
    },

    btnOpts:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 55,
        backgroundColor: '#ffffff'
    },

    txt:{
        fontSize: 17,
        marginLeft: 15,
        flex: 1,
    },

    imageContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
    },

    img:{
        height: 70,
        width: 70,
        padding:10
    },

    line1: {
        backgroundColor: '#FFFFFF',
        width: '13%'
    },

    line2: {
        backgroundColor: '#F1F2F4',
        width: '87%'
    },

    line: {
        flexDirection: 'row'
    },

    button: {
        alignSelf: 'center',
        backgroundColor: '#A8ADB1',
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

})