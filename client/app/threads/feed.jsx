import React from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useThreads } from "./threadStore";
import { Colors } from "../../constant/Colors";

function ThreadItem({ item, onPress, onLike }) {
  const title =
    item.caption ||
    item.text ||
    (item.imageUri ? "New event shared" : "New thread");

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {item.imageUri ? (
        <Image
          source={{ uri: item.imageUri }}
          style={styles.image}
        />
      ) : null}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.metaRow}>
        {item.date ? (
          <Text style={styles.metaText}>{item.date}</Text>
        ) : null}
        {item.time ? (
          <Text style={styles.metaText}>
            {item.date ? " • " : ""}
            {item.time}
          </Text>
        ) : null}
        {item.location ? (
          <Text style={styles.metaText}> • {item.location}</Text>
        ) : null}
      </View>

      <View style={styles.footerRow}>
        <TouchableOpacity
          onPress={onLike}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={styles.likesText}>❤ {item.likes ?? 0}</Text>
        </TouchableOpacity>
        <Text style={styles.metaText}>
          {(item.replies?.length ?? 0)} replies
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ThreadFeed() {
  const { state, actions } = useThreads();
  const router = useRouter();

  if (state.loading && !state.threads.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BACKGROUND_SECONDARY }}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Threads</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => router.push("/threads/composer")}
        >
          <Text style={styles.newButtonText}>+ New thread</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...state.threads].sort(
          (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
        )}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ThreadItem
            item={item}
            onPress={() =>
              router.push({
                pathname: "/threads/detail",
                params: { threadId: item.id },
              })
            }
            onLike={() => actions.likeThread(item.id)}
          />
        )}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={() => (
          <View style={{ padding: 16 }}>
            <Text style={{ color: Colors.TEXT_MUTED }}>
              No threads yet. Be the first to post!
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.TEXT,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  newButtonText: {
    color: Colors.WHITE,
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    backgroundColor: Colors.GRAY_900,
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: Colors.GRAY_800,
    marginBottom: 10,
  },
  title: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  metaText: {
    color: Colors.TEXT_MUTED,
    fontSize: 13,
  },
  footerRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  likesText: {
    color: Colors.SECONDARY,
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
