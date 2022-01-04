import Def from "./Def";
import RNFetchBlob from "rn-fetch-blob";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import {Alert, Platform} from 'react-native';
import FlatController from '../controller/FlatController'

const PRODUCT_TYPE = 0;
const DESIGN_TYPE = 1;
const REPAIR_TYPE = 2;

export class OfflineHelper {
    static getDownloadProduct(product){

    }
    static offlineProductData = {};
    static offlineDesignData = {};
    static offlineRepairData = {};
    static offlineFlatData = {};
    static downloadProductList;
    static downloadDesignList;
    static downloadRepariItemInflat;

    static offlineFlatDataArr = [];
    static offlineRequestTree = {};

    static flatChangeData={}; // Lưu danh sách thay đổi trong quá trình làm việc offline
    static requestChangeData=[]; // lưu danh sách request được thêm vào dữ liệu offline.
    static pifChangeData={}; // Lưu danh sách các PIF thay đổi trong tương tác offline.


    static convertObjectTreeToArray(obj){
        let rs= [];
        let cloneObj = {... obj};
        for (const key in cloneObj){

            let flat = cloneObj[key];
            let cloneFlat = JSON.parse(JSON.stringify(flat));
            // Object.assign(cloneFlat, flat);
            rs.push(cloneFlat);
        }
        return rs;
    }

    static initOfflineMode = async () => {
        console.log('Init offline data');
        OfflineHelper.offlineRequestTree = {... Def.requestRepairsTree};

        console.log('OfflineRequestTree : ' + JSON.stringify(OfflineHelper.offlineRequestTree));
        // if(OfflineHelper.offlineRequestTree && OfflineHelper.offlineRequestTree[7930]){
        //     console.log('Offline Request Tree' + OfflineHelper.offlineRequestTree[7930].length);
        // }

        OfflineHelper.pifChangeData = {};
        await AsyncStorage.setItem('pifChangeData',JSON.stringify(OfflineHelper.pifChangeData));
        await AsyncStorage.setItem('offlineRequestTree',JSON.stringify(OfflineHelper.offlineRequestTree));
        if (!OfflineHelper.offlineFlatData || JSON.stringify(OfflineHelper.offlineFlatData) === JSON.stringify({})) {
            if(!Def.user_info)
                Def.user_info = JSON.parse(await AsyncStorage.getItem('user_info'));
            let offlineFlatDataStr = await  AsyncStorage.getItem('offlineFlatData');
            OfflineHelper.offlineFlatData = offlineFlatDataStr ?JSON.parse(offlineFlatDataStr) : {};
        }

        for (const key in OfflineHelper.offlineFlatData){
            // console.log('OfflineHelper.offlineFlatData : Update : ' + OfflineHelper.offlineFlatData[key].update);
        }
        if(Array.isArray(OfflineHelper.offlineFlatDataArr)){
            OfflineHelper.offlineFlatDataArr.forEach(item => {
                console.log('Update from offline data Before : --' + item['update']);
            });
        }



        OfflineHelper.offlineFlatDataArr = OfflineHelper.convertObjectTreeToArray(OfflineHelper.offlineFlatData);

        if(Array.isArray(OfflineHelper.offlineFlatDataArr)){
            OfflineHelper.offlineFlatDataArr.forEach(item => {
                console.log('Update from offline data : --' + item['update']);
            });
        }
        await  AsyncStorage.setItem('offlineFlatDataArr',JSON.stringify(OfflineHelper.offlineFlatDataArr));
    }


    static updateOfflineRepairItem (repairItem) {
        if(OfflineHelper.offlineRepairData){
            OfflineHelper.offlineRepairData[repairItem.id] = repairItem;
        }
    }
    static getExtention(filename)  {
        // To get the file extension
        return /[.]/.exec(filename) ?
            /[^.]+$/.exec(filename) : undefined;
    };
    static downloadRepairItemImage = (repairItem = null, callback, falseCallback = null) => {
        console.log('Download Repair item + ' + repairItem.id);
        return OfflineHelper.downloadImage(repairItem, callback, falseCallback , REPAIR_TYPE);
    }


    static downloadDesignImage = (design = null, callback, falseCallback = null) => {
        return OfflineHelper.downloadImage(design, callback, falseCallback , DESIGN_TYPE);
    }

