import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#E2E9F1',
    },

    header: {
        width: '100%',
        height: 90,
        justifyContent: 'flex-end',
    },

    txtInHeader: {
        flex: 1,
        fontSize: 17,
        color: '#F1FFFF',
        width: '60%',
        height: 30,
        marginLeft: 10,
    },

    btnWrapper: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        height: 50,
    },

    btnTxt: {
        fontSize: 17,
        fontWeight: '400', 
        marginLeft: 20,
    },

    viewIcon: {
        height: 35,
        width: 35,
        borderRadius: 15,
        backgroundColor: "#0091FF", 
        alignItems: "center",
        justifyContent: "center",
    },

    btnSelect: {
        flexDirection: 'row', 
        justifyContent: 'center',
        backgroundColor: "#E6E4EA",  
        width: 100, 
        height: 40, 
        borderRadius: 30, 
        marginLeft: 15, 
        marginBottom: 2,
        alignItems: 'center',
    },
    
    line: {
        flexDirection: 'row',
        backgroundColor: '#E1E1E1'
    },

    btnItem: {
        marginTop: 10, 
        height: 60, 
        width: '100%', 
        justifyContent: 'center'
    },

    btnIcon: {
        height: 40, 
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },

    avtGroup: {
        height: 30, 
        width: 30, 
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFFFFF'
    },

    position0: {
        position: 'absolute',
        top: 0,
        left: 15,
        zIndex: 6
    },

    position1: {
        position: 'absolute',
        bottom: 7,
        left: 3,
        zIndex: 5
    },

    position2: {
        position: 'absolute',
        bottom: 7,
        right: 3,
        zIndex: 4
    },

    position0_1: {
        position: 'absolute',
        top: 3,
        left: 3,
        zIndex: 6
    },

    position1_1: {
        position: 'absolute',
        top: 3,
        right: 3,
        zIndex: 5
    },

    position2_1: {
        position: 'absolute',
        bottom: 3,
        left: 3,
        zIndex: 3
    },

    position3_1: {
        position: 'absolute',
        bottom: 3,
        right: 3,
        zIndex: 4
    },

    btnJoinGroupChat: {
        height: 80, 
        marginTop: 5, 
        justifyContent: 'center', 
        flexDirection: 'row', 
        alignItems: 'center'
    }
})