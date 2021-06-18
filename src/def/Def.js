import {OfflineHelper} from "./OfflineHelper";
import {Platform} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Def {
    static URL_BASE = "https://eurotiledev.house3d.net";
    static URL_CONTENT_BASE = "https://eurotiledev.house3d.net/data/eurotileData/";

    static VIETCRAFT_URL_CONTENT_BASE = "https://fairadmin.house3d.com/data/vietcraftData/";
    static URL_DEFAULT_AVATAR = "https://cdn-content1.house3d.com/uploads/2019/07/02/5d1aa12048236.jpg";
    static LIFE_STYLE_BASE = "https://lifestylevietnamonline.com";
    static LIFE_STYLE_BASE_ASSET = "https://arenaadmin.house3d.com/data/acceptanceData/";
    static ARENA_BASE = "https://arena.house3d.com";
    static PARTNER_ACTIVE_STATUS = 1;

    static DEFAULT_MAX_SIZE = 1024;

    static NetWorkMode = true; // 0 offline, 1 online
    static NetWorkConnect = true; // 0 offline, 1 online
    static AppMode = 1; // 0 offline, 1 online

    // token nhận được sau khi đăng nhập để gửi lên server lấy token user
    static firebase_token = '';
    // token để nhận notification
    static notification_token = '';
    // token để thao tác với api vov
    static login_token = '';//'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJWT1YiLCJhdWQiOiJodHRwOlwvXC92b3YubG9jYWwiLCJqdGkiOiI0ZjFnMjNhMTJhYSIsImlhdCI6MTU5NjM0NjM4OSwiZXhwIjoxNjEyMTE0Mzg5LCJ1aWQiOjN9.ay2l1884Oz762GhmTgGXgSe25Pd5x8KykkPTBnd9JHI';
    static email = '';
    static username = '';
    static user_info = null;

    static order_number = 12;

    static os = 'android';

    // Select
    static GET_METHOD = "GET";
    // Insert
    static POST_METHOD = "POST";
    //Delete
    static DELETE_METHOD = "DELETE";
    //Update
    static PUT_METHOD = "PUT";

    static TOAST_DURATION = 3000; // 3 seconds
    static TOAST_ERROR_COLOR = 'orange';
    static TOAST_SUCCESS_COLOR = 'blue';


    static ERROR_EMAIL_MISSING = 'Vui lòng cung cấp email';
    static ERROR_PASSWORD_MISSING = 'Vui lòng cung cấp pasword';
    static ERROR_PASSWORD_NOT_MATCH = 'Password không giống nhau';

    static ERROR_LOGIN_MISSING = 'Vui lòng đăng nhập trước khi thực hiện hành động này';
    static ERROR_LOADING_DATA = 'Đang tải dữ liệu, vui lòng chờ';
    static ALERT_DISABLE_SELECTION = "Lựa chọn này đã bị khóa, vui lòng chọn mục khác";

    static WEB_CLIENT_ID = "491520516021-1no68o939c9s80mbc87albgin4h20teb.apps.googleusercontent.com";

    static REFESH_SCREEN = [];


    static TYPE_RADIO = 1;
    static TYPE_MUSIC = 2;
    static TYPE_PROGRAM = 3;
    static TYPE_NEWS = 4;
    static TYPE_DAILYCONTENT = 5;

    static PLAYBACK_SUB_TYPE = 1;

    static OrderStatus = {0: "Chưa tiếp nhận", 1: "Xác nhận", 2: "Thanh toán", 3: "Giao hàng", 4: "Hoàn thành"}; // DRAFT, CONFIRM, PAID, DELIVERING, ACCOMPLISHED

    static FlatSTatusList = {0: "Chưa kích hoạt", 1: "Hoạt động", 2: "Hoàn thành nghĩa vụ tài chính", 3: "Đủ điều kiện bàn giao", 4: "Đang bàn giao", 5:"Đã ký nhận bàn giao" , 6:"Sữa chữa sau bàn giao", 8:"Đã hoàn thiện hồ sơ", 7:"Đã hoàn thành"};
    static FlatSTatusColorList = {0: '#D33724', 1: '#008D4C', 2: '#337AB7', 3: '#605CA8', 4: '#F39C12', 5:'#FF851B' , 6:' #000', 8:'#ccc', 7:'#000'};

    static news_data = null;
    static collection_data = null;
    static design_data = [];
    static popular_design = null;
    static config_collection_menu = null;
    static design_cate = null;
    static product_data = [];
    static cart_data = [];
    static setLoading = null;


    static requestRepairtFlat ={} ;

    static flat_data = [];
    static refresh_flat_data = false;
    static refeshFlatList = [];

    static customer = [];
    static currentOrder = null; // Model đang thực hiện thao tác


    static currentCustomer = null;

    static orderList = [];
    static config_order_menu = [];
    static OrderListForStatus = [];

    static setIsLogin = null;
    static setLoader = null;

    static collection_detail_data = null;
    static collection_detail_menu = null;

    static config_design_menu = null;

    static refreshDashBoard = null;

    static mainNavigate = null;

    static updateAddress = null;

    static redirectScreen = null;

    static customerTypes = {0: 'Chủ nhà', 1: 'Kiến trúc sư'};

    static flatCurrentPage = 0;

    static pageSize = 20;


    static getDateString(date, format) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            getPaddedComp = function (comp) {
                return ((parseInt(comp) < 10) ? ('0' + comp) : comp)
            },
            formattedDate = format,
            o = {
                "y+": date.getFullYear(), // year
                "M+": getPaddedComp(date.getMonth() + 1), //month
                "d+": getPaddedComp(date.getDate()), //day
                "h+": getPaddedComp((date.getHours() > 12) ? date.getHours() % 12 : date.getHours()), //hour
                "H+": getPaddedComp(date.getHours()), //hour
                "m+": getPaddedComp(date.getMinutes()), //minute
                "s+": getPaddedComp(date.getSeconds()), //second
                "S+": getPaddedComp(date.getMilliseconds()), //millisecond,
                "b+": (date.getHours() >= 12) ? 'PM' : 'AM'
            };

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                formattedDate = formattedDate.replace(RegExp.$1, o[k]);
            }
        }
        return formattedDate;
    };

    static COMPARE_DATE = 0;
    static COMPARE_DATETIME = 1;
    static compairDate(date1, date2, type = COMPARE_DATE ){
        let rs = false;
        date1 = Number.isInteger(date1) ? new Date(date1) : date1;
        date2 = Number.isInteger(date2) ? new Date(date2) : date2;


        if(type == Def.COMPARE_DATETIME) {
            rs = date1.getTime() == date2.getTime();
        }

        if(type == Def.COMPARE_DATE){
            rs = date1.getDate() == date2.getDate() && date1.getFullYear() == date2.getFullYear() && date1.getMonth()== date2.getMonth();
        }
        return rs;
    }

    static getAvatarUrlFromUserInfo() {
        let rsUrl = Def.URL_DEFAULT_AVATAR;
        if (Def.user_info && Def.user_info['userProfile'] && Def.user_info['userProfile']['avatar_path']) {
            if (Def.user_info['userProfile']['avatar_base_url'] && Def.user_info['userProfile']['avatar_base_url'].length > 0) {
                console.log("Avatar Url" + Def.user_info['userProfile']['avatar_base_url'].length);
                rsUrl = Def.user_info['userProfile']['avatar_base_url'] + '/' + Def.user_info['userProfile']['avatar_path'];
            } else {
                rsUrl = Def.user_info['userProfile']['avatar_path'];
            }
        }
        return rsUrl;
    }

    static getInfrontOfImg() {
        let rsUrl = '';
        if (Def.user_info && Def.user_info['userProfile'] && Def.user_info['userProfile']['infront_cmt_img']) {
            rsUrl = Def.URL_CONTENT_BASE + Def.user_info['userProfile']['infront_cmt_img'];
            console.log('' + Def.user_info['userProfile']['infront_cmt_img']);
        }
        return rsUrl;
    }

    static getBehindImg() {
        let rsUrl = '';
        if (Def.user_info && Def.user_info['userProfile'] && Def.user_info['userProfile']['behind_cmt_img']) {
            rsUrl = Def.URL_CONTENT_BASE + Def.user_info['userProfile']['behind_cmt_img'];
        }
        return rsUrl;
    }

    static getLinkOfNews(item) {
        // return "https://gianglt.com/rangdong/?s=hopcom";
        console.log("link" + Def.URL_BASE + '/eurotile/news?slug=' + item.slug);
        if (item && item.slug) {
            return Def.URL_BASE + '/eurotile/news?view=app&slug=' + item.slug;
        }
        return false;
    }

    static getCityItemFromUserInfo() {
        let address = Def.getAddressFromUserInfo();
        if (address && address['city']) {
            return address['city']
        }
        return null;

    }

    static getDetailAddressFromUserInfo() {
        let address = Def.getAddressFromUserInfo();
        if (address && address['address_detail']) {
            return address['address_detail'];
        }
        return null;

    }

    static getDistrictItemFromUserInfo() {
        let address = Def.getAddressFromUserInfo();
        if (address && address['district']) {
            return address['district']
        }
        return null;
    }

    static getWardItemFromUserInfo() {
        let address = Def.getAddressFromUserInfo();
        if (address && address['ward']) {
            return address['ward']
        }
        return null;
    }

    static getAddressFromUserInfo() {
        let rs = null;
        if (Def.user_info && Def.user_info['userProfile'] && Def.user_info['userProfile']['address']) {
            rs = Def.user_info['userProfile']['address'];
        }
        return rs;
    }

    static getThumnailImg(img_path) {
        img_path = Def.LIFE_STYLE_BASE_ASSET + img_path;
        let rs = img_path.split(".");
        let lastItem = rs.pop();
        rs = rs.join('.') + '_200x200.' + lastItem;
        return rs;
    }
    /*
       ProductType = 0
       DesignType = 1
     */
    static ProductType = 0;
    static DesignType = 1;
    static REQUESTREPAIRTYPE = 2;
    static FlatType = 3;

    static OFFLINE_PRIORITY = 0;
    static ONLINE_PRIORITY = 1;


    static getObjImage(obj, priority = Def.OFFLINE_PRIORITY ,  type = Def.ProductType) {
        let img_path = Def.LIFE_STYLE_BASE_ASSET + obj.image_path;
        let rs = img_path.split(".");
        let lastItem = rs.pop();
        rs = rs.join('.') + '_200x200.' + lastItem;
        if(priority == Def.OFFLINE_PRIORITY) {
            let offlineData = type == Def.ProductType ? OfflineHelper.offlineProductData : OfflineHelper.offlineDesignData;
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

            }
            if(offlineData[obj.id] && offlineData[obj.id].offline_img) {
                rs = Platform.OS === 'android' ? 'file://' +offlineData[obj.id].offline_img : '' + offlineData[obj.id].offline_img;
            }
        }
        return rs;
    }




    static getTypeAccount() {
        if (Def.user_info && Def.user_info['partnerInfo']) {
            return 'partner'
        } else if (Def.user_info) {
            return 'normal'
        }
        return 'guest'

    }

    static getAddressStr(address) {
        let strAddress = "";
        if (!address) {
            return strAddress;
        }
        if (address['ward']) {
            strAddress += address['ward']['ward_name'] + ', ';
        }

        if (address['district']) {
            strAddress += address['district']['district_name'] + ', ';
        }

        if (address['city']) {
            strAddress += address['city']['city_name'];
        }
        return strAddress;

    }

    static calOrderValue(order) {
        var total = 0;
        // return total;
        if (order.orderItems && Array.isArray(order.orderItems)) {
            order.orderItems.forEach(item =>  {
                total += item.product.sale_price * item.amount *  item.product.brickBoxInfo['total_area'] / 1000000;
            });
        }
        return total;
    }

    static getOrderByStatus(orderList, status) {
        let filterData = [];
        // console.log("Status : "  + status);
        if (orderList && Array.isArray(orderList)) {
            filterData = orderList.filter((item) =>
                item.status == status
            );
        }
        return filterData;
    }

    static numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    static clearCartData() {
        Def.cart_data = null;
    }

    static checkPartnerPermission() {
        if (Def.user_info && Def.user_info['partnerInfo']) {
            if(Def.user_info['partnerInfo']['status'] == Def.PARTNER_ACTIVE_STATUS){
                return Def.user_info['partnerInfo']['level_id'];
            }else {
                return -1; // Yêu cầu trở thành partner đang chờ phê duyệt
            }

        }

        if (Def.user_info){
            return -2; // trong trường hợp tk thường trả về -2
        }

        return -3;
    }

    static formatArea(value) {
        return Math.floor(value);

    }


    static ressetCart() {
        Def.cart_data = [];
        Def.order = null;

    }

    static formatText(text, maxCharacter = 20){
        let rs = text;
        // if(this.props.type == "product"){
        //     rs = text.replace("Sản phẩm ", '');
        // }

        if(text.length > maxCharacter -2){
            rs = text.substring(0, maxCharacter -2) + " ...";
        }
        return rs;
    }

    static createPaymentUrl(orderId){
        console.log('UserInfo: ' + JSON.stringify(Def.user_info));
        let rsUrl = Def.URL_BASE + '/user/sign-in/login-by-access-token?token=' + Def.user_info['access_token']+'&redirectUrl=' + Def.URL_BASE + '/payment?id=' + orderId;
        console.log("Payment Url " + rsUrl);
        return rsUrl;
    }

    static formatOrderNumber(order_number){
        return order_number < 100 ? order_number : '99+';
    }

    static checkInCart($product){

    }

    static getFlatStatusName( statusFilter = 0 ){
        return Def.FlatSTatusList[statusFilter];
    }

    static getFlatStatusColor( statusFilter = 0 ){
        return Def.FlatSTatusColorList[statusFilter];
    }

    static getDesignStatusName( statusFilter = 0 ){
        return statusFilter == 0  ? "Ngừng hoạt động" : "Hoạt động" ;
    }

    static PRODUCT_ACTIVE_STATUS = 1; // Đạt
    static PRODUCT_REPAIRED_STATUS = 2 ; // Đã chỉnh sửa
    static PRODUCT_UNACTIVE_STATUS = 0; // Không đạt
    static PRODUCT_CANCEL_STATUS = -1; // Không đạt

    static ProductStatusName = {0:"Không đạt", 1:"Đạt", 2:'Đã chỉnh sửa'};
    static ProductStatusColor = {0:"#FF0000", 1:"#00FF04", 2: '#FFAE00'};

    static getProductStatusName(status){
        return  Def.ProductStatusName[status];
    }

    static getProductStatusColor(status){
        return  Def.ProductStatusColor[status];
    }

    static requestRepairsTree = {};

    static refeshFlat = []; // Danh sách dự án cần được load lại trang chi tiết

    static refeshPIF = [] ;// Danh sách dữ liệu trang PIF cần load lại

    static updateFlatToFlatList(flat){
        let index = Def.flat_data.findIndex((element) => element.id == flat.id );
        if(index > -1){
            if(flat.status == 7) { // Trong trường hợp căn họ hoàn thành thực hiện remote khỏi mảng
               Def.flat_data.splice(index,1);
            } else {
                Def.flat_data[index] = flat;
                Def.refresh_flat_data = true;
            }
        }
        return index> -1;
    }



    static updateProductToFlat(pif){
        let flat = Def.flat_data.findIndex((element) => element.id == pif.flat_id );
        if(flat){
            let index = flat.productInstanceFlat.findIndex((element) => element.id == pif.id );
            if(index > -1){
                flat.productInstanceFlat[index] = pif;
                Def.refresh_flat_data = true;

            }
        }

        return index> -1;

    }

    static remoteVersion(path){
        console.log('path input ' + path);
        let rs = path.split("?v=");
        // rs.pop();
        // rs.join("=?");
        return rs[0];

    }

    static getFlatFromFlatData(flatId){
        let index = -1;
        let flatData = Def.flat_data;
        if(!Def.NetWorkMode && OfflineHelper.offlineFlatDataArr){
           flatData = OfflineHelper.offlineFlatDataArr;
        }
        if(flatData){
            index = flatData.findIndex((element) => element.id == flatId );
        }
        return index > -1 ? flatData[index] : null;
    }

    static onlyUnique(value, index, self){
        return self.findIndex(item => {return item.code == value.code}) === index;
    }

    static appendToFlatData(newData){
        if(Def.flat_data){
            Def.flat_data = Def.flat_data.concat(newData);
            Def.flat_data = Def.flat_data.filter(Def.onlyUnique);
        }else {
            Def.flat_data = newData;
        }
        return Def.flat_data;
    }


    static buildingData = [];
    static customerData = [];

    static checkTakePhotoImg = (uri) => {
        var n = uri.search("com.thearena");
        return n != -1;
    }

    static async initFunc(){
        console.log('init function');
        let network_mode = JSON.parse(await AsyncStorage.getItem('network_mode'));
        Def.NetWorkMode = network_mode == 1 || network_mode == '1' ;
    }
}