    static downloadProductImage = (product = null, callback = null, falseCallback = null) => {
        return OfflineHelper.downloadImage(product, callback, falseCallback, PRODUCT_TYPE);
    }
    static downloadImage = (obj, callback = null, falseCallback = null, type = PRODUCT_TYPE) => {
        // Main function to download the image
        let sourcePath = obj.image_path;

        if(!sourcePath){
            sourcePath = 'product/202102/24/81/product_img.jpg?v=2';
        }

        console.log('Source Path : ' + sourcePath);

        // To add the time suffix in filename
        let date = new Date();
        // Image URL which we want to download
        let image_URL = Def.getThumnailImg(obj.image_path);
        // Getting the extention of the file
        let ext = OfflineHelper.getExtention(image_URL);
        ext = '.' + ext[0];
        // Get config and fs from RNFetchBlob
        // config: To pass the downloading related options
        // fs: Directory path where we want our image to download
        const { config, fs } = RNFetchBlob;

        let typeName = 'product_';
        switch (type) {
            case DESIGN_TYPE :
                typeName = 'design_';
                break;
            case REPAIR_TYPE :
                typeName = 'repair_item_';
                break;
        }


        let dir = fs.dirs.DocumentDir + '/arena/';
        let path = Def.remoteVersion(dir +  (obj ?  typeName +   obj.id : date.getTime()) + ext);
        fs.isDir(dir).then((isDir) => {
            if(!isDir){
                RNFetchBlob.fs.mkdir(dir).then(() => {
                    console.log("App directory created..");
                    OfflineHelper.downloadFile(obj, path, ext, callback, falseCallback);
                })
                    .catch((err) => {
                        console.log("Err : " + JSON.stringify(err));
                    });
            } else {
                OfflineHelper.downloadFile(obj, path, ext, callback, falseCallback);
            }
        });

        return path;



        // let PictureDir = fs.dirs.PictureDir;
        // let options = {
        //     fileCache: true,
        //     // addAndroidDownloads: {
        //     //     // Related to the Android only
        //     //     useDownloadManager: true,
        //     //     notification: true,
        //     //     path:
        //     //         PictureDir +
        //     //         '/image_' + Math.floor(date.getTime() + date.getSeconds() / 2) +
        //     //         ext,
        //     //     description: 'Image',
        //     // },
        //     // path : PictureDir + '/image_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext
        // };
        // config(options)
        //     .fetch('GET', image_URL)
        //     .then(res => {
        //         // Showing alert after successful downloading
        //         console.log('res -> ', JSON.stringify(res));
        //         alert('Image Downloaded Successfully.'  + res.path());
        //     })
        //     .catch(err => {
        //         console.log("Err : " + JSON.stringify(err));
        //     })
        // ;
    };

    static downloadFile(obj, path, ext, callback = null, falseCallback = null) {
        let url = Def.getThumnailImg(obj.image_path);
        let date = new Date();
        const { config, fs } = RNFetchBlob;
        let options = {
            fileCache: true,
            // addAndroidDownloads: {
            //     // Related to the Android only



            //     useDownloadManager: true,
            //     notification: true,
            //     path:
            //         PictureDir +
            //         '/image_' + Math.floor(date.getTime() + date.getSeconds() / 2) +
            //         ext,
            //     description: 'Image',
            // },
            path : path
        };
        config(options)
            .fetch('GET', url)
            .then(res => {
                console.log('in then')
                // Showing alert after successful downloading
                //  console.log('res -> ', JSON.stringify(res));
                 if(res && callback){
                     callback(obj, res);
                 }
                  // alert('Image Downloaded Successfully.'  + res.path());
            })
            .catch(err => {
                console.log('in err')
                console.log("Err download image : " + JSON.stringify(err));
                if(falseCallback) {
                    falseCallback(obj);
                }
            })
        ;
    }

    static makeObjectDataWithIdKey = (arr) => {
        let rs = {};
        if(arr){
            arr.forEach(item => {
                rs[item['id']] = {... item};
            });
        }
        return rs;
    }

    static makeObjectDataWithKeyObj = (arr, rs = {}) => {
        let totalItem  =0;
        if(arr){
            arr.forEach(item => {
                if(item != null && item != []){
                    let i = 0;
                    let key = 0;
                    for(key in item){
                        if(key == null || key == "") {
                        }else {
                            rs[key] = item[key];
                            totalItem++;
                        }
                    }
                }
            })
        }
        return rs;
    }

