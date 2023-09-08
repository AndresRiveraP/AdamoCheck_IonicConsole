
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    background:{
        flex:1,
        resizeMode: 'cover',
        justifyContent:'space-around',
    },
    container:{
        justifyContent : 'center',
        alignItems: 'center'
    },
    logoA :{
        maxWidth: '50%',
        maxHeight: '50%',
        resizeMode: 'contain',
        alignSelf : 'center'
    },
    boton:{
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9cd0de',
        borderRadius: 50,
        padding: 20,
        marginTop: '5%',
    },
    boton2:{
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#043655',
        borderRadius: 50,
        padding: 20,
        marginTop: '8%',
    },
    botonAdmin:{
        width: '30%',
        marginTop: 40,
        marginRight: '8%',
        alignSelf:'flex-end',
        backgroundColor: '#FFF',
        borderRadius: 15,
        paddingVertical: 5,
        paddingRight: 15,
        paddingLeft: 15,
    }, 
    profi:{
        maxWidth: 20,
        maxHeight: 20,
        resizeMode: 'contain',
    },
    label:{
        color : '#FFF',
        fontSize: 16,
        paddingHorizontal: 50,
    },
    label2:{
        color : '#000',
        textAlign: 'center',
        fontSize: 16,
    }
});