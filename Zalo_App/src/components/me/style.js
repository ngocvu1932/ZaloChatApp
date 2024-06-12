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

    txtInHeader: {
        flex: 1,
        fontSize: 17,
        color: '#F1FFFF',
        height: 30,
        marginLeft: 10,
    }, 
    
    body: {
        flex: 1,
        backgroundColor: '#F1F2F4',
        // backgroundColor: 'red',
        // height: '100%',
        width: '100%',
    },

    pressViewInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 70,
        width: '100%',
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
    },

    avatar: {
        height: 50, 
        width: 50, 
        marginLeft: 15,
        borderRadius: 25,
    },

    txtViewInfo: {
        fontSize: 15,
        opacity: 0.8,
    },

    txtViewNameInfo: {
        fontSize: 20,
        fontWeight: '400',
        marginLeft: 20
    },

    btnChangeAcc: {
        height: 40,
        width: 40,
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },

    pressViewQR: {
        height: 70, 
        width: '100%',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    txtViewQR: {
        fontSize: 18,
        
    },

    txtViewQR1: {
        fontSize: 15,
        marginTop: 5,
    },

    viewMusicTxt: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    percentCloud: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 10
    },

    percentCloud1: {
        height: 5,
        backgroundColor: '#1A66D4',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },

    percentCloud2: {
        height: 5,
        backgroundColor: '#F1F2F4',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },

    btnSetting: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
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


    
})