    static makeRequestDataWithKeyObj = (arr, rs = {}) => {
        let totalItem  =0;
        if(arr){
            arr.forEach(item => {
                if(item != null && item != []){
                    let i = 0;
                    let key = 0;
                    for(key in item){
                        if(key == null || key == "") {
                        }else {

                            rs[item['id']] = item;
                            totalItem++;
                        }
                    }
                }
            })
        }
        // console.log('rs : ' + JSON.stringify(rs));
        return rs;
    }



    static resetLocalData = async () => {
        console.log('Reset Local Data');
        try {

            OfflineHelper.offlineRepairData = {};
            OfflineHelper.offlineFlatDataArr = [];
            OfflineHelper.offlineFlatData = {};
            OfflineHelper.downloadProductList = {} ;
            OfflineHelper.downloadDesignList = {};
            OfflineHelper.downloadRepariItemInflat = {};
            OfflineHelper.requestRepairsTree = {};


            await  AsyncStorage.setItem('offlineRepairData',JSON.stringify(OfflineHelper.offlineRepairData));
            await  AsyncStorage.setItem('offlineFlatDataArr',JSON.stringify(OfflineHelper.offlineFlatDataArr));
            await  AsyncStorage.setItem('offlineFlatData',JSON.stringify(OfflineHelper.offlineFlatData));
            await  AsyncStorage.setItem('downloadProductList',JSON.stringify(OfflineHelper.downloadProductList));
            await  AsyncStorage.setItem('downloadDesignList',JSON.stringify(OfflineHelper.downloadDesignList));
            await  AsyncStorage.setItem('downloadRepariItemInflat',JSON.stringify(OfflineHelper.downloadRepariItemInflat));
            await  AsyncStorage.setItem('requestRepairsTree',JSON.stringify(OfflineHelper.requestRepairsTree));

            let keys = ['offlineFlatData','offlineRepairData','requestRepairsTree', 'flat_current_page', 'offlineFlatDataArr'];
            await AsyncStorage.multiRemove(keys);
        }catch (e){

        }
        // RNRestart.Restart();
    }

    static resetTemplateData = async  () => {
        console.log('Start REset Data');
        OfflineHelper.offlineProductData = {};
        OfflineHelper.offlineDesignData = {};
        Def.product_data = [];
        Def.design_data = [];
        await  AsyncStorage.setItem('offlineProductData',JSON.stringify(OfflineHelper.offlineProductData));
        await  AsyncStorage.setItem('offlineDesignData',JSON.stringify(OfflineHelper.offlineDesignData));
        await  AsyncStorage.setItem('product_data',JSON.stringify(Def.product_data));
        await  AsyncStorage.setItem('design_data',JSON.stringify(Def.design_data));

        console.log('DesignData0 : '+ JSON.stringify(OfflineHelper.offlineDesignData));
    }

    static resetInteractOfflineData = async ()=> {
        OfflineHelper.initOfflineMode();
        OfflineHelper.flatChangeData={};
        OfflineHelper.requestChangeData=[];
        // OfflineHelper.pifChangeData = {};

        AsyncStorage.setItem('requestChangeData',JSON.stringify(OfflineHelper.requestChangeData));
        AsyncStorage.setItem('flatChangeData',JSON.stringify(OfflineHelper.flatChangeData));
        // AsyncStorage.setItem('pifChangeData',JSON.stringify(OfflineHelper.pifChangeData));
    }



    static checkOffline(obj, type = Def.ProductType) {
        let offlineData, rs = false ;
        switch (type) {
            case Def.ProductType:
                offlineData = OfflineHelper.offlineProductData;
                break;
            case Def.DesignType:
                offlineData = OfflineHelper.offlineDesignData;
                break;
            case Def.REQUESTREPAIRTYPE:
                offlineData = OfflineHelper.offlineRepairData;
                break;

            case Def.FlatType:
                offlineData = OfflineHelper.offlineFlatData;
                break;

        }
        if(offlineData && offlineData[obj.id] && (offlineData[obj.id].downloaded || offlineData[obj.id].offline_img )) {
            rs = true;
        }
        return rs;
    }
    static changeOfflineRepair = ( item = null, pif = null ) => {
        OfflineHelper.requestChangeData.push(item);
        AsyncStorage.setItem('requestChangeData', JSON.stringify(OfflineHelper.requestChangeData));
        // Trong trường hợp ko có trong danh sách thay đổi thì thực hiện bổ sung
        // console.log('OfflineHelper.offlineFlatData : ' + JSON.stringify(OfflineHelper.offlineFlatData));
        // thực hiện lấy dữ liệu trong bản offline nếu khong có sẽ thwucj hiện lấy trong dữ liệu originnal.
        let refFlat = OfflineHelper.getOfflineFlatById(item.flat_id) ? OfflineHelper.getOfflineFlatById(item.flat_id)  : OfflineHelper.offlineFlatData[item.flat_id] ;
        if(refFlat){
            let refFlat2 = {... refFlat};

            refFlat2['update'] = 1;
            if(OfflineHelper.flatChangeData && !OfflineHelper.flatChangeData[refFlat.id]){
                OfflineHelper.changeOfflineFlat(refFlat2);
            } else {
                // console.log('OfflineHelper.flatChangeData : '+ JSON.stringify(OfflineHelper.flatChangeData));
            }
            // console.log('Update Reflat : '+ JSON.stringify(refFlat));
            OfflineHelper.updateOfflineFlat(refFlat2, pif);
        }
    }

