import Def from './Def'
import RNFetchBlob from 'rn-fetch-blob';
import {
    PermissionsAndroid,
    Platform,
} from 'react-native';

export default class FlatHelper {

    static DECLINE_DELIVER_TYPE = 0;
    static UPDATE_STATUS_TYPE = 1;
    static SIGNATURE_PAD_TYPE = 2;


    static INACTIVE_STATUS = 0; // Trạng thái mặc định khi đưa lên hệ thống
    static ACTIVE_STATUS = 1; // Trạng thái đang active
    static FINANCE_DONE_STATUS = 2; // Hoàn thành nghĩa vụ tài chính
    static CAN_DELIVER_STATUS = 3; // Trạng thái sẵn sàng có thể bàn giao.
    static DELIVERING_STATUS = 4; // Trạng thái đang bàn giao
    static SIGNED_STATUS = 5; // Trạng thái đã ký nhận bàn giao
    static REPAIR_AFTER_SIGN_STATUS = 6; // Trạng thái sửa chữa sau bàn giao.
    static PROFILE_COMPLETED_STATUS = 8; // Trạng thái đã hoàn thiện hồ sơ.
    static DONE_STATUS = 7;

    static NOT_DELETE = 0 ;
    static DELETED = 1;

    static NOT_DECLINE = 0; // Căn hộ chưa bị từ chối bàn giao
    static DECLINE = 1; // Căn hộ bị từ chối bàn giao

    static ROLE_USER = 'user';
    static ROLE_EDITOR = 'editor';
    static ROLE_CENTER_USER = 'center_user';
    static ROLE_CSKH = 'cskh';
    static ROLE_HANDOVER = 'handover';
    static ROLE_DEFECT = 'defect';
    static ROLE_WSH = 'wsh';
    static ROLE_QUALITY_ASSURANCE = 'quality_assurance';
    static ROLE_OWNER = 'owner';
    static ROLE_ADMINISTRATOR = 'administrator';
    static ROLE_MANAGER = 'manager';

    static PriorityRoles = [FlatHelper.ROLE_ADMINISTRATOR,FlatHelper.ROLE_WSH,FlatHelper.ROLE_QUALITY_ASSURANCE,FlatHelper.ROLE_DEFECT,FlatHelper.ROLE_CSKH,FlatHelper.ROLE_HANDOVER, FlatHelper.ROLE_OWNER];


    static FlatSTatusList = {0: "Chưa kích hoạt", 1: "Hoạt động", 2: "Hoàn thành nghĩa vụ tài chính", 3: "Đủ điều kiện bàn giao", 4: "Đang bàn giao", 5:"Đã ký nhận bàn giao" , 6:"Sữa chữa sau bàn giao", 8:"Đã hoàn thiện hồ sơ", 7:"Đã hoàn thành"};
    static FlatSTatusColorList = {0: '#D33724', 1: '#008D4C', 2: '#337AB7', 3: '#605CA8', 4: '#F39C12', 5:'#FF851B' , 6:' #000', 8:'#ccc', 7:'#000'};

    static getFlatStatusName( statusFilter = 0 ){
        return FlatHelper.FlatSTatusList[statusFilter];
    }

    static getFlatStatusColor( statusFilter = 0 ){
        return FlatHelper.FlatSTatusColorList[statusFilter];
    }

    static statusTree;

    static getStatusTree()
    {
        if(!FlatHelper.statusTree){
            Def.statusTree = [];
            let handoverNode = [];
            handoverNode[FlatHelper.CAN_DELIVER_STATUS] = [FlatHelper.DELIVERING_STATUS];
            handoverNode[FlatHelper.DELIVERING_STATUS] = [FlatHelper.SIGNED_STATUS];
            handoverNode[FlatHelper.SIGNED_STATUS] = [FlatHelper.REPAIR_AFTER_SIGN_STATUS,FlatHelper.PROFILE_COMPLETED_STATUS,FlatHelper.DONE_STATUS];
            handoverNode[FlatHelper.REPAIR_AFTER_SIGN_STATUS] = [FlatHelper.PROFILE_COMPLETED_STATUS];
            handoverNode[FlatHelper.PROFILE_COMPLETED_STATUS] = [FlatHelper.DONE_STATUS];
            Def.statusTree[FlatHelper.ROLE_HANDOVER] = handoverNode;

            let qaNode = [];
            qaNode[FlatHelper.FINANCE_DONE_STATUS] = [FlatHelper.CAN_DELIVER_STATUS];
            qaNode[FlatHelper.CAN_DELIVER_STATUS] = [FlatHelper.FINANCE_DONE_STATUS];
            Def.statusTree[FlatHelper.ROLE_QUALITY_ASSURANCE] = qaNode;

            let wshNode = [];
            wshNode[FlatHelper.FINANCE_DONE_STATUS] = [FlatHelper.CAN_DELIVER_STATUS];
            wshNode[FlatHelper.CAN_DELIVER_STATUS] = [FlatHelper.FINANCE_DONE_STATUS];
            Def.statusTree[FlatHelper.ROLE_WSH] = wshNode;

            return Def.statusTree;
        }
    }

    static getPriorityRole(user){
        let permission = false;
        let userPermission = user.listRoleName.split();
        if(user){
            FlatHelper.PriorityRoles.forEach(element => {
                if(userPermission.indexOf(element) != -1){
                    permission = element;
                    return false;
                }
            });
        }
        return permission;
    }

    static checkCanPermission(user, permission){
        let userPermission = user ? user.listRoleName.split() : [];
        return userPermission.indexOf(permission) != -1;
    }

