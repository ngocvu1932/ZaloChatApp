import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        width: '100%',
        height: 90,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

    pressBack: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 120,
        height: 40,
    },

    txtInHeader: {
        fontSize: 20,
        color: '#F1FFFF',
        marginLeft: 10,
    }, 
    
    body: {
        flex: 1,
        backgroundColor: '#F1F2F4',
    },

    viewShiled: {
        marginLeft: 20,
        // justifyContent: 'center',
    },

    txtViewShiled: {
        fontSize: 18,
        flex: 1,
        marginLeft: 20
    },

    pressShield: {
        // marginTop: 10,
        height: 55, 
        width: '100%',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    txtViewData: {
        fontSize: 15,
        opacity: 0.8
    },

    line1: {
        height: 1,
        backgroundColor: '#FFFFFF',
        width: '15%'
        
    },

    line2: {
        height: 1,
        backgroundColor: '#F1F2F4',
        width: '85%'
    },

    line: {
        flexDirection: 'row'
    },
 
    pressSwitchAcc: {
        marginTop: 9,
        height: 55, 
        width: '100%',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center'
    },

    viewLogout: {
        height: 70, 
        width: '100%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },

    pressLogout: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '85%',
        backgroundColor: '#F1F2F4',
        borderRadius: 25
    }
})