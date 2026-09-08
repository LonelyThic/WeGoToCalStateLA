import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Star,
  Trophy,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { getEvents } from '../../services/events';
import WebLayout from '../../components/WebLayout';

const { width } = Dimensions.get('window');
const DAY_MS = 24 * 60 * 60 * 1000;
const UPCOMING_WINDOW_DAYS = 30;
const MAX_LATER_EVENTS = 9;
const EVENT_CARD_WIDTH =
  width >= 1200 ? 260 : Math.min(320, width - 88);
const LATER_EVENT_CARD_WIDTH =
  width >= 1200 ? 175 : EVENT_CARD_WIDTH;
const LATER_GRID_GAP = 12;
const LATER_GRID_MAX_WIDTH = LATER_EVENT_CARD_WIDTH * 5 + LATER_GRID_GAP * 4;
const EVENT_CARD_BACKGROUND = '#fff8d6';
const EVENT_TEXT_COLOR = '#000000';

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parseEventDate(date) {
  if (!date) return null;
  const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const parsed = isoDateMatch
    ? new Date(
      Number(isoDateMatch[1]),
      Number(isoDateMatch[2]) - 1,
      Number(isoDateMatch[3])
    )
    : new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function getEventTitle(event) {
  return (event.title || event.caption || event.text || '').trim();
}

// ------- Event Card -------
function EventCard({ title, date, location, description, onPress, imageUrl, compact = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={[
        eventStyles.card,
        compact && eventStyles.compactCard,
      ]}
    >
      {/* Image on top */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            eventStyles.eventImage,
            compact && eventStyles.compactImage,
          ]}
        />
      ) : null}

      {/* Text content */}
      <View style={eventStyles.contentRow}>
        <View style={eventStyles.leftAccent} />
        <View style={[eventStyles.inner, compact && eventStyles.compactInner]}>
          <Text style={[eventStyles.title, compact && eventStyles.compactTitle]}>{title}</Text>
          {date ? <Text style={[eventStyles.date, compact && eventStyles.compactDate]}>{date}</Text> : null}
          {location ? (
            <Text style={[eventStyles.location, compact && eventStyles.compactLocation]}>
              {location}
            </Text>
          ) : null}

          {description ? (
            <Text
              numberOfLines={compact ? 2 : 3}
              style={[eventStyles.description, compact && eventStyles.compactDescription]}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function EventsScreen() {
  const [todayInspiration] = useState(
    'Remember: Every small step towards wellness is a victory worth celebrating.'
  );

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [laterEvents, setLaterEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      async function loadEvents() {
        try {
          const events = await getEvents();

          const today = startOfToday();
          const upcomingCutoff = new Date(today.getTime() + UPCOMING_WINDOW_DAYS * DAY_MS);

          const mapped = events
            .map(event => {
              const title = getEventTitle(event);
              const eventDate = parseEventDate(event.date);

              if (!title || !eventDate) return null;

              return {
                id: event.id,
                title,
                date: event.date || '',
                time: event.time || '',
                location: event.location || '',
                description: event.description || (event.text && event.text !== title ? event.text : ''),
                imageUrl: event.imageUri || null,
                eventDate,
              };
            })
            .filter(Boolean)
            .filter(event => event.eventDate >= today)
            .sort((a, b) => a.eventDate - b.eventDate);

          setUpcomingEvents(mapped.filter(event => event.eventDate <= upcomingCutoff));
          setLaterEvents(mapped.filter(event => event.eventDate > upcomingCutoff));
          setCurrentEventIndex(0);
        } catch (e) {
          console.warn('Failed to load events', e);
        }
      }

      loadEvents();
    }, [])
  );

  const scores = [
    { label: 'Daily Check-ins', value: '7 days', icon: Heart, color: Colors.GREEN },
    { label: 'Quizzes Completed', value: '3', icon: Trophy, color: Colors.SECONDARY },
    { label: 'Wellness Score', value: '85%', icon: Star, color: Colors.PRIMARY },
  ];

  const handleNextEvent = () => {
    if (!upcomingEvents.length) return;
    setCurrentEventIndex(prev => (prev + 1) % upcomingEvents.length);
  };

  const handlePrevEvent = () => {
    if (!upcomingEvents.length) return;
    setCurrentEventIndex(prev => (prev - 1 + upcomingEvents.length) % upcomingEvents.length);
  };

  const hasUpcomingEvents = upcomingEvents.length > 0;
  const visibleUpcomingEvents = hasUpcomingEvents
    ? Array.from(
      { length: Math.min(3, upcomingEvents.length) },
      (_, offset) => upcomingEvents[(currentEventIndex + offset) % upcomingEvents.length]
    )
    : [];
  const visibleUpcomingIds = new Set(visibleUpcomingEvents.map(event => event.id));
  const visibleLaterEvents = laterEvents.slice(0, MAX_LATER_EVENTS);

  return (
    <WebLayout>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.replace('/home_screen/home')}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Events & Progress</Text>
            <TouchableOpacity
              onPress={() => router.push('/home_screen/create_event')}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>+ Create</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Daily Inspiration */}
          <View style={styles.inspirationCard}>
            <Text style={styles.inspirationLabel}>Daily Inspiration</Text>
            <Text style={styles.inspirationText}>{todayInspiration}</Text>
          </View>

          {/* Upcoming Events - Carousel */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {upcomingEvents.length} Upcoming Events
            </Text>

            {hasUpcomingEvents ? (
              <>
                <View style={styles.carouselRow}>
                  {/* Left Arrow */}
                  <TouchableOpacity
                    onPress={handlePrevEvent}
                    style={styles.arrowButton}
                    disabled={upcomingEvents.length <= 3}
                  >
                    <ChevronLeft
                      size={26}
                      color={upcomingEvents.length <= 3 ? Colors.GRAY : Colors.PRIMARY}
                    />
                  </TouchableOpacity>

                  <View style={styles.carouselCardsContainer}>
                    {visibleUpcomingEvents.map(event => (
                      <EventCard
                        key={event.id}
                        title={event.title}
                        date={`${event.date}${event.time ? ` at ${event.time}` : ''}`}
                        location={event.location}
                        description={event.description}
                        imageUrl={event.imageUrl}
                        onPress={() =>
                          router.push({
                            pathname: '/home_screen/details',
                            params: { eventId: event.id },
                          })
                        }
                      />
                    ))}
                  </View>

                  {/* Right Arrow */}
                  <TouchableOpacity
                    onPress={handleNextEvent}
                    style={styles.arrowButton}
                    disabled={upcomingEvents.length <= 3}
                  >
                    <ChevronRight
                      size={26}
                      color={upcomingEvents.length <= 3 ? Colors.GRAY : Colors.PRIMARY}
                    />
                  </TouchableOpacity>
                </View>

                {/* Dots indicator */}
                <View style={styles.dotsRow}>
                  {upcomingEvents.map((event, index) => (
                    <View
                      key={event.id}
                      style={[
                        styles.dot,
                        visibleUpcomingIds.has(event.id) && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.noEventsText}>
                No upcoming events yet. Create one to get started!
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Later Events</Text>
            {visibleLaterEvents.length ? (
              <View style={styles.laterEventsGrid}>
                {visibleLaterEvents.map(event => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    date={`${event.date}${event.time ? ` at ${event.time}` : ''}`}
                    location={event.location}
                    description={event.description}
                    imageUrl={event.imageUrl}
                    compact
                    onPress={() =>
                      router.push({
                        pathname: '/home_screen/details',
                        params: { eventId: event.id },
                      })
                    }
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.noEventsText}>
                No events scheduled more than 30 days out yet.
              </Text>
            )}
          </View>

          {/* Progress Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.scoresGrid}>
              {scores.map((score, index) => (
                <View key={index} style={styles.scoreCard}>
                  <View style={styles.scoreBorder} />
                  <View style={styles.scoreContent}>
                    <View
                      style={[
                        styles.scoreIconContainer,
                        { backgroundColor: score.color + '20' },
                      ]}
                    >
                      <score.icon size={24} color={score.color} />
                    </View>
                    <Text style={styles.scoreLabel}>{score.label}</Text>
                    <Text style={[styles.scoreValue, { color: score.color }]}>
                      {score.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </WebLayout>
  );
}

const eventStyles = StyleSheet.create({
  card: {
    width: EVENT_CARD_WIDTH,
    backgroundColor: EVENT_CARD_BACKGROUND,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  compactCard: {
    width: LATER_EVENT_CARD_WIDTH,
  },
  eventImage: {
    width: '100%',
    height: 132,
    resizeMode: 'cover',
  },
  compactImage: {
    height: 94,
  },
  contentRow: {
    flexDirection: 'row',
    backgroundColor: EVENT_CARD_BACKGROUND,
  },
  leftAccent: {
    width: 6,
    backgroundColor: Colors.PRIMARY,
  },
  inner: {
    flex: 1,
    padding: 12,
  },
  compactInner: {
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: EVENT_TEXT_COLOR,
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 13,
    marginBottom: 3,
  },
  date: {
    color: EVENT_TEXT_COLOR,
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 12,
  },
  compactDate: {
    fontSize: 11,
    marginBottom: 3,
  },
  location: {
    color: EVENT_TEXT_COLOR,
    marginBottom: 8,
    fontSize: 12,
  },
  compactLocation: {
    fontSize: 11,
    marginBottom: 6,
  },
  description: {
    color: EVENT_TEXT_COLOR,
    fontSize: 12,
    lineHeight: 17,
  },
  compactDescription: {
    fontSize: 11,
    lineHeight: 15,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.WHITE + '20',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  headerSpacer: {
    width: 40,
  },
  createButton: {
    backgroundColor: Colors.SECONDARY,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  createButtonText: {
    color: Colors.PRIMARY,
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inspirationCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.SECONDARY,
  },
  inspirationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.SECONDARY,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inspirationText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 16,
    textAlign: 'center',
  },
  // carousel
  carouselRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  carouselCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: EVENT_CARD_WIDTH * 3 + 32,
  },
  arrowButton: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    columnGap: 6,
  },
  laterEventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: LATER_GRID_GAP,
    maxWidth: LATER_GRID_MAX_WIDTH,
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.GRAY,
    opacity: 0.4,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.PRIMARY,
    opacity: 1,
  },
  // progress cards
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scoreCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    width: (width - 60) / 2,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreBorder: {
    width: 4,
    backgroundColor: Colors.SECONDARY,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  scoreContent: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  scoreIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 12,
    color: Colors.GRAY,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noEventsText: {
    color: Colors.TEXT_MUTED,
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },

});
