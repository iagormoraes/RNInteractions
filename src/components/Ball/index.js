import React, { useMemo } from 'react';
import { Dimensions } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, useAnimatedStyle, withTiming, runOnJS} from 'react-native-reanimated';

export const BALL_SIZE = 60;

function Ball({ onPositionChange }) {
    const constraints = {
        left: 0,
        top: 0,
        right: Dimensions.get('window').width,
        bottom: Dimensions.get('window').height,
    }

    const initialPosition = useMemo(() => {
        return {
            top: (Dimensions.get('window').height / 2) - BALL_SIZE / 2,
            left: (Dimensions.get('window').width / 2) - BALL_SIZE / 2
        }
    }, []);

    const scaleProps = useMemo(() => {
        return {
            active: 1.5,
            idle: 1,
        }
    }, [])

    const positionX = useSharedValue(initialPosition.left);
    const positionY = useSharedValue(initialPosition.top);
    const scale = useSharedValue(1);

    const onGestureEvent = useAnimatedGestureHandler({
        onStart(_, context) {
            context.offsetX = positionX.value
            context.offsetY = positionY.value

            scale.value = scaleProps.active;
        },
        onActive(event, context) {
            const { top, left, bottom, right } = constraints;
            const newPositionX = context.offsetX + event.translationX * scaleProps.active;
            const newPositionY = context.offsetY + event.translationY * scaleProps.active;

            const isInsideConstraints = newPositionX >= left && newPositionX <= right - BALL_SIZE && newPositionY >= top && newPositionY <= bottom - BALL_SIZE;

            if(!isInsideConstraints) return;

            positionX.value = newPositionX;
            positionY.value = newPositionY;

            runOnJS(onPositionChange)({x: newPositionX, y: newPositionY});
        },
        onEnd() {
            scale.value = scaleProps.idle;
        }
    }, [onPositionChange]);

    const positionStyle = useAnimatedStyle(() => {
        return {
            top: positionY.value,
            left: positionX.value,
            transform: [{scale: withTiming(scale.value)}]
        }
    })

    return (
        <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[{
            width: BALL_SIZE,
            height: BALL_SIZE,
            borderRadius: BALL_SIZE,
            backgroundColor: '#9eddc8',
            position:'absolute',
        }, positionStyle]}/>
        </PanGestureHandler>
    )
}

export default Ball;
