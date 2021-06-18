import Def from '../def/Def';
import Net from './Net';
import {OfflineHelper} from '../def/OfflineHelper';
import FlatHelper from '../def/FlatHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from "react-native";

export default class FlatController {
    static getFlat(callback,errCallback , get_all = false, pageSize = Def.pageSize, pageIndex) {
       let param = {'token' : Def.user_info['access_token'] , 'get_all' : true, 'pageSize' :pageSize, 'pageIndex' : pageIndex };
       Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-flat" ,Def.POST_METHOD, param);
    }

    static getDesign(callback,errCallback , get_all = false, pageSize = Def.pageSize, pageIndex) {
        console.log('Get Design');
        let param = {'token' : Def.user_info['access_token'] , 'get_all' : true, 'pageSize' :pageSize, 'pageIndex' : pageIndex };
        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/design/design" ,Def.POST_METHOD, param);
    }

    static getProduct(callback,errCallback , get_all = true, pageSize = Def.pageSize, pageIndex) {
        console.log('Get Product');
        let param = {'token' : Def.user_info['access_token'] , 'get_all' : true, 'pageSize' :pageSize, 'pageIndex' : pageIndex };
        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/product/product" ,Def.POST_METHOD, param);
    }

    static getbuilding(callback,errCallback , params = null) {

        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-bulding" ,Def.POST_METHOD, params);
    }

    static getCustomer(callback,errCallback ) {
        let param = {'token' : Def.user_info['access_token']};

       console.log(JSON.stringify(param));

        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-customer" ,Def.POST_METHOD);
    }


    static getFlatById(callback,errCallback, flatId ) {
        let param = {'flat_id' : flatId, 'token' : Def.user_info['access_token']};
        console.log(JSON.stringify(param));
        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-flat-by-id" ,Def.POST_METHOD, param);
    }

    static getRequestRepair(callback, errCallback , product_flat_id){
       let param = {'product_flat_id' : product_flat_id};
       Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-request-repair-by-pif" ,Def.POST_METHOD, param);
    }

    static getRequestRepairByFlat(callback, errCallback , flat_id){
        let param = {'flat_id' : flat_id, 'token' : Def.user_info['access_token']};
        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-repair-item-by-flat" ,Def.POST_METHOD, param);
    }

