import Def from "../def/Def";
import {Alert, Platform} from 'react-native'
import Net from  './Net'

export default class FlatController {
    static getFlat(callback,errCallback ) {
       Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-flat" ,Def.POST_METHOD);
    }

    static getbuilding(callback,errCallback , params = null) {

        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-bulding" ,Def.POST_METHOD, params);
    }

    static getCustomer(callback,errCallback ) {

        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-customer" ,Def.POST_METHOD);
    }


    static getFlatById(callback,errCallback, flatId ) {
        let param = {'flat_id' : flatId};
        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-flat-by-id" ,Def.POST_METHOD, param);
    }

    static getRequestRepair(callback, errCallback , product_flat_id){
       let param = {'product_flat_id' : product_flat_id};
       Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-request-repair-by-pif" ,Def.POST_METHOD, param);
    }

    static changeStatusProduct(callback, errCallback, product_instance_id, role, token , type, note, image, status ){
       let param = {'product_instance_id' : product_instance_id, 'token' : token, 'role': role, 'type' : type, 'note': note, 'image':image, 'status' : 0};
       console.log("Change-status-product : " + JSON.stringify(param));

       Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/change-product-status" ,Def.POST_METHOD, param);
    }

    static changeStatusFlat(callback, errCallback, token, flat_id, status, is_decline = null , image, note, type ){
        let param = {'flat_id' : flat_id, 'token' : token, 'type' : type , 'note': note, 'image_data':image, 'status' : status , 'is_decline' : is_decline};
        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/change-flat-status" ,Def.POST_METHOD, param);
    }

    static sendRepairList(callback, errCallback, token, flat_id, pifs ){
        let param = {'flat_id' : flat_id, 'token' : token, 'pifs' : pifs};
        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/send-repair-report" ,Def.POST_METHOD, param);
    }
}
