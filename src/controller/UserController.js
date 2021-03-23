import Def from "../def/Def";
import {Alert, Platform} from 'react-native'
import Net from  './Net'

export default class UserController{

    static async  login(email, password ,navigation=null, successCallback, falseCallback) {

        let param = {'username' : email, 'password' : password};
        if(navigation){
            Def.mainNavigate = navigation;
        }

        console.log("Url : " + Def.ARENA_BASE + '/api/user/login' + " Params : " + JSON.stringify(param));

        Net.sendRequest(this.onLoginSuccess,this.onLoginFalse,Def.ARENA_BASE + '/api/user/login' , Def.POST_METHOD , param);
        // if(Def.setLoader)
        //     Def.setLoader(false);

        // Def.REFESH_SCREEN.push('my-screen', 'update-partner-screen');
        // navigation.navigate('My', {'screen':'my-screen'});

    };


    static async logout(successCallback, falseCallback){
        let param = {'username': Def.user_info['email'], access_token: Def.user_info['access_token']};
        if(navigation){
            Def.mainNavigate = navigation;
        }
        Net.sendRequest(this.logoutCallback,this.onLoginFalse,Def.ARENA_BASE + '/api/user/logout' , Def.POST_METHOD , param);
    }

    static async onLoginSuccess(data){
        console.log("Data return : " + JSON.stringify(data));
        try {
            if(data){
                console.log("Data return : " + JSON.stringify(data));
                if(data['err_code']) {
                    Alert.alert(
                        "Cảnh báo",
                        data['msg'],
                        [
                            {
                                text: "Thử lại",
                                onPress: () => {Def.setIsLogin(false)},
                                style: 'cancel',
                            }
                        ],
                        {cancelable: false},
                    );
                    return ;
                }
                console.log('data login success' + JSON.stringify(data));

                let acess_token = data['access_token'];
                Def.login_token = `Bearer ${acess_token}`;
                Def.email = data['email'];
                Def.username = data['username'];
                Def.user_info = data;



                // let token = await messaging().getToken();
                //
                //
                // AsyncStorage.setItem('fcmId', token);
                // UserController.registerFcmId(token);

            }
        } catch (err){
            console.log('Error : ' + err);
        }

        console.log("Test");

        Def.REFESH_SCREEN.push('flat-screen');
        Def.mainNavigate.navigate('Flat',{screen:'flat-screen', params: {'refresh' : true}});
    }

    static async onLoginFalse (data){
        console.log("Login False : " + JSON.stringify(data));
    }

}
