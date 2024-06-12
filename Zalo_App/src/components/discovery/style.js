import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009AFA',
    },

    header: {
        width: '100%',
        height: 90,
        alignItems: 'center',
        backgroundColor: '#009AFA',
        justifyContent: 'flex-end'
    },

    txtInHeader: {
        fontSize: 17,
        color: '#F1FFFF',
        height: 35,
        marginLeft: 10,
        flex: 1,
    },
    
    body: {
        flex: 1,
        backgroundColor: '#F4F5F7',
    },

    pressZaloVideo: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 70,
        width: '100%',
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
    }
    
    
})