    static changeOfflineFlat = (flat) => {
        OfflineHelper.flatChangeData[flat.id] = flat; // đánh dấu những flat được change
        OfflineHelper.flatChangeData[flat.id]['update'] = 1;
        if(OfflineHelper.flatChangeData[flat.id]){
            console.log('Change Offline Flat Data');
        } else {
            console.log('Not exits');
        }
        AsyncStorage.setItem('flatChangeData', JSON.stringify(OfflineHelper.flatChangeData));
    }

    static checkUpdateFlat = (flat) => {
        return OfflineHelper.flatChangeData[flat.id] != null;
    }
    // cập nhật dữ liệu thay đổi
    static updateOfflineFlat(flat, pif = null){
        console.log('updateOfflineFlat: --------------------------------------------------------------');
        if(typeof flat == 'number'){
            let flatIndex = OfflineHelper.offlineFlatDataArr.findIndex((element) => element.id == flat );
            if(flatIndex > -1){
                flat = OfflineHelper.offlineFlatDataArr[flatIndex];
            }
        }


        if(flat){
            flat['update'] = 1;
            if(pif){
                let indexPif = flat.productInstanceFlat.findIndex(element => element.id == pif.id);
                if(indexPif > -1){
                    console.log('Update PIF in flat');
                    flat.productInstanceFlat[indexPif]= pif;
                }
            }
        // console.log('Flat change' + JSON.stringify(flat));
            let index = OfflineHelper.offlineFlatDataArr.findIndex((element) => element.id == flat.id );
            if(index > -1){
                OfflineHelper.changeOfflineFlat(flat);
                OfflineHelper.offlineFlatDataArr[index] = flat;
                Def.refresh_flat_data = true;
                AsyncStorage.setItem('offlineFlatDataArr', JSON.stringify(OfflineHelper.offlineFlatDataArr));
            }
            return index> -1;
        }
        return  false;
    }
    static getOfflineFlatById=(flatId)=> {
        let index = OfflineHelper.offlineFlatDataArr.findIndex((element) => element.id == flatId );
        return index > -1 ? OfflineHelper.offlineFlatDataArr[index] : false;
    }
    static updateOfflineRequestToFlat(request){
        let flat = OfflineHelper.getOfflineFlatById(request.flat_id);
        if(flat && flat['productInstanceFlat'] && flat['productInstanceFlat'][request.product_instance_flat_id] ){
            let pifs = flat['productInstanceFlat'];
            let pifIndex = flat['productInstanceFlat'].findIndex((element) => element.product_instance_flat_id == request.product_instance_flat_id);
            if(pifIndex>0){
            }
            let requestRepair = flat['productInstanceFlat'][request.product_instance_flat_id]
        }
    }

    static removeOfflineFlat = (flat) => {
        if(OfflineHelper.offlineFlatData[flat.id]){
            delete OfflineHelper.offlineFlatData[flat.id];
            AsyncStorage.setItem('offlineFlatData', JSON.stringify(OfflineHelper.offlineFlatData));
        }
        let index = OfflineHelper.offlineFlatDataArr.findIndex((element) => element.id == flat.id );
        if(index > -1){
            OfflineHelper.offlineFlatDataArr.splice(index,1);
            // console.log('offlineFlatDataArr : ' + OfflineHelper.offlineFlatDataArr.length);
            AsyncStorage.setItem('offlineFlatDataArr', JSON.stringify(OfflineHelper.offlineFlatDataArr));
        }
        // Khi thực hiện xóa căn hộ khỏi danh sách thì thực hiện xóa
        let pifs = flat.productInstanceFlat;
        pifs.forEach(pif =>  {
            OfflineHelper.offlineRequestTree[pif.id] = Def.requestRepairsTree[pif.id] ? Def.requestRepairsTree[pif.id] : [];
        })

    }

