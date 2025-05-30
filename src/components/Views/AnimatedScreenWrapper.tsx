import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedScreenWrapperProps {
  children: React.ReactNode;
}

const AnimatedScreenWrapper: React.FC<AnimatedScreenWrapperProps> = ({ children }) => {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }]
        }
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AnimatedScreenWrapper;