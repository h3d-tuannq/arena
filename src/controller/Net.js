import Def from '../def/Def';
/*
  Phục vụ mục đích đăng nhập, đăng ký
*/
export default class Net{

  // jsonData là string json đã được stringify
    static sendRequest(callback,errCallback,url,method,dataObject = null, contentType = 'application/json; charset=utf-8' )
    {
        // console.log(`SENDING: ${JSON.stringify(dataObject)}`);
        // console.log(`TO: ${url}`);
        // console.log(`METHOD: ${method}`);
        // console.log(`{ 'Authorization': ${Def.login_token} }`)

        if(method == Def.GET_METHOD)
        {
            fetch(url, {
                method: method,
                headers: {
                    'Authorization': Def.login_token,
                    'content-type':contentType
                }
            })
                .then(response => {
                    // console.log(response);
                    response.text()
                })
                .then(text => {

                    try {
                        let data = JSON.parse(text);
                        callback(data)
                    } catch(err) {
                        errCallback(err + ': ' + url);
                    }
                })
                .catch((error) => { errCallback(error);}) ;
        }
        else if(method == Def.POST_METHOD )
        {
            let formData = new FormData();
            if(dataObject){
                for (var property in dataObject) {
                    formData.append(property, dataObject[property]);
                }
            }

            let sendObj = {
                method: method,
                headers: {
                    'Authorization': Def.login_token,
                    'Content-Type': contentType,
                    'Accept': 'application/json',
                }
            };

      if(dataObject){
          sendObj = {
              method: method,
              headers: {
                  'Authorization': Def.login_token
              },
              body : formData
          }
      }

             console.log('SendingData: ' + JSON.stringify(sendObj));


      fetch(url, sendObj)
      .then(response => response.text())
      .then(text => {
        try {
            let data = JSON.parse(text);
            callback(data)
        } catch(err) {
          errCallback(err + ': ' + url);
        }
      })
      .catch((error) => { errCallback(error);}) ;
    }
    else if(method == Def.DELETE_METHOD )
    {
      fetch(url, {
        method: method,
        headers: {

                    'Authorization': Def.login_token
                }
            })
                .then(response => response.text())
                .then(text => {
                    try {
                        let data = JSON.parse(text);
                        callback(data)
                    } catch(err) {
                        errCallback(err + ': ' + url);
                    }
                })
                .catch((error) => { errCallback(error);}) ;
        }
    }


  static uploadImage(callback,errCallback,url,method,dataObject = null, contentType = 'application/json; charset=utf-8' )
    {
        console.log(`SENDING: ${JSON.stringify(dataObject)}`);
        console.log(`TO: ${url}`);
        console.log(`METHOD: ${method}`);
        console.log(`{ 'Authorization': ${Def.login_token} }`)
        if(method == Def.POST_METHOD ) {
            let formData = new FormData();
            for (var property in dataObject){
                formData.append(property, dataObject[property]);
            }
            let sendObj = {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': Def.login_token,
                    'Content-Type': contentType,
                }
            };

            if (dataObject) {
                sendObj = {
                    method: method,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': Def.login_token,
                    },
                    body: formData
                }
            }
            console.log(JSON.stringify(sendObj));
            try {
                console.log('fetch api + ' + url);
                fetch(url, sendObj)
                    .then(response =>
                        response.text()
                    )
                    .then(text => {
                        try {
                            let data = JSON.parse(text);
                            callback(data)
                        } catch (err) {
                            console.log("Error callback  error data+ " + JSON.stringify(err));
                            errCallback(err + ': ' + url);
                        }
                    })
                    .catch((error) => {
                        console.log("Error callback + " + JSON.stringify(error));
                        errCallback(error);
                    });
            } catch (err) {
                console.log("Loi call api upload" + err);
            }
        }

  }

}

