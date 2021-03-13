import Def from "../def/Def";
import {Alert, Platform} from 'react-native'
import Net from  './Net'

export default class FlatController {
    static getFlat(callback,errCallback ) {
        Net.sendRequest(callback,errCallback, Def.ARENA_BASE + "/api/flat/get-flat" ,Def.POST_METHOD);
    }
}
