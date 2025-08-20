import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InternalLogin: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={{color: "black"}}>Internal Login</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default InternalLogin;