    static canRequestRepair(product, user){
        return FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) || FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH);
    }

    static canFixRepair(product, user){
        return (product.status == Def.PRODUCT_UNACTIVE_STATUS || product.status == Def.PRODUCT_REPAIRED_STATUS)  && FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH);
    }

    static canChangeDeliverStatus(flat, user){
        let isQa = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH);
        let status = flat.status == FlatHelper.FINANCE_DONE_STATUSS;
        return isQa && status;
    }

    static canRollbackFinalDone(flat, user){
        let isQa = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH);
        let status = flat.status == FlatHelper.CAN_DELIVER_STATUS;
        return isQa && status;
    }


    static canPerformDelivering(flat, user){
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER);
        let status = flat.status == FlatHelper.CAN_DELIVER_STATUS;
        return isHandover && status;
    }

    static canSigning(flat, user){
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) && (flat.handover_id = user.id);
        let status = flat.status == FlatHelper.DELIVERING_STATUS;
        return isHandover && status;
    }

    static canReSigning(flat, user){
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) && (flat.handover_id = user.id);
        let status = flat.status == FlatHelper.SIGNED_STATUS;
        return isHandover && status;
    }

    static canCompleteProfile(flat, user){
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) && (flat.handover_id = user.id);
        let isRepairAfterSign = flat.status == FlatHelper.REPAIR_AFTER_SIGN_STATUS;
        let isSigned = flat.status == FlatHelper.SIGNED_STATUS;
        return isHandover && (isSigned || isRepairAfterSign);
    }

    static canDecline(flat, user){
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) &&  (flat.handover_id = user.id);
        let status = flat.status == FlatHelper.DELIVERING_STATUS;
        let isDecline = flat.is_decline;
        return !isDecline && isHandover && status;
    }

    static canSendRequestRepair(flat, user){
        let statusFinalDone = flat.status == FlatHelper.FINANCE_DONE_STATUS;
        let canDeliver = flat.status >= FlatHelper.DELIVERING_STATUS && flat.status != FlatHelper.DONE_STATUS;
        let isSignedStatus = flat.status >= FlatHelper.SIGNED_STATUS && flat.status != FlatHelper.DONE_STATUS;
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) && (flat.handover_id = user.id);
        let isQa = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH);
        return (isQa && statusFinalDone) || (isHandover && (canDeliver || isSignedStatus));

    }

    static canDone(flat, user){
        let isProfileCompleted = flat.status == FlatHelper.PROFILE_COMPLETED_STATUS;
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) && (flat.handover_id = user.id);
        return (isHandover && isProfileCompleted) ;
    }

    static canRepairAfterSigned(flat, user){
        let isSignedStatus = flat.status == FlatHelper.SIGNED_STATUS;
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) && (flat.handover_id = user.id);
        return isSignedStatus && isHandover;
    }

    static getRepairItemList(flat){
        let repairList = [];
        // const mailPif = {};
        if(flat.productInstanceFlat){
            flat.productInstanceFlat.forEach((productInstance) => {
                if(productInstance.status == FlatHelper.INACTIVE_STATUS) {
                    let mailPif = {
                        pif: productInstance,
                        selectValue: productInstance['send_status'] == 0 ? true : false
                    };
                    repairList.push(mailPif);
                }
            })
        }
        return repairList;
    }

    static calPassPif(flat){
        let pifs = flat.productInstanceFlat;
        let activePif = pifs.filter(function (item) {
            return item.is_deleted != 1;
        });
        let passPif = activePif.filter(function (activeItem) {
            return activeItem.status == Def.PRODUCT_ACTIVE_STATUS;
        })
        return {pass:passPif.length, total:activePif.length};

    }

    static getDownloadProduct(product){

    }

    static getExtention(filename)  {
        // To get the file extension
        return /[.]/.exec(filename) ?
            /[^.]+$/.exec(filename) : undefined;
    };




    static downloadImage = (product= null) => {
        // Main function to download the image

        // To add the time suffix in filename
        let date = new Date();
        // Image URL which we want to download
        let image_URL = 'https://arenaadmin.house3d.com/data/acceptanceData/product/202101/23/19/product_img.png';
        // Getting the extention of the file
        let ext = FlatHelper.getExtention(image_URL);
        ext = '.' + ext[0];
        // Get config and fs from RNFetchBlob
        // config: To pass the downloading related options
        // fs: Directory path where we want our image to download
        const { config, fs } = RNFetchBlob;

        let dir = fs.dirs.DownloadDir + '/arena/';

        fs.isDir(dir).then((isDir) => {
            if(!isDir){
                RNFetchBlob.fs.mkdir(dir).then(() => {
                    console.log("App directory created..");
                    FlatHelper.downloadFile(image_URL, dir, ext);
                })
                    .catch((err) => {
                        console.log("Err : " + JSON.stringify(err));
                    });
            } else {
                FlatHelper.downloadFile(image_URL, dir, ext);
            }
        });



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

    static downloadFile(url, path, ext) {
        console.log('Start download image');
        let date = new Date();
        const { config, fs } = RNFetchBlob;
        let path_url =   date.getTime() + '.png'
        console.log('Url : ' + url);
        console.log('Path Url : ' + path_url);


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
            //  path : path_url
        };
        config(options)
            .fetch('GET', url)
            .then(res => {
                // Showing alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
                alert('Image Downloaded Successfully.'  + res.path());
            })
            .catch(err => {
                console.log("Err download image : " + JSON.stringify(err));
            })
        ;
    }

}