    /*
        Trong trường hợp xóa dữ liệu thay đổi offline của một chung cư thực hiện bàn giao
        B1. Thực hiện xóa dữ liệu flat
        B2. Xóa các yêu cầu chỉnh sửa liên tới flat trong hệ thông
        B3. Có thể thực hiện xóa ảnh // Optional
        Chỉ thực hiện refresh không thực hiện xóa đối với căn hộ
     */
    static resetChangeFlat = (flat) => {
        console.log('Start reset Data : ' + flat.id);
        let index = OfflineHelper.offlineFlatDataArr.findIndex((element) => element.id == flat.id );
        console.log('Start reset Data Index : ' + index);

        if(index > -1){
            let pifs = flat.productInstanceFlat;
            pifs.forEach(pif =>  {
                if(pif.id == 7982 || pif.id == '7982') {
                    console.log( 'Def.requestRepairsTree : ' + JSON.stringify(Def.requestRepairsTree[pif.id].length));
                    console.log( 'OfflineHelper.offlineRequestTree : ' + JSON.stringify(OfflineHelper.offlineRequestTree[pif.id].length));
                }

                let repairData = Def.requestRepairsTree[pif.id];
                repairData =  repairData ? OfflineHelper.convertObjectTreeToArray({...repairData}) : [];
                OfflineHelper.offlineRequestTree[pif.id] = repairData;

                if(pif.id == 7982 || pif.id == '7982') {
                    console.log( 'Affter Def.requestRepairsTree : ' + JSON.stringify(Def.requestRepairsTree[pif.id].length));
                    console.log( 'Affter OfflineHelper.offlineRequestTree : ' + JSON.stringify(OfflineHelper.offlineRequestTree[pif.id].length));
                }

                if(OfflineHelper.refreshPIF && !OfflineHelper.refreshPIF.includes(pif.id)) {
                    OfflineHelper.refreshPIF.push(pif.id);
                }

                if (OfflineHelper.pifChangeData && OfflineHelper.pifChangeData[pif.id]) {
                   delete OfflineHelper.pifChangeData[pif.id];
                }
            })
            // Trong trường hợp reset thực hiện xóa trong bảng lưu đánh dấu thay đổi flatChangeData
            if(OfflineHelper.flatChangeData[flat.id]){
                delete OfflineHelper.flatChangeData[flat.id];
                console.log('test');
                AsyncStorage.setItem('flatChangeData', JSON.stringify(OfflineHelper.flatChangeData));
            } else {
                console.log('Không tồn tại trong bảng flatChangeData ' + JSON.stringify(OfflineHelper.flatChangeData));
            }

            OfflineHelper.offlineFlatDataArr[index] = OfflineHelper.offlineFlatData[flat.id];
            AsyncStorage.setItem('offlineFlatDataArr', JSON.stringify(OfflineHelper.offlineFlatDataArr));
            AsyncStorage.setItem('offlineRequestTree', JSON.stringify(OfflineHelper.offlineRequestTree));
            AsyncStorage.setItem('pifChangeData', JSON.stringify(OfflineHelper.pifChangeData));
        }
    }

    static checkPifOfflineChange = (pif) => {
        let strId = pif.id + '';
        return OfflineHelper.pifChangeData[pif.id] || OfflineHelper.pifChangeData[strId];
    }
    static checkChangeOfflineFlat = (flat) => {
        if(OfflineHelper.offlineFlatDataArr){
            let index =  OfflineHelper.offlineFlatDataArr.findIndex((element) => element.id == flat.id );
            let rs = false;
            if(index > -1){
                rs = OfflineHelper.offlineFlatDataArr[index] && OfflineHelper.offlineFlatDataArr[index]['update'] == 1;
            }
            return rs;
        }
        return false;
    }

    static checkChangeData = () => {
        return  OfflineHelper.flatChangeData && OfflineHelper.flatChangeData.length > 0;
    }

