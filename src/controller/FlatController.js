import Def from "../def/Def";
import {Alert, Platform} from 'react-native'
import Net from  './Net'
import {OfflineHelper} from '../def/OfflineHelper';
import FlatHelper from '../def/FlatHelper';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
       if(Def.NetWorkMode) { // Xử lí trong trường hợp offline
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
               pif[status] = status;
               OfflineHelper.updateOfflineFlat(pif.flat_id);
           } else {
               repairItem = {
                   id: (new Date()).getTime(),
                   product_instance_flat_id: pif.id,
                   date: (new Date()).getTime(),
                   image_path:image ? image.uri : '',
                   img_info:image,
                   reporter_id:Def.user_info.id,
                   note: note,
                   offlineItem:1,
                   flat_id:pif.flat_id,
                   pif:pif
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
               OfflineHelper.changeOfflineRepair(repairItem); // Hàm này đã bao gồm lưu thông tin căn hộ vào trong danh sách thay đổi
               if(OfflineHelper.offlineRequestTree[pif.id]){
                   console.log('Push repair-item');
                   OfflineHelper.offlineRequestTree[pif.id].push(repairItem);
               }else {
                   OfflineHelper.offlineRequestTree[pif.id] = [repairItem];
               }
               OfflineHelper.pifChangeData[pif.id] = pif;
               AsyncStorage.setItem('pifChangeData',JSON.stringify(OfflineHelper.pifChangeData));
               AsyncStorage.setItem('offlineRequestTree',JSON.stringify(OfflineHelper.offlineRequestTree));
           }

           let data = {
             msg:'Ok',
             offlineMode:1,
             pif:pif,
             requestRepair: repairItem
           };
           callback(data);
       }

    }

    static changeStatusFlat(callback, errCallback, token, flat_id, status, is_decline = null , image, note, type, newDeadline = null, readyToDeliver = null , absentee_hanover = null){
        if(Def.NetWorkMode){
            let param = {'flat_id' : flat_id, 'token' : token, 'type' : type , 'note': note, 'image_data':image, 'status' : status , 'is_decline' : is_decline, 'new_deadline': newDeadline, 'ready_deliver':readyToDeliver};
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
                    image:image,
                    create_at: (new Date()).getTime(),
                }
                flat['offlineSignature'] = offlineSignature;
            }
            flat['update'] = 1;
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
}
