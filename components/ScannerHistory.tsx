import * as React from 'react';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';


import * as SecureStore from 'expo-secure-store';
import {localStorageKey} from '../keys';

import * as firebase from 'firebase';
import { Layout, Card, Icon, Button, Modal } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';



interface IData {
    Marca: string,
    Nombre: string,
    Tipo: string,
    Imagen: string,
    Code: number | string,
    Vegetariano: string
}
interface IState {
    data: IData[] | null,
    visible: boolean
}


export default class ScannerDetails extends React.Component<any, IState> {

    state: IState = {
        data: null,
        visible: false
    };

    async componentDidMount() {
        this.getDataFromLocal();
    }

    getDataFromLocal = async () => {
        SecureStore.getItemAsync(localStorageKey).then((el: string | null) => {
            if (el!) {
                this.setState({data: JSON.parse(el!).reverse()})
            }
        });
    }

    getPorcentageWindow(porcentage: number, of: number) {
        return (porcentage * of) / 100
    }
    
    cleanHistory() {
        SecureStore.deleteItemAsync(localStorageKey)
        this.setState({data: []})
    }

    TrashIcon = (props: any) => (
        <Icon {...props} name='trash-outline'/>
    );

    RefreshIcon = (props: any) => (
        <Icon {...props} name='refresh-outline'/>
    );
    
    render() {
        const { data } = this.state
        const { width, height } = Dimensions.get('window');


        const styles = StyleSheet.create({
            container: {
                minHeight: 192,
            },
            backdrop: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
        });
                
        return (
            <View style={{ marginTop: 0 }}>
                <ScrollView>
                    <Card style={{width: this.getPorcentageWindow(100, width), marginBottom: 10}}>
                        <View style={{ flexDirection: 'row', width: width - 30, marginHorizontal: 0, justifyContent:'space-between' }}>
                            <Text style={{fontWeight: 'bold', paddingTop: 7}}>Historial</Text>
                            <View style={{flexDirection:'row'}}>
                                <Button style={{marginRight: 0}} status='basic' accessoryLeft={this.RefreshIcon} appearance='ghost' size='small' onPress={() => this.getDataFromLocal()}></Button>
                                <Button status='danger' accessoryLeft={this.TrashIcon} appearance='ghost' size='small' onPress={() => this.setState({visible: true})}></Button>
                            </View>
                        </View>
                    </Card>
                    
                    {
                        data === null ? (
                            <View style={{width, alignItems: 'center' }}>
                                <Text> No existen datos </Text>
                            </View>
                        )
                        :
                        data.map(item => (
                            <Card style={{height: 120, width: this.getPorcentageWindow(100, width), marginBottom: 5}} onPress={() => {this.props.navigation.navigate('ScannerDetails', { code: item!.Code })}}>
                                <View style={{ flexDirection: 'row',justifyContent: 'space-around', width: width }}>
                                    <Image style={{width: this.getPorcentageWindow(30, width), height: 'auto', maxHeight: 100, paddingBottom: 0}} source={{ uri: item!.Imagen }} />
                                    <View  style={{ width: this.getPorcentageWindow(60, width), justifyContent: 'center'}}>
                                        <Text><Text style={{fontWeight: 'bold'}}>Código:</Text> {item!.Code}</Text>
                                        <Text><Text style={{fontWeight: 'bold'}}>Tipo:</Text> {item!.Tipo}</Text>
                                        <Text><Text style={{fontWeight: 'bold'}}>Nombre:</Text> {item!.Nombre}</Text>
                                        <Text><Text style={{fontWeight: 'bold'}}>Marca:</Text> {item!.Marca}</Text>
                                        <Text><Text style={{fontWeight: 'bold'}}>Dieta:</Text> {item!.Vegetariano}</Text>
                                    </View>
                                </View>
                            </Card>
                        ))
                    }
                </ScrollView>

                

                <Modal
                    visible={this.state.visible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.setState({visible: false})}>
                    <Card disabled={true}>
                        <Text>Borrar historial?</Text>
                        <Button onPress={() => {this.setState({visible: false}); this.cleanHistory()}}>
                            Si
                        </Button>
                    </Card>
                </Modal>
            </View>
        );
    }
}