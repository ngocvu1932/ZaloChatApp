import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009AFA',
    },

    header: {
        width: '100%',
        height: 90,
        justifyContent: 'flex-end'
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
    
    body: {
        flex: 1,
        backgroundColor: '#F9FAFE',
        paddingBottom: 200,
    },

    btnDone: {
        alignItems: 'center',  
        height: 45, 
        width: '40%',
        borderRadius: 25,
        justifyContent: 'center'
    }

    
})