    static syncSuccessCallback = (data) => {
        console.log('SyncSuccessCallback : ' + JSON.stringify(data));
        if(Def.setLoading){
            Def.setLoading(false);
        }
        if(data['result'] == 1){
            Alert.alert(
                "Thông báo",
                'Đồng bộ dữ liệu thành công!',
                [
                    {   // Chuyển sang trạng thái online
                        text: "OK",
                        onPress: async () => {
                            await OfflineHelper.resetOldData(); // Thực hiện xóa dữ liệu để hệ thống load lại dữ liệu online.
                            RNRestart.Restart();
                        },
                        style: 'cancel',
                    },
                ],
                {cancelable: false},
            );
        } else {
            Alert.alert(
                "Thông báo",
                'Đồng bộ dữ liệu thất bại! Ứng dụng sẽ cập nhật dữ liệu Online!',
                [
                    {   // Chuyển sang trạng thái online
                        text: "OK",
                        onPress: async () => {
                            RNRestart.Restart();
                        },
                        style: 'cancel',
                    },
                    {
                        text: "Offline",
                        onPress: async () => {
                            Def.NetWorkMode = false;
                            await AsyncStorage.setItem('network_mode', Def.NetWorkMode ? '1' : '0')
                        },
                        style: 'cancel',
                    },
                ],
                {cancelable: false},
            );
        }

    }

    static syncFalseCallback = (data) => {
        if(Def.setLoading){
            Def.setLoading(false);
        }
        console.log('SyncFalseCallback : ' + JSON.stringify(data));
    }

    static changeAppMode = async () => {
        let msg;
        // Từ chế độ Offline chuyển sang chế độ Online
        if(Def.NetWorkConnect && !Def.NetWorkMode) {
            msg =  OfflineHelper.checkChangeData() ? 'Chuyển sang chế Online, Dữ liệu Offline sẽ được đồng bộ!' : 'Chuyển sang chế độ Online!'
            Alert.alert(
                "Thông báo",
                msg,
                [
                    {   // Chuyển sang trạng thái online
                        text: "OK",
                        onPress: async () => {
                            console.log('Change  Mode Dữ liệu thay đổi');
                            Def.NetWorkMode = true;
                            await AsyncStorage.setItem('network_mode', Def.NetWorkMode ? '1' : '0');
                            // Trong trường hợp thay đổi dữ liệu thì mới thực hiện đồng bộ lên dữ liệu online.
                            if(OfflineHelper.checkChangeData()) {
                                if (Def.setLoading) {
                                    Def.setLoading(true);
                                }
                                FlatController.syncOfflineDataToServer(OfflineHelper.syncSuccessCallback, OfflineHelper.syncFalseCallback);
                            } else {
                                await OfflineHelper.resetOldData();
                                RNRestart.Restart();
                            }
                        },
                        style: 'cancel',
                    },
                    {
                        text: "Cancel",
                        style: 'cancel',
                    }
                ],
                {cancelable: false},
            );
        }
        // Chuyen sang che do tử online chuyen sang offline Offline
        else if(Def.NetWorkMode) {
            msg = 'Chuyển sang chế Online, Dữ liệu Offline sẽ được khởi tạo từ dữ liệu Online!';
            Alert.alert(
                "Thông báo",
                msg,
                [
                    {
                        text: "Ok",
                        onPress: async () => {
                            console.log('Change Mode');
                            Def.NetWorkMode = false;
                            await AsyncStorage.setItem('network_mode', Def.NetWorkMode ? '1' : '0')
                            if (!Def.NetWorkMode) {
                                await OfflineHelper.initOfflineMode();
                                RNRestart.Restart();
                            } else {

                            }


                        },
                        style: 'cancel',
                    },
                    {
                        text: "Cancel",
                        style: 'cancel',
                    }
                ],
                {cancelable: false},
            );
        }

    }
    // Thực hiện xóa dữ liệu FlatData để ứng dụng thực hiện reload
    static resetOldData = async () => {
        console.log('resetOldData');
        await  OfflineHelper.resetLocalData();
        await  OfflineHelper.resetInteractOfflineData();
        Def.flat_data = [];
        Def.requestRepairsTree = {};
        await AsyncStorage.setItem('flat_data', JSON.stringify(Def.flat_data));
        await AsyncStorage.setItem('requestRepairsTree',JSON.stringify(Def.requestRepairsTree));
        console.log('resetOldData End');
    }

    static checkChangeData = () => {
       return  OfflineHelper.flatChangeData && OfflineHelper.flatChangeData != '' && JSON.stringify(OfflineHelper.flatChangeData) != JSON.stringify({})
    }

    static refreshPIF = [];



}
