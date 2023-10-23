import { ImageBackground, Modal, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import image from "../assets/coverSong.jpg";

export default function AlbumList({
  albumListOpen,
  setAlbumListOpen,
  songs,
  playSong,
  setListOfSongsIndex,
}) {
  const handleListSongs = () => {
    setAlbumListOpen(false);
    // setListOfSongsIndex(1);
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={albumListOpen}
      //   onRequestClose={handleCloseBottomSheet}
    >
      <View style={{ backgroundColor: "pink", flex: 1, padding: 10 }}>
        <Pressable style={{ width: "10%" }}>
          <MaterialIcons
            color="black"
            name="arrow-back"
            size={32}
            onPress={handleListSongs}
          />
        </Pressable>
        <View
          style={{ marginTop: 30, padding: 10, flexDirection: "row", gap: 20 }}
        >
          <ImageBackground source={image} style={{ width: 120, height: 120 }} />
          <View>
            <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 20 }}>
              Old Hindi Songs
            </Text>
            <View
              style={{
                backgroundColor: "purple",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "white" }}>Play</Text>
            </View>
          </View>
        </View>
        {songs.map((eachSong, id) => {
          return (
            <Pressable
              style={{ padding: 10 }}
              key={id}
              onPress={() => playSong(eachSong)}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <ImageBackground
                  source={eachSong.imagePath}
                  style={{ width: 50, height: 50 }}
                />
                <View style={{ gap: 3 }}>
                  <Text style={{ fontSize: 17 }}>{eachSong.title}</Text>
                  <Text style={{ opacity: 0.4, fontSize: 12 }}>
                    {eachSong.artist}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}
