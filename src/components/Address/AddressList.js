import React from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { map } from "lodash";
import useAuth from "../../hooks/useAuth";
import { deleteAddressApi } from "../../api/address";
import colors from "../../styles/colors";

export default function AddressList(props) {
    const { addAddress, setReloadAddress } = props;
    const { auth } = useAuth();
    const navigation = useNavigation();

    const deleteAddressAlert = (address) => {
      Alert.alert(
        "Eliminando direccion",
        `¿Estas seguro de que quieres eliminar la direccion ${address.title}?`,
        [
          {
            text: "NO",
          },
          {
            text: "SI",
            onPress: () => deleteAddress(address._id),//console.log("Eliminada...")
          },
        ],
        { cancelable: false }
      );
    };

    const deleteAddress = async (idAddress) => {
      try {
        await deleteAddressApi(auth, idAddress);
        setReloadAddress(true);
      } catch (error) {
        console.log(error);
      }
    }

    const goToUpdateAddress = (idAddress) => {
      navigation.navigate("add-address", { idAddress })
    }

    return (
        <View style={styles.container}>
            {map(addAddress, (address) => (
                <View key={address._id} style={styles.address}>
                  <Text style={styles.title}>{address.title}</Text>
                  <Text>{address.name_lastname}</Text>
                  <Text>{address.address}</Text>
                  <View style={styles.blockLine}>
                    <Text>{address.state}, </Text>
                    <Text>{address.city}, </Text>
                    <Text>{address.postal_code}</Text>
                  </View>
                  <Text>{address.country}</Text>
                  <Text>Numero de telefono: {address.phone}</Text>
                  <View style={styles.actions}>
                    <Button 
                      mode="contained" 
                      color={colors.primary}
                      onPress={() => goToUpdateAddress(address._id)}
                    >
                      Editar
                    </Button>
                    <Button 
                      mode="contained" 
                      color={colors.secondary}
                      onPress={() => deleteAddressAlert(address)} 
                    >
                      Eliminar
                    </Button>
                  </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 30,
    },
    address: {
      borderWidth: 0.9,
      borderRadius: 5,
      borderColor: "#ddd",
      paddingHorizontal: 15,
      paddingVertical: 15,
      marginBottom: 15,
    },
    title: {
      fontWeight: "bold",
      paddingBottom: 5,
    },
    blockLine: {
      flexDirection: "row",
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 30,
    },
  });