    static changeStatusProduct(callback, errCallback, pif, role, token , type, note, image, status ){
       if(Def.NetWorkMode) { // Xử lí trong trường hợp Online
           let param = {
               'product_instance_id': pif.id,
               'token': token,
               'role': role,
               'type': type,
               'note': note,
               'image': image,
               'status': status
           };
           Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/change-product-status" ,Def.POST_METHOD, param);
       } else {
           let repairItem = null;
           if(type == FlatHelper.APPROVE_REPAIR_TYPE){ // Xử lí trường hợp phê duyệt hoặc từ chối của WSH
               pif['status'] = status;
               OfflineHelper.updateOfflineFlat(pif.flat_id, pif);
           } else {

               repairItem = {
                   id: (new Date()).getTime(),
                   product_instance_flat_id: pif.id,
                   date: Math.ceil((new Date()).getTime()/1000),
                   image_path:image ? image.uri : '',
                   img_info:image,
                   reporter_id:Def.user_info.id,
                   note: note,
                   offlineItem:1,
                   flat_id:pif.flat_id,
                   pif:pif
               }
               // Gán Offline Id thực hiện đồng bộ trên server
               if(repairItem.img_info){
                   repairItem.img_info['repairId'] = repairItem.id;
               }



               if(type == FlatHelper.REQUEST_TYPE){
                   pif['status'] = FlatHelper.PIF_UNACTIVE_STATUS;
                   repairItem['status'] = FlatHelper.STATUS_REQUEST_REPAIR_TYPE;
               }

               if(type == FlatHelper.REPAIRED_TYPE){
                   pif['status'] = FlatHelper.PIF_REPAIRED_STATUS;
                   repairItem['status'] = FlatHelper.STATUS_REPAIRED_TYPE;
               }

               if(type == FlatHelper.COMMENT_TYPE){
                   repairItem['status'] = FlatHelper.STATUS_COMMENT_TYPE
               }



               OfflineHelper.changeOfflineRepair(repairItem, pif); // Hàm này đã bao gồm lưu thông tin căn hộ vào trong danh sách thay đổi



               if(OfflineHelper.offlineRequestTree[pif.id]){
                   console.log('Add thêm request_repair cho Pif : ' + pif.id);
                   OfflineHelper.offlineRequestTree[pif.id].push(repairItem);
               }else {
                   console.log('Khởi tạo request repair cho Pif : ' + pif.id);
                   OfflineHelper.offlineRequestTree[pif.id] = [repairItem];
               }
               // OfflineHelper.pifChangeData[pif.id] = pif;
               // AsyncStorage.setItem('pifChangeData',JSON.stringify(OfflineHelper.pifChangeData));
               AsyncStorage.setItem('offlineRequestTree',JSON.stringify(OfflineHelper.offlineRequestTree));
           }
           pif['time'] = Math.ceil((new Date()).getTime() / 1000);
           OfflineHelper.pifChangeData[pif.id] = pif;
           AsyncStorage.setItem('pifChangeData',JSON.stringify(OfflineHelper.pifChangeData));


           let data = {
             msg:'Ok',
             offlineMode:1,
             pif:pif,
             requestRepair: repairItem
           };
           callback(data);
       }

    }
    /*
         //image.encoded - for the base64 encoded png
        //image.pathName - for the file path name
     */
    static changeStatusFlat(callback, errCallback, token, flat_id, status, is_decline = null , image, note, type, newDeadline = null, readyToDeliver = null , absentee_hanover = null){
        if(Def.NetWorkMode){
            let param = {'flat_id' : flat_id, 'token' : token, 'type' : type , 'note': note, 'image_data':image ? image.encoded : null, 'status' : status , 'is_decline' : is_decline, 'new_deadline': newDeadline, 'ready_deliver':readyToDeliver};
            Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/change-flat-status" ,Def.POST_METHOD, param);
        } else {
            let flat = OfflineHelper.getOfflineFlatById(flat_id);
            if(absentee_hanover != null){
                flat['absentee_hanover'] = absentee_hanover;
            }
            if(readyToDeliver != null){
                flat['highlight_re_schedule'] = 1;
            }
            if(type == FlatHelper.DECLINE_DELIVER_TYPE){
                flat['is_decline'] = 1;
                flat['decline_note'] = note;

            }
            if(type == FlatHelper.UPDATE_DEADLINE){
                flat['deadline_date'] = newDeadline;
                flat['deliver_date'] = null;
                flat['highlight_deadline'] = 1;
            }
            if(type == FlatHelper.UPDATE_STATUS_TYPE){
                flat['status'] = status;
            }
            if(type == FlatHelper.SIGNATURE_PAD_TYPE){

                flat['status'] = FlatHelper.SIGNED_STATUS;
                let offlineSignature = {
                    image:image ? image.encoded : '',
                    image_path: image ? Platform.OS === "android" ? image.pathName : image.pathName.replace("file://", "")  : '',
                    create_at: Math.ceil((new Date()).getTime()/1000),
                }
                flat['offlineSignature'] = offlineSignature;
                console.log('OfflineSignature : ' + JSON.stringify(offlineSignature));
            }
            flat['update'] = 1;
            flat['offlineMode'] = 1;
            console.log('Flat status : ' + flat['status']);
            let data = {
                msg: 'Ok',
                offlineMode: 1,
                flat:flat
            };
            callback(data);
        }

    }

