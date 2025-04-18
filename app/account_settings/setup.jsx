import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";
import { useTheme } from '../context/ThemeContext';
import i18n from '../i18n';

export default function Setup() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [language, setLanguage] = useState(i18n.language || 'en');

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'es' : 'en';
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
    };

    const resourceOptions = [
        t("Mental Health"),
        t("Financial Tips"),
        t("Career Advice"),
        t("Physical Well-Being")
    ];

    const [selectedResources, setSelectedResources] = useState({});

    useEffect(() => {
        const loadStoredResources = async () => {
            try {
                const stored = await AsyncStorage.getItem("selectedResources");
                if (stored) {
                    setSelectedResources(JSON.parse(stored));
                } else {
                    const defaultState = {};
                    resourceOptions.forEach(opt => defaultState[opt] = false);
                    setSelectedResources(defaultState);
                }
            } catch (err) {
                console.warn("Failed to load resources:", err);
            }
        };

        loadStoredResources();
    }, []);

    const toggleResource = (resourceName) => {
        setSelectedResources(prevState => ({
            ...prevState,
            [resourceName]: !prevState[resourceName]
        }));
    };

    const handleSavePreferences = async () => {
        const selected = resourceOptions.filter(resource => selectedResources[resource]);

        try {
            await AsyncStorage.setItem("selectedResources", JSON.stringify(selectedResources));
            Alert.alert(t("Success"), `${t("Preferences saved!")}\n${t("Selected Resources")}: ${selected.join(', ')}`);
            router.push('/home_screen/home');
        } catch (error) {
            Alert.alert(t("Error"), t("Failed to save preferences. Try again."));
        }
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
            <Text style={[styles.title, themeStyles[theme].title]}>{t("Account Setup")}</Text>

            <View style={styles.settingRow}>
                <Text style={[styles.settingText, themeStyles[theme].text]}>{t("Allow Notifications")}</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    thumbColor={notificationsEnabled ? Colors.PRIMARY : Colors.GRAY}
                />
            </View>

            <View style={styles.settingRow}>
                <Text style={[styles.settingText, themeStyles[theme].text]}>{t("Enable Dark Mode")}</Text>
                <Switch
                    value={theme === "dark"}
                    onValueChange={toggleTheme}
                    thumbColor={theme === "dark" ? Colors.PRIMARY : Colors.GRAY}
                />
            </View>

            <View style={styles.settingRow}>
                <Text style={[styles.settingText, themeStyles[theme].text]}>{t("Enable High Contrast")}</Text>
                <Switch
                    value={theme === "high-contrast"}
                    onValueChange={() =>
                        toggleTheme(theme === "high-contrast" ? "light" : "high-contrast")
                    }
                    thumbColor={theme === "high-contrast" ? Colors.PRIMARY : Colors.GRAY}
                />
            </View>

            <View style={styles.settingRow}>
                <Text style={[styles.settingText, themeStyles[theme].text]}>{t("Language")}: {language === 'en' ? 'English' : 'Español'}</Text>
                <Switch
                    value={language === 'es'}
                    onValueChange={toggleLanguage}
                    thumbColor={language === 'es' ? Colors.PRIMARY : Colors.GRAY}
                />
            </View>

            <View style={styles.settingColumn}>
                <Text style={[styles.settingText, themeStyles[theme].text]}>{t("Preferred Resources")}</Text>
                {resourceOptions.map((resource) => (
                    <View key={resource} style={styles.checkboxRow}>
                        <Checkbox
                            value={selectedResources[resource]}
                            onValueChange={() => toggleResource(resource)}
                            color={selectedResources[resource] ? Colors.PRIMARY : undefined}
                        />
                        <Text style={[styles.checkboxLabel, themeStyles[theme].text]}>{resource}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={[styles.button, themeStyles[theme].button]} onPress={handleSavePreferences}>
                <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>{t("Save")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, themeStyles[theme].button]} onPress={() => router.replace('/')}>
                <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>{t("Log Out")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, themeStyles[theme].button]} onPress={() => router.push("/profile/personal-info")}>
                <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>Personal Information</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.GRAY,
    },
    settingColumn: {
        marginTop: 20,
        width: "100%",
        marginBottom: 20,
    },
    settingText: {
        fontSize: 18,
        marginBottom: 5,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        marginTop: 30,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 18,
        fontWeight: "bold",
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