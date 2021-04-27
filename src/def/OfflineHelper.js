import Def from "./Def";
import RNFetchBlob from "rn-fetch-blob";
import FlatHelper from "./FlatHelper";

const PRODUCT_TYPE = 0;
const DESIGN_TYPE = 1;

export class OfflineHelper {
    static getDownloadProduct(product){

    }

    static offlineProductData = [];
    static offlineDesignData = [];

    static getExtention(filename)  {
        // To get the file extension
        return /[.]/.exec(filename) ?
            /[^.]+$/.exec(filename) : undefined;
    };

    static downloadProductList;
    static downloadDesignList;




    static downloadDesignImage = (design = null, callback, falseCallback = null) => {
        return OfflineHelper.downloadImage(design, callback, falseCallback , DESIGN_TYPE);
    }

    static downloadProductImage = (product = null, callback = null, falseCallback = null) => {
        return OfflineHelper.downloadImage(product, callback, falseCallback, PRODUCT_TYPE);
    }
    static downloadImage = (obj, callback = null, falseCallback = null, type = PRODUCT_TYPE) => {
        // Main function to download the image
        let sourcePath = obj.image_path;

        if(!sourcePath){
            sourcePath = 'product/202102/24/81/product_img.jpg?v=2';
        }

        console.log('Source Path : ' + sourcePath);

        // To add the time suffix in filename
        let date = new Date();
        // Image URL which we want to download
        let image_URL = Def.getThumnailImg(obj.image_path);
        // Getting the extention of the file
        let ext = OfflineHelper.getExtention(image_URL);
        ext = '.' + ext[0];
        // Get config and fs from RNFetchBlob
        // config: To pass the downloading related options
        // fs: Directory path where we want our image to download
        const { config, fs } = RNFetchBlob;

        let dir = fs.dirs.DownloadDir + '/arena/';
        let path = Def.remoteVersion(dir +  (obj ? ( type ==  PRODUCT_TYPE ? 'product_' : 'design_' ) +   obj.id : date.getTime()) + ext);
        fs.isDir(dir).then((isDir) => {
            if(!isDir){
                RNFetchBlob.fs.mkdir(dir).then(() => {
                    console.log("App directory created..");
                    OfflineHelper.downloadFile(obj, path, ext, callback, falseCallback);
                })
                    .catch((err) => {
                        console.log("Err : " + JSON.stringify(err));
                    });
            } else {
                OfflineHelper.downloadFile(obj, path, ext, callback, falseCallback);
            }
        });

        return path;



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

    static downloadFile(obj, path, ext, callback = null, falseCallback = null) {
        let url = Def.getThumnailImg(obj.image_path);
        let date = new Date();
        const { config, fs } = RNFetchBlob;
        console.log('Url : ' + url);
        console.log('Path Url : ' + path);


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
            path : path
        };
        config(options)
            .fetch('GET', url)
            .then(res => {
                console.log('in then')
                // Showing alert after successful downloading
                //  console.log('res -> ', JSON.stringify(res));
                 if(res && callback){
                     callback(obj, res);
                 }
                  // alert('Image Downloaded Successfully.'  + res.path());
            })
            .catch(err => {
                console.log('in err')
                console.log("Err download image : " + JSON.stringify(err));
                if(falseCallback) {
                    falseCallback(obj);
                }
            })
        ;
    }

    static makeArrayDataWithIdKey = (arr) => {
        let rs = [];
        arr.forEach(item => {
            rs[item['id']] = item;
        });
        return rs;

    }

}
