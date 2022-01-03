import React, { useState, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput, Button } from "react-native-paper";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as Yup from "yup";
import useAuth from '../../hooks/useAuth';
import Toast from 'react-native-root-toast';
import { getMeApi, updateUserApi } from '../../api/user';
import { formStyle } from '../../styles';

export default function ChangeUsername() {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation()
    //console.log(auth);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const response = await getMeApi(auth.token);
                //console.log(response.username);
                await formik.setFieldValue("username", response.username);
            })()
        }, [])
    );

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: async (formData) => {
            setLoading(true);
            //console.log("Formulario enviado...");
            //console.log(formData);
            try {
                const response = await updateUserApi(auth, formData);
                if(response.statusCode) throw "El nombre del usuario ya existe";
                navigation.goBack();
                //console.log("TODO OK");
            } catch (error) {
                Toast.show(error, {
                    position: Toast.positions.CENTER,
                });
                formik.setFieldError("username", true);
                setLoading(false);
            }
        },
    });

    return (
        <View style={styles.content}>
            <TextInput 
                label="Nombre de usuario" 
                style={formStyle.input} 
                onChangeText={(text) => formik.setFieldValue("username", text)}
                value={formik.values.username}
                error={formik.errors.username}
            />
            <Button 
                mode="contained" 
                style={formStyle.btnSucces} 
                onPress={formik.handleSubmit}
                loading={loading}
            >
                CAmbiar nombre de usuario
            </Button>
        </View>
    )
}

function initialValues(){
    return {
        username: "",
    }
}

function validationSchema() {
    return {
        username: Yup.string().min(4, true).required(true),
    }
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
    },
});
