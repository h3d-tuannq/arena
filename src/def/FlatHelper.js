export default class FlatHelper {

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
        let userPermission = user.listRoleName.split();
        return userPermission.indexOf(permission) != -1;
    }

    
    
}