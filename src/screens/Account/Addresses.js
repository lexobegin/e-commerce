import React, { useState, useCallback } from 'react'
import { 
    StyleSheet, 
    View, 
    ScrollView, 
    Text, 
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native'
import { TextInput, Button, IconButton } from "react-native-paper";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { size } from 'lodash';
import AddressList from '../../components/Address/AddressList';
import { getAddressesApi } from "../../api/address";
import { useFormik } from "formik";
import * as Yup from "yup";
import Toast from 'react-native-root-toast';
import { getMeApi, updateUserApi } from '../../api/user';
import useAuth from '../../hooks/useAuth';
import { formStyle } from "../../styles";

export default function Addresses() {
    const [addresses, setAddresses] = useState(null);
    const [reloadAddress, setReloadAddress] = useState(false);
    const { auth } = useAuth();
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            setAddresses(null);
            (async () => {
                const response = await getAddressesApi(auth);
                //console.log(response);
                setAddresses(response);
                setReloadAddress(false);
            })();
        }, [reloadAddress])
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Mis direcciones</Text>
            <TouchableWithoutFeedback 
                onPress={() => navigation.navigate("add-address")}
            >
                <View style={styles.addAddress}>
                    <Text style={styles.addAddressText} >Añadir una direccion</Text>
                    <IconButton icon="arrow-right" color="#000" size={19} />
                </View>
            </TouchableWithoutFeedback>
            {!addresses ? (
                <ActivityIndicator size="large" style={styles.loading} color="#6495ed" />
            ) : size(addresses) === 0 ? (
                <Text style={styles.noAddressText} >Crea tu primera dirección</Text>
            ) : (
                <AddressList 
                    addAddress={addresses}
                    setReloadAddress={setReloadAddress}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 20,
    },
    addAddress: {
        borderWidth: 0.9,
        borderRadius: 5,
        borderColor: "#ddd",
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    addAddressText: {
        fontSize: 16,
    },
    loading: {
        marginTop: 20
    },
    noAddressText: {
        fontSize: 16,
        marginTop: 10,
        textAlign: "center",
    }
});
