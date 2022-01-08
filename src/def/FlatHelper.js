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
    static UPDATE_DEADLINE = 3;
    static READY_TO_DELIVER = 4;
    static MARK_BUILT = 5;


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

    static DECLINE_FILTER_STATUS = -1;
    static ABSENTEE_HANOVER_FILTER_STATUS = -2;
    static ONLINE_HANOVER_FILTER_STATUS = -3;
    static BUILT_FILTER_STATUS = -4;

    static COMMENT_TYPE = 3;
    static APPROVE_REPAIR_TYPE = 2;
    static REPAIRED_TYPE = 1;
    static REQUEST_TYPE = 0;

    static PIF_ACTIVE_STATUS = 1; // Đạt
    static PIF_REPAIRED_STATUS = 2 ; // Đã chỉnh sửa
    static PIF_UNACTIVE_STATUS = 0; // Không đạt
    static PIF_CANCEL_STATUS  = -1; // Trang thái hủy bỏ ko sử dụng trong hệ thống

    // Loại yêu cầu chỉnh sửa, comment, hoàn thành chỉnh sửa item
    static STATUS_REQUEST_REPAIR_TYPE = 0; // Yêu cầu chỉnh sửa
    static STATUS_REPAIRED_TYPE = 1 ; // Đã chỉnh sửa
    static STATUS_CANCEL_TYPE = -1; // Hủy
    static STATUS_COMMENT_TYPE = -2; // Yêu cầu chỉnh sửa


    static PriorityRoles = [FlatHelper.ROLE_ADMINISTRATOR,FlatHelper.ROLE_WSH,FlatHelper.ROLE_QUALITY_ASSURANCE,FlatHelper.ROLE_DEFECT,FlatHelper.ROLE_CSKH,FlatHelper.ROLE_HANDOVER, FlatHelper.ROLE_OWNER];


    static FlatSTatusList = {0: "Chưa kích hoạt", 1: "Hoạt động", 2: "Hoàn thành nghĩa vụ tài chính", 3: "Đủ điều kiện bàn giao", 4: "Đang bàn giao", 5:"Đã ký nhận bàn giao" , 6:"Sữa chữa sau bàn giao", 8:"Đã hoàn thiện hồ sơ", 7:"Đã hoàn thành"};
    static FlatStatusData = [
            {'id': -4 , 'name' :"Hoàn thành xây dựng"},
            {'id': -2 , 'name': "Từ chối bàn giao"},
            {'id': -3 , 'name' :"Bàn giao vắng mặt"},
            {'id': 2 , 'name': "Hoàn thành nghĩa vụ tài chính"},
            {'id': 3 , 'name': "Đủ điều kiện bàn giao"},
            {'id': 4 , 'name': "Đang bàn giao"},
            {'id': 5 , 'name':"Đã ký nhận bàn giao"} ,
            {'id': 6 , 'name':"Sữa chữa sau bàn giao"},
            {'id': 8 , 'name':"Đã hoàn thiện hồ sơ"}
        ];

    static RoleName = {'handover' : 'NVBG', 'guest' : 'Khách', 'wsh' : 'WSH', 'defect':'Defect' , 'owner':'Chủ nhà'};

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
        if(user){
            let userPermission = user.listRoleName.split();
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
        let userPermission = user ? user.listRoleName : [];
        // console.log('User Permission : ' + userPermission  + ' permision' + permission  +' -- '+ userPermission.indexOf(permission));
        return userPermission.indexOf(permission) != -1;
    }

    static canRequestRepair(product, user){
        return FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) || FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH) || FlatHelper.checkCanPermission(user, FlatHelper.ROLE_DEFECT);
    }

    static canFixRepair(product, user){
        return (product.status == Def.PRODUCT_UNACTIVE_STATUS )  && FlatHelper.checkCanPermission(user, FlatHelper.ROLE_DEFECT);
    }

    static canApproveRepairedProduct(product, user){
        return (product.status == Def.PRODUCT_REPAIRED_STATUS)  && FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH);
    }

    static canComment(product, user){
        return (product.status !== Def.PRODUCT_CANCEL_STATUS)  && (FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH) || FlatHelper.checkCanPermission(user, FlatHelper.ROLE_DEFECT) || FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER));
    }

    static canChangeDeliverStatus(flat, user){
        return false;
        let isQa = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH);
        let financeDone = flat.status == FlatHelper.FINANCE_DONE_STATUS;
        return isQa && financeDone;
    }

    static  readyToDeliver(flat, user){
        let isQa = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH);
        return  (isQa && !flat.highlight_re_schedule  && !flat.deliver_date && flat.status > FlatHelper.DELIVERING_STATUS && FlatHelper.checkCompletedProduct(flat));
    }

    static canRollbackFinalDone(flat, user){
        let isQa = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH);
        let status = flat.status == FlatHelper.CAN_DELIVER_STATUS;
        return isQa && status;
    }


    static canPerformDelivering(flat, user){
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER);
        let status = flat.status == FlatHelper.CAN_DELIVER_STATUS;
        return isHandover && status && flat.deliver_date;
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

    static canAbsenteeHanover(flat, user){
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) &&  (flat.handover_id = user.id);
        let status = flat.status == FlatHelper.DELIVERING_STATUS;
        return  isHandover && status;
    }


    static canSendRequestRepair(flat, user){
        let calPif = FlatHelper.calPassPif(flat);
        if(calPif.pass == calPif.total){
            return false;
        }
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

    static canChangeDeadlineCompleted(flat, user){
            let isDefect =  FlatHelper.checkCanPermission(user, FlatHelper.ROLE_DEFECT);
            let isArn = flat.building &&  (flat.building.code == 'THE ARENA CAM RANH') ;
            return isDefect &&  (flat.status) != FlatHelper.DONE_STATUS && isArn;
    }


    static canRepairAfterSigned(flat, user){
        let isSignedStatus = flat.status == FlatHelper.SIGNED_STATUS;
        let isHandover = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_HANDOVER) && (flat.handover_id = user.id);
        return isSignedStatus && isHandover;
    }

    static canMarkBuilt(flat, user)
    {
        let is_wsh = FlatHelper.checkCanPermission(user, FlatHelper.ROLE_WSH);
        let is_built = flat.is_built;
        let status = flat.status == FlatHelper.ACTIVE_STATUS || flat.status == FlatHelper.FINANCE_DONE_STATUS;
        return !is_built && is_wsh && status;
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
        let pifs = flat.productInstanceFlat ? flat.productInstanceFlat : [];
        let activePif =  pifs.filter(function (item) {
            return item.is_deleted != 1;
        });
        let passPif = activePif.filter(function (activeItem) {
            return activeItem.status == Def.PRODUCT_ACTIVE_STATUS;
        })
        return {pass:passPif.length, total:activePif.length};

    }
    static calPassPifStr(flat){
        let calPassPif = FlatHelper.calPassPif(flat);
        return calPassPif ?  calPassPif.pass + '/' + calPassPif.total : '0/0';
    }


    static checkCompletedProduct(flat){
        let pifs = flat.productInstanceFlat;
        let activePif = pifs.filter(function (item) {
            return item.is_deleted != 1;
        });
        let passPif = activePif.filter(function (activeItem) {
            return activeItem.status == Def.PRODUCT_ACTIVE_STATUS;
        })
        return passPif.length == activePif.length;

    }

    static getRoleName(role){
        if(FlatHelper.RoleName[role]){
            return FlatHelper.RoleName[role];
        }
        return '';
    }

}
