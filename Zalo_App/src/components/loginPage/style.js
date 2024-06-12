import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', 
    },

    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 80,
        backgroundColor: '#009AFA',
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
        marginBottom: 2
    }, 
    
    body: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
    },

    inputt: {
        width: '90%', 
        fontSize: 17 , 
        height: 40, 
        borderBottomWidth: 1,
        borderBottomColor: '#DFDFDF',
        color: 'black',
    },

    btnLogin: {
        height: 45, 
        marginTop: 40 ,
        width:200, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 25
    }, 

    blue: {
        backgroundColor: '#008FFF'
    },

    gray: {
        backgroundColor: '#C1D4E3'
    },
})