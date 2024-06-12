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
        backgroundColor: '#FFFFFF',
        alignItems: 'center'
    },

    pressBack: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 250,
        height: 40,
    },

    txtInHeader: {
        fontSize: 18,
        color: '#F1FFFF',
        marginLeft: 10,
    }, 

    textNameI: {
        borderBottomWidth: 1, 
        borderBottomColor: '#1ED0F1', 
        height: 40,
        width: '100%',
        fontSize: 16,
        marginTop: 5
    },

    blue: {
        backgroundColor: '#127FFF'
    },

    gray: {
        backgroundColor: '#9FE1FF'
    },

    texxt: {
        fontSize: 15
    },

    btnRe: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 200
    }
})