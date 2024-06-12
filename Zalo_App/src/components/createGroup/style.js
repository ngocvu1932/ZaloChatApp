import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    header: {
        width: "100%",
        height: 90,
        backgroundColor: '#F7F7F7',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },

    body: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    txtInHeader: {
        color: '#F1FFFF',
        marginLeft: 15,
        color: "white",
        fontSize: 18,
        fontWeight: '500'
    },

    textInputNameGroup: { 
        marginLeft: 15, 
        fontSize: 18, 
        color: 'black', 
        width: '75%', 
        height: 45 
    },

    btnChangeStyleKeyboard: {
        marginLeft: -35, 
        height: 20, 
        width: 30, 
        borderWidth: 1, 
        borderColor: '#878789', 
        borderRadius: 5, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    textInputSearch: {
        backgroundColor: '#FAFAFA', 
        width: '90%', 
        height: 35, 
        borderRadius: 10, 
        fontSize: 17, 
        paddingLeft: 35
    },

    btnChooseMember: {
        marginBottom: 5, 
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center',
        zIndex: 10
    },

    viewCheck: {
        height: 23, 
        width: 23, 
        borderRadius: 20, 
        borderColor: '#D5D6D8', 
        borderWidth: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    viewModal: {
        position: 'absolute',
        bottom: 0, 
        left: 0,
        right: 0, 
        backgroundColor: '#F7F7F7',
        height: 90,
        justifyContent: 'flex-start',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },

    btnCreateGroup: {
        height: 55, 
        width: 55, 
        borderRadius: 30, 
        backgroundColor: '#1095FE', 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    btnChooseImage: {
        height: 60, 
        width: 60, 
        borderRadius: 30, 
        backgroundColor: '#ECF0F3', 
        justifyContent: 'center', 
        alignItems: 'center'
    }

})