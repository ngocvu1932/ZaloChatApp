import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        width: "100%",
        height: 90,
        justifyContent: 'flex-end',
    },

    txtInHeader: {
        color: '#F1FFFF',
        marginLeft: 10,
        color: "white",
        fontSize: 18,
    },

    btnChooseMember: {
        flexDirection:'row', 
        alignItems:'center', 
        backgroundColor: '#FFFFFF', 
        height: 70
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },

    modalContent: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    btnPressClose: {
        height: 50, 
        width: 50, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    btnPressOpts: {
        height: 30, 
        width: 30, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#F3F4F8'
    },

    btnPressOpts1: {
        height: 40, 
        justifyContent: 'center',
    }
})