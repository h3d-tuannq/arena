import Def from "./Def";
import RNFetchBlob from "rn-fetch-blob";
import FlatHelper from "./FlatHelper";

export class OfflineHelper {
    static getDownloadProduct(product){

    }

    static offlineProductData = [];

    static getExtention(filename)  {
        // To get the file extension
        return /[.]/.exec(filename) ?
            /[^.]+$/.exec(filename) : undefined;
    };

    static downloadProductList;




    static downloadDesignImage = (design = null, callback) => {
        return FlatHelper.downloadImage(design.image_path, callback, 1);
    }

    static downloadProductImage = (product = null, callback) => {
        console.log('Start download');
        return FlatHelper.downloadImage(product, callback);
    }
    static downloadImage = (obj, callback, type = 0) => {
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
        let ext = FlatHelper.getExtention(image_URL);
        ext = '.' + ext[0];
        // Get config and fs from RNFetchBlob
        // config: To pass the downloading related options
        // fs: Directory path where we want our image to download
        const { config, fs } = RNFetchBlob;

        let dir = fs.dirs.DownloadDir + '/arena/';
        let path = Def.remoteVersion(dir +  (obj ? ( type ==  0 ? 'product_' : 'design_' ) +   obj.id : date.getTime()) + ext);
        fs.isDir(dir).then((isDir) => {
            if(!isDir){
                RNFetchBlob.fs.mkdir(dir).then(() => {
                    console.log("App directory created..");
                    FlatHelper.downloadFile(obj, path, ext, callback);
                })
                    .catch((err) => {
                        console.log("Err : " + JSON.stringify(err));
                    });
            } else {
                FlatHelper.downloadFile(obj, path, ext, callback);
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

    static downloadFile(obj, path, ext, callback) {
        console.log('Start download image');
        let url = obj.image_path;
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
                // Showing alert after successful downloading
                // console.log('res -> ', JSON.stringify(res));
                if(res && callback){
                    console.log("Call back set Image");
                    callback(res);
                }
                // alert('Image Downloaded Successfully.'  + res.path());
            })
            .catch(err => {
                console.log("Err download image : " + JSON.stringify(err));
            })
        ;
    }
}
