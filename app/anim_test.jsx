import React from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import data from '../assets/data/data';
import Colors from "../constant/Colors";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function AnimTest() {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const x = useSharedValue(0);
    
    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            x.value = event.contentOffset.x;
        },
    });

    const RenderItem = ({ item, index }) => {
        const imageAnimationStyle = useAnimatedStyle(() => {
            const opacityAnimation = interpolate(
                x.value,
                [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                ],
                [0, 1, 0],
                Extrapolation.CLAMP,
            );
            
            return {
                opacity: opacityAnimation,
                width: SCREEN_WIDTH * 0.8,
                height: SCREEN_WIDTH * 0.8,
                resizeMode: 'contain',
            };
        });
        
        return (
            <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}> 
                <Animated.Image source={item.image} style={imageAnimationStyle} />
                <View>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemText}>{item.text}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <AnimatedFlatList
                onScroll={onScroll}
                data={data}
                renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
                keyExtractor={(item, i) => `${i}`} 
                horizontal
                bounces={false}
                scrollEventThrottle={16}
                pagingEnabled
                style={{ display: 'flex' }}
                showsHorizontalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.CREAM,
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: Colors.SECONDARY,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    itemTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        textAlign: 'center',
        marginVertical: 10,
    },
    itemText: {
        color: Colors.BLACK,
        textAlign: 'center',
        lineHeight: 20,
        marginHorizontal: 35,
    },
});
