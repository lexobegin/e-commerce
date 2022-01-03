import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Toast from 'react-native-root-toast';
import useAuth from '../../hooks/useAuth';
import { loginApi } from '../../api/user';
import { formStyle } from '../../styles';

export default function LoginForm(props) {
    const { changeForm } = props;
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    //const auth = useAuth();
    //console.log(auth);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: async (formData) => {
            //console.log("Formulario enviado");
            //console.log(formData);
            setLoading(true);
            try {
                const response = await loginApi(formData);
                if (response.statusCode) throw "Error en el usuario o contraseña";
                //console.log(response);
                login(response);
            } catch (error) {
               Toast.show(error, {
                   position: Toast.positions.CENTER,
               });
               setLoading(false);
            }
        },
    });

    return (
        <View>
            <TextInput 
                label="Email o Username" 
                style={formStyle.input} 
                onChangeText={(text) => formik.setFieldValue("identifier", text)}
                value={formik.values.identifier}
                error={formik.errors.identifier}
            />
            <TextInput 
                label="Contraseña" 
                style={formStyle.input}
                onChangeText={(text) => formik.setFieldValue("password", text)}
                value={formik.values.password}
                error={formik.errors.password}
                secureTextEntry
            />
            <Button 
                mode='contained' 
                style={formStyle.btnSucces}
                onPress={formik.handleSubmit}
                loading={loading}
            >
                Entrar
            </Button>
            <Button 
                mode='text' 
                style={formStyle.btnText}
                labelStyle={formStyle.btnTextLabel}
                onPress={changeForm}
            >
                Registrarse
            </Button>
        </View>
    )
}

function initialValues() {
    return {
        identifier: "",
        password: ""
    }
}

function validationSchema() {
    return {
        identifier: Yup.string().required(true),
        password: Yup.string().required(true),
    }
}
