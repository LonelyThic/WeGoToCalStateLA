import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CalendarDays, Clock, MapPin } from "lucide-react-native";
import WebLayout from "../../components/WebLayout";
import { Colors } from "../../constant/Colors";
import { getEvent } from "../../services/events";

const EVENT_CARD_BACKGROUND = '#fff8d6';
const EVENT_TEXT_COLOR = '#000000';

function getEventTitle(event) {
  return (event.title || event.caption || event.text || "Event").trim();
}

export default function EventDetails() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      try {
        const found = await getEvent(eventId);
        setEvent(found ?? null);
      } catch (error) {
        console.warn("Failed to load event detail", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <WebLayout>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.PRIMARY} />
        </View>
      </WebLayout>
    );
  }

  if (!event) {
    return (
      <WebLayout>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Event not found.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/home_screen/events")}
          >
            <Text style={styles.backButtonText}>Back to Events</Text>
          </TouchableOpacity>
        </View>
      </WebLayout>
    );
  }

  const title = getEventTitle(event);
  const description = event.description || (event.text && event.text !== title ? event.text : "");

  return (
    <WebLayout>
      <View style={styles.screen}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>{"\u2190"} Back to Events</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Event Details</Text>
          <View style={{ width: 72 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.eventCard}>
            {event.imageUri ? (
              <Image source={{ uri: event.imageUri }} style={styles.heroImage} />
            ) : null}

            <View style={styles.eventBody}>
              <Text style={styles.eventTitle}>{title}</Text>

              <View style={styles.metaGrid}>
                {event.date ? (
                  <View style={styles.metaItem}>
                    <CalendarDays size={18} color={EVENT_TEXT_COLOR} />
                    <Text style={styles.metaText}>{event.date}</Text>
                  </View>
                ) : null}

                {event.time ? (
                  <View style={styles.metaItem}>
                    <Clock size={18} color={EVENT_TEXT_COLOR} />
                    <Text style={styles.metaText}>{event.time}</Text>
                  </View>
                ) : null}

                {event.location ? (
                  <View style={styles.metaItem}>
                    <MapPin size={18} color={EVENT_TEXT_COLOR} />
                    <Text style={styles.metaText}>{event.location}</Text>
                  </View>
                ) : null}
              </View>

              {description ? (
                <View style={styles.descriptionBlock}>
                  <Text style={styles.sectionLabel}>About this event</Text>
                  <Text style={styles.description}>{description}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </View>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.LIGHT_GRAY,
    gap: 14,
  },
  notFoundText: {
    color: Colors.TEXT,
    fontSize: 18,
    fontWeight: "700",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backText: {
    color: Colors.PRIMARY,
    fontWeight: "700",
  },
  screenTitle: {
    color: Colors.TEXT,
    fontSize: 20,
    fontWeight: "800",
  },
  content: {
    width: "100%",
    maxWidth: 860,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  eventCard: {
    backgroundColor: EVENT_CARD_BACKGROUND,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    overflow: "hidden",
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  heroImage: {
    width: "100%",
    height: 320,
    backgroundColor: Colors.GRAY_200,
    resizeMode: "cover",
  },
  eventBody: {
    padding: 22,
  },
  eventTitle: {
    color: EVENT_TEXT_COLOR,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: EVENT_CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaText: {
    color: EVENT_TEXT_COLOR,
    fontSize: 14,
    fontWeight: "600",
  },
  descriptionBlock: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    paddingTop: 20,
  },
  sectionLabel: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  description: {
    color: EVENT_TEXT_COLOR,
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButtonText: {
    color: Colors.WHITE,
    fontWeight: "700",
  },
});
