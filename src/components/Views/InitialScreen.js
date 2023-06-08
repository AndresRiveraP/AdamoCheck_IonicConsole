import React from 'react'
import { ImageBackground,StyleSheet} from 'react-native'

const InitialScreen = () => {
  return (
    <ImageBackground
          source={require('./assets/img/imgBG01.png')}
          style={styles.background}
        >

    </ImageBackground>
  )
}


const styles = StyleSheet.create({
    background:{
        flex:1,
        resizeMode: 'cover',
        justifyContent:'center',
    },
})

export default InitialScreen