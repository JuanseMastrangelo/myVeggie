import * as React from 'react';
import { Text, View, StyleSheet, Button, AsyncStorage, Image, Dimensions } from 'react-native';
import * as Permissions from 'expo-permissions';

import { BarCodeScanner } from 'expo-barcode-scanner';

export default class TabOneScreen extends React.Component<any> {
    state = {
        hasCameraPermission: null,
        scanned: false,
    };

    async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }


    render() {
        const { hasCameraPermission, scanned } = this.state;
        const { width, height } = Dimensions.get('window');

        if (hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        }

        const opacity = 'rgba(0, 0, 0, .6)';
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: 'column'
            },
            layerTop: {
                flex: 2,
                backgroundColor: opacity
            },
            layerCenter: {
                flex: 1,
                flexDirection: 'row'
            },
            layerLeft: {
                flex: 1,
                backgroundColor: opacity
            },
            focused: {
                flex: 10
            },
            layerRight: {
                flex: 1,
                backgroundColor: opacity
            },
            layerBottom: {
                flex: 2,
                backgroundColor: opacity
            },
        });

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                }}>
                <BarCodeScanner
                    onBarCodeScanned={this.handleBarCodeScanned}
                    style={{width, height}}
                >
                    <View style={styles.layerTop} />
                    <View style={styles.layerCenter}>
                        <View style={styles.layerLeft} />
                        <View style={styles.focused} />
                        <View style={styles.layerRight} />
                    </View>
                    <View style={styles.layerBottom} />
                </BarCodeScanner>

                {/* {scanned && (
                    <Button
                        title={'Tap to Scan Again'}
                        onPress={() => this.setState({ scanned: false })}
                    />
                )} */}
            </View>
        );
    }

    // Se ejecuta una vez escaneado el barcode o qr
    handleBarCodeScanned = ({ type, data }: { type: any, data: any }) => {
        // this.setState({ scanned: true });
        this.props.navigation.navigate('ScannerDetails', { code: data })
    };
}