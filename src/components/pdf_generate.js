import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import font from '../assets/fonts/Roboto/Roboto-Medium.ttf';

import logoIp from '../assets/images/logoIp.png';

Font.register({ family: 'Roboto', format: "truetype", src: font });

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFF',
        fontFamily: 'Roboto'
    },
    section: {
        margin: 10,
        padding: 10,
    },
    signature: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },
    signature_text: {
        marginBottom: 20
    }
});

// Create Document Component
const MyDocument = (props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Image src={logoIp} style={{ width: 200, height: 100 }}></Image>
            </View>
            <View style={styles.section}>
                <Text>Data: {props.data}</Text>
            </View>
            <View style={styles.section}>
                <Text>O que foi feito: {props.step_name}</Text>
            </View>
            <View style={styles.section}>
                <Text>Anotações: {props.annotations}</Text>
            </View>
            <View style={styles.section}>
                <Text>Técnico: {props.technician}</Text>
            </View>
            {props.files.map(file => {
                return (
                    <Image key={file} src={file}></Image>
                );
            })}
        </Page>
        <Page size="A4" style={styles.page}>
            <View style={styles.signature}>
                <Text style={styles.signature_text}>Assinatura do cliente</Text>
                <Image src={props.signature} style={{ width: 400, height: 400, borderRadius: 5 }}></Image>
            </View>
        </Page>
    </Document>
);

export default MyDocument