    // static changeStatusFlat(callback, errCallback, token, flat_id, status, is_decline = null , image, note, type ){
    //     let param = {'flat_id' : flat_id, 'token' : token, 'type' : type , 'note': note, 'image_data':image, 'status' : status , 'is_decline' : is_decline};
    //     Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/change-flat-status" ,Def.POST_METHOD, param);
    // }

    static sendRepairList(callback, errCallback, token, flat_id, pifs ){
        let param = {'flat_id' : flat_id, 'token' : token, 'pifs' : pifs};
        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/send-repair-report" ,Def.POST_METHOD, param);
    }


    static syncOfflineDataToServer(callback, errCallback, token) {
        if(Def.NetWorkConnect) { // Xử lí trong trường hợp có mạng
            let param = {
                'token' : Def.user_info['access_token'],
                'flat_change' : JSON.stringify(FlatController.getFlatChangeToSending()),
                'pif_change' : JSON.stringify(FlatController.getPifToSending()) ,
                'request_repair' : JSON.stringify(FlatController.getRequestRepairChange()),
            };

            console.log('Sync Param : ' + JSON.stringify(param));
            Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/sync-offline-data" ,Def.POST_METHOD, param, 'application/json; charset=utf-8', FlatController.repairImg);
        } else {
            Net.showNetworkMsg('Mất kết nối mạng, ứng dụng không thể đồng bộ dữ liệu!');
        }
    }

    static getFlatChangeToSending = () => {
        let rs = [];
        let sendingItem;
        for (const key in OfflineHelper.flatChangeData) {
            if(OfflineHelper.flatChangeData[key]) {
                sendingItem = {
                    id:OfflineHelper.flatChangeData[key].id,
                    status:OfflineHelper.flatChangeData[key].status,
                    highlight_re_schedule: OfflineHelper.flatChangeData[key].highlight_re_schedule,
                    deadline_date: OfflineHelper.flatChangeData[key].deadline_date,
                    is_decline: OfflineHelper.flatChangeData[key].is_decline,
                    decline_note: OfflineHelper.flatChangeData[key].decline_note,
                    highlight_deadline: OfflineHelper.flatChangeData[key].highlight_deadline,
                    absentee_hanover: OfflineHelper.flatChangeData[key].absentee_hanover,
                    offlineSignature: OfflineHelper.flatChangeData[key].offlineSignature
                };
                if(OfflineHelper.flatChangeData[key].offlineSignature){
                    sendingItem.image_data = OfflineHelper.flatChangeData[key].offlineSignature.image;
                    sendingItem.create_at = Math.ceil(OfflineHelper.flatChangeData[key].offlineSignature.create_at/1000);
                }
                rs.push(sendingItem);
            }
        }
        return rs;
    }

    static getPifToSending = () => {
        let rs = [];
        let sendingItem;
        for (const key in OfflineHelper.pifChangeData) {
            if(OfflineHelper.pifChangeData[key]) {
                sendingItem = {
                    pifId: OfflineHelper.pifChangeData[key].id,
                    status: OfflineHelper.pifChangeData[key].status,
                    time: OfflineHelper.pifChangeData[key]['time']
                };
                rs.push(sendingItem);
            }
        }
        return rs;
    }

    static repairImg = [];

    static getRequestRepairChange = () =>{
        let rs = [];
        for (const key in OfflineHelper.pifChangeData) {
            if(OfflineHelper.offlineRequestTree[key]) {
                rs = rs.concat(OfflineHelper.offlineRequestTree[key]);
            }
        }
        rs = rs.filter(model => (model['offlineItem'] == 1 || model['offlineItem'] == '1'));
        let sendingRs = [];
        rs.forEach(item => {
            let sendingItem = {
                id:item.id,
                product_instance_flat_id: item.product_instance_flat_id,
                date:item.date,
                status: item.status,
                note: item.note,
                image: item.img_info,
            };
            if(item.img_info){
                FlatController.repairImg.push(item.img_info);
            }
            sendingRs.push(sendingItem);
        });

        return sendingRs;

    }



}
