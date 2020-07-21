import * as React from 'react';
import { Text, View, StyleSheet, Image, Dimensions, CheckBox } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';


import * as SecureStore from 'expo-secure-store';
import {localStorageKey} from '../keys';

import * as firebase from 'firebase';
import { Layout, Card, Icon, Button, Modal, Input, Select, SelectItem, IndexPath } from '@ui-kitten/components';



interface IData {
    Marca: string,
    Nombre: string,
    Tipo: string,
    Imagen: string,
    Code?: string,
    Vegetariano: string
}

interface IState {
    data: IData | null,
    visible: boolean,
    nombre: string,
    marca: string,
    vegano: any,
    tipo: any
}

const TiposProductos = ['Galletitas', 'Lacteos', 'Comida', 'Golosinas', 'Otros']
const TiposProductosVegetariano = ['Carnivoro', 'OvoLacteo', 'Vegano']

export default class ScannerDetails extends React.Component<any, IState> {

    state: IState = {
        data: null,
        visible: false,
        nombre: '',
        marca: '',
        vegano: new IndexPath(0),
        tipo: new IndexPath(0),
    };

    async componentDidMount() {
        this.getDataFromDatabase();
    }

    getDataFromDatabase = async () => {
        const { code } = this.props.route.params
        firebase.database().ref('productos/' + code).on('value', (snapshot) => {
            this.setState({ data: snapshot.val() })
            if (!snapshot.val()) { // Si no existe en la base de datos lo creamos
                this.setState({ visible: true })
            } else {
                this.saveDataInStorage(snapshot.val())
            }
        });
    }

    getPorcentageWindow(porcentage: number, of: number) {
        return (porcentage * of) / 100
    }

    
    // Guarda la data de manera local para el historial
    saveDataInStorage = async (data: IData) => {
        const { code } = this.props.route.params
        SecureStore.getItemAsync(localStorageKey).then((el: string | null) => {
            let dataStore = []
            if (el) {
                dataStore = JSON.parse(el!);
            }
            if (data) {
                data.Code = code
                dataStore.push(data)
            }
            if (dataStore.length > 10) {
                dataStore.shift()
            }
            SecureStore.deleteItemAsync(localStorageKey)
            SecureStore.setItemAsync(localStorageKey, JSON.stringify(dataStore))
            
        });
    }


    newProduct() {
        const { code } = this.props.route.params
        firebase.database().ref('productos/' + code).set({
            Marca: this.state.marca,
            Nombre: this.state.nombre,
            Tipo: TiposProductos[this.state.tipo!.row],
            Vegetariano: TiposProductosVegetariano[this.state.vegano!.row],
            Imagen: '',
        });

        this.setState({
            nombre: '',
            marca: '',
            vegano: new IndexPath(0),
            tipo: new IndexPath(0)
        })
    }
    

    BackIcon = (props: any) => (
        <Icon {...props} name='arrow-back-outline'/>
    );

    render() {
        const { data } = this.state
        const { code } = this.props.route.params
        const { width, height } = Dimensions.get('window');

        const displayValueTiposProductos = TiposProductos[this.state.tipo!.row];
        const displayValueTiposProductosVegetariano = TiposProductosVegetariano[this.state.vegano!.row];
        
        const styles = StyleSheet.create({
            container: {
                minHeight: 192,
            },
            backdrop: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
        });
                
        return (
            <View style={{ marginTop: 30 }}>
                <Card style={{width: this.getPorcentageWindow(100, width), marginBottom: 10}}>
                    <View style={{ flexDirection: 'row', width: width, marginHorizontal: -20 }}>
                        <Button accessoryLeft={this.BackIcon} appearance='ghost' size='small' onPress={() => this.props.navigation.navigate('Root')}></Button>
                        <Text style={{fontWeight: 'bold', paddingTop: 7}}>Scanner detalles</Text>
                    </View>
                </Card>
                {
                    data === null ? (
                        <View style={{width, alignItems: 'center' }}>
                            <Text> No existen datos </Text>
                        </View>
                    )
                    :
                    (
                        <Layout level='1'>
                            <Card>
                                <Text>{data!.Tipo} ({code})</Text>
                            </Card>

                            <Card>
                                <View style={{ flexDirection: 'row',justifyContent: 'space-around', width: width }}>
                                    <Image style={{width: this.getPorcentageWindow(30, width), height: 100}} source={{ uri: data!.Imagen }} />
                                    <View  style={{ width: this.getPorcentageWindow(60, width), justifyContent: 'center'}}>
                                        <Text><Text style={{fontWeight: 'bold'}}>Nombre:</Text> {data!.Nombre}</Text>
                                        <Text><Text style={{fontWeight: 'bold'}}>Marca:</Text> {data!.Marca}</Text>
                                        <Text><Text style={{fontWeight: 'bold'}}>Dieta:</Text> {data!.Vegetariano}</Text>
                                    </View>
                                </View>
                            </Card>
                        </Layout>
                    )
                }

                

                

                <Modal
                    visible={this.state.visible}
                    backdropStyle={styles.backdrop}
                    style={{ width:  this.getPorcentageWindow(90, width), minHeight: this.getPorcentageWindow(50, height)}}
                    onBackdropPress={() => this.setState({visible: false})}>
                    <Card disabled={true}>
                        <Layout style={{flexDirection: 'row'}} level='1'>
                            <Input
                                style={{flex: 1, margin: 2}}
                                disabled={true}
                                value={code}
                            />
                        </Layout>
                        <Layout style={{flexDirection: 'row'}} level='1'>
                            <Input
                                style={{flex: 1, margin: 2}}
                                placeholder='Nombre'
                                onChangeText={nextValue => this.setState({nombre: nextValue})}
                            />

                            <Input
                                style={{flex: 1, margin: 2}}
                                placeholder='Marca'
                                onChangeText={nextValue => this.setState({marca: nextValue})}
                            />
                        </Layout>
                        <Layout style={{flexDirection: 'row'}} level='1'>
                            <Select
                                style={{flex: 1, margin: 2}}
                                selectedIndex={this.state.vegano}
                                value={displayValueTiposProductosVegetariano}
                                onSelect={index => this.setState({vegano: index})}>
                                {TiposProductosVegetariano.map(title => <SelectItem title={title}/>)}
                            </Select>
                            <Select
                                style={{flex: 1, margin: 2}}
                                value={displayValueTiposProductos}
                                selectedIndex={this.state.tipo}
                                onSelect={index => this.setState({tipo: index})}>
                                {TiposProductos.map(title => <SelectItem title={title}/>)}
                            </Select>
                        </Layout>
                        <Layout style={{flexDirection: 'row', marginTop: 50}} level='1'>
                            <Button status='danger' style={{flex: 1, margin: 2}} onPress={() => {this.setState({visible: false});}}>
                                Cancelar
                            </Button>
                            <Button style={{flex: 1, margin: 2}} onPress={() => {this.setState({visible: false}); this.newProduct()}}
                            disabled={!this.state.marca || !this.state.nombre || !code  }>
                                Guardar
                            </Button>
                        </Layout>
                    </Card>
                </Modal>
            </View>
        );
    }
}