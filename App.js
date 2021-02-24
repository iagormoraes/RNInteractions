import React, {useRef, useCallback, useState, useEffect} from 'react';
import {Provider} from "react-redux";
import { View } from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, interpolate, interpolateColor, withTiming} from 'react-native-reanimated'

import store from './src/store';
import Ball from "./src/components/Ball";

const App = () => {
    const insideRef = useRef(null);
    const [inside, setInside] = useState({width: 0, height: 0, x: 0, y:0});
    const [ isInside, setIsInside] = useState(false);

    const insideAnimation = useSharedValue(0);

    const insideStyle = useAnimatedStyle(() => {
        const interpolation = interpolateColor(insideAnimation.value, [0, 1], ["#ff0000", "#00ff00"], "RGB")
        return {
            backgroundColor: interpolation
        }
    })

    const textStyle = useAnimatedStyle(() => {
        const interpolation = interpolateColor(insideAnimation.value, [0, 1], ["#ccc", "#00ff00"], "RGB")
        const fontSize = interpolate(insideAnimation.value, [0, 1], [32, 60])

        return {
            fontSize,
            color: interpolation
        }
    })

    const handleBallPositionChange = useCallback(({x, y}) => {
        const xOffset = x + 60;
        const yOffset = y + 60;

        const insideWidth = inside.width + inside.x;
        const insideHeight = inside.height + inside.y;

        const isInside = xOffset >= inside.x && xOffset <= insideWidth && yOffset >= inside.y && yOffset <= insideHeight;

        insideAnimation.value = withTiming(isInside ? 1 : 0)

        setIsInside(isInside);
    }, [inside])

    useEffect(() => {
        insideRef.current?.measure((x,y,width,height,pageX, pageY) => {
            setInside(prev => {
                if(pageX !== inside.x || pageX === 0 || pageY !== inside.y || pageY === 0) {
                    return {
                        width,
                        height,
                        x: pageX,
                        y: pageY
                    }
                }

                return prev;
            })
        });
    }, [inside]);

  return (
      // <Provider store={store}>
        <View style={{flex: 1}}>
            <Animated.Text style={[{
                position:'absolute',
                top: 100,
                alignSelf: 'center',
                textAlign:'center',
            }, textStyle]}>
                {isInside ? "PASSED" : "Put the ball inside"}
            </Animated.Text>
          <Ball onPositionChange={handleBallPositionChange}/>
          <Animated.View
              ref={insideRef}
              style={[{
              position:'absolute',
              bottom: 20,
              left: '5%',
              width: '90%',
              height: 200,
              zIndex: -1
          }, insideStyle]}/>
        </View>
      // </Provider>

  );
};

export default App;
