import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Colors from '../../constant/Colors';
import { useTheme } from "../context/ThemeContext";

const data = [
    { id: 1, title: "Mental Health", description: "Tips and resources for your mental well-being." },
    { id: 2, title: "Financial Tips", description: "Advice for managing your money wisely." },
    { id: 3, title: "Career Advice", description: "Insights to help you grow your career." },
    { id: 4, title: "Physical Well-Being", description: "Guidance on staying physically healthy." },
];

const RenderItem = ({ item }) => {
    const { theme } = useTheme();
    return (
        <View style={styles.item}>
            <Text style={[styles.itemText, themeStyles[theme].sectionTitle]}>{item.title}</Text>
            <Text style={[styles.cardDescription, themeStyles[theme].text]}>{item.description}</Text>
        </View>
    );
};

export default function Resources() {
    const { theme } = useTheme();
    const screenWidth = Dimensions.get('window').width;

    return (
        <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
            <View style={{ paddingHorizontal: 25 }}>
                <Text style={[styles.header, themeStyles[theme].headerTitle]}>Resources</Text>
            </View>
            <View>
                <Carousel
                    loop
                    width={screenWidth}
                    height={650}
                    autoPlay={false}
                    data={data}
                    scrollAnimationDuration={1000}
                    mode="parallax"
                    modeConfig={{ parallaxScrollingScale: 0.9, parallaxScrollingOffset: 30 }}
                    style={{ marginBottom: 20 }}
                    renderItem={({ item }) => <RenderItem item={item} />}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.CREAM,
    },
    item: {
        width: Dimensions.get('window').width,
        height: 650,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 12,
        paddingTop: 20,
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    itemText: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 16,
        color: '#fff',
        marginTop: 5,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 25,
    },
});

const themeStyles = {
    light: {
        container: { backgroundColor: Colors.CREAM },
        headerTitle: { color: Colors.BLACK },
        sectionTitle: { color: Colors.BLACK },
        textInput: { backgroundColor: Colors.WHITE, color: Colors.BLACK },
        button: { backgroundColor: Colors.PRIMARY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.BLACK },
    },
    dark: {
        container: { backgroundColor: Colors.M_CHAR },
        headerTitle: { color: Colors.WHITE },
        sectionTitle: { color: Colors.WHITE },
        textInput: { backgroundColor: Colors.GRAY, color: Colors.WHITE },
        button: { backgroundColor: Colors.GRAY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.WHITE },
    },
    "high-contrast": {
        container: { backgroundColor: "#000000" }, // Black Background
        headerTitle: { color: "#FFFF00" }, // Yellow Title
        sectionTitle: { color: Colors.BLACK }, // Black Section Title
        textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 }, // Yellow Text, Black Background
        button: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" }, // Yellow Button with White Border
        buttonText: { color: "#000000" }, // Black Text for Contrast
        text: { color: Colors.BLACK }, // Yellow Text
    },
};