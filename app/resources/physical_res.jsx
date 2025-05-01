import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Colors from '../../constant/Colors';
import { useTheme } from "../context/ThemeContext";

const data = [
    {
        id: 1,
        title: "MyHealth LA",
        description: "Free healthcare for low-income residents.",
        route: "physical_res",
        icon: "heart",
        resources: [{ label: "dhs.lacounty.gov", url: "https://dhs.lacounty.gov" }]
    },
    {
        id: 2,
        title: "LA Parks & Rec",
        description: "County fitness and recreation centers.",
        route: "physical_res",
        icon: "leaf",
        resources: [{ label: "parks.lacounty.gov", url: "https://parks.lacounty.gov" }]
    },
    {
        id: 3,
        title: "CSULA Health Services",
        description: "Campus wellness and medical services.",
        route: "physical_res",
        icon: "medkit",
        resources: [{ label: "csula.edu", url: "https://www.calstatela.edu" }]
    },
    {
        id: 4,
        title: "Metro Bike Program",
        description: "Transit-integrated cycling and bike share.",
        route: "physical_res",
        icon: "bicycle",
        resources: [{ label: "bike.metro.net", url: "https://bike.metro.net" }]
    }
];

const RenderItem = ({ item }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity onPress={() => item.resources?.[0]?.url && Linking.openURL(item.resources[0].url)}>
            <View style={styles.item}>
                <Ionicons name={item.icon} size={128} color={themeStyles[theme].sectionTitle.color} style={{ marginBottom: 20 }} />
                <Text style={[styles.itemText, themeStyles[theme].sectionTitle]}>{item.title}</Text>
                <Text style={[styles.cardDescription, themeStyles[theme].text]}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default function Resources() {
    const { theme } = useTheme();
    const screenWidth = Dimensions.get('window').width;

    return (
        <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
            <View style={{ paddingHorizontal: 25 }}>
                <Text style={[styles.header, themeStyles[theme].headerTitle]}>Physical Resources</Text>
            </View>
            <View>
                <Carousel
                    loop
                    width={screenWidth}
                    height={600}
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
        height: 600,
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
        iconColor: Colors.BLACK,
    },
    dark: {
        container: { backgroundColor: Colors.M_CHAR },
        headerTitle: { color: Colors.WHITE },
        sectionTitle: { color: Colors.WHITE },
        textInput: { backgroundColor: Colors.GRAY, color: Colors.WHITE },
        button: { backgroundColor: Colors.GRAY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.WHITE },
        iconColor: Colors.WHITE,
    },
    "high-contrast": {
        container: { backgroundColor: "#000000" },
        headerTitle: { color: "#FFFF00" },
        sectionTitle: { color: Colors.BLACK },
        textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 },
        button: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" },
        buttonText: { color: "#000000" },
        text: { color: Colors.BLACK },
        iconColor: "#FFFF00",
    },
};