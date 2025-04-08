import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constant/Colors';
import { ThemeProvider, useTheme } from "../context/ThemeContext";

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
            <Text style={[styles.itemText, themeStyles[theme].title]}>{item.title}</Text>
            <Text style={[styles.cardDescription, themeStyles[theme].text]}>{item.description}</Text>
        </View>
    );
};

export default function Resources() {
    const { theme } = useTheme();
    return (
        <ThemeProvider>
            <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
                <FlatList
                    data={data}
                    renderItem={({ item }) => <RenderItem item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    bounces={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer} // No extra bottom padding here
                />
                <FlatList
                    data={data}
                    renderItem={({ item }) => <RenderItem item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    bounces={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer} // No extra bottom padding here
                />
                <FlatList
                    data={data}
                    renderItem={({ item }) => <RenderItem item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    bounces={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.lastScrollContainer} // Extra bottom padding only here
                />
            </SafeAreaView>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        width: '100%',
        backgroundColor: Colors.CREAM,
    },
    scrollContainer: {
        paddingVertical: 20,
        paddingLeft: 15,
        // No bottom padding for intermediate FlatLists
    },
    lastScrollContainer: {
        paddingVertical: 20,
        paddingLeft: 15,
        paddingBottom: 100, // Only the last FlatList gets the extra bottom padding
    },
    item: {
        width: 250,
        marginRight: 15,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 12,
        padding: 20,
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
});

const themeStyles = {
    light: {
        container: { backgroundColor: Colors.CREAM },
        title: { color: Colors.BLACK },
        textInput: { backgroundColor: Colors.WHITE, color: Colors.BLACK },
        button: { backgroundColor: Colors.PRIMARY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.BLACK },
    },
    dark: {
        container: { backgroundColor: Colors.M_CHAR },
        title: { color: Colors.WHITE },
        textInput: { backgroundColor: Colors.GRAY, color: Colors.WHITE },
        button: { backgroundColor: Colors.GRAY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.WHITE },
    },
    "high-contrast": {
        container: { backgroundColor: "#000000" }, // Black Background
        title: { color: "#FFFF00" }, // Yellow Title
        textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 }, // Yellow Text, Black Background
        button: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" }, // Yellow Button with White Border
        buttonText: { color: "#000000" }, // Black Text for Contrast
        text: { color: "#FFFF00" }, // Yellow Text
    },
};