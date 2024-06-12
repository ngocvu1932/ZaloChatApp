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

    txtInHeader: {
        fontSize: 18,
        color: '#F1FFFF',
        marginLeft: 10,
    },

    btn: {
        width: '45%', 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 10, 
        borderRadius: 15
    },

    btnRecall : {
        height: 33, 
        width: 80, 
        backgroundColor: '#F0F0F9', 
        marginRight: 15, 
        borderRadius: 15, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    btnMain: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop:  10, 
        height: 55
    },

    viewAvt: { 
        height: 45, 
        width: 45, 
        marginLeft: 15,
        borderRadius: 25, 
    }
})