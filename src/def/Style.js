import {PixelRatio, StyleSheet, Dimensions} from 'react-native'

const {width, height} = Dimensions.get('window');

export default class Style{
    static HEADER_HEIGHT = PixelRatio.get() < 2? 43 :45;
    static TITLE_SIZE = PixelRatio.get() < 2 ? 15 :17;
    static MIDLE_SIZE = PixelRatio.get() < 2 ? 13 :14;
    static NORMAL_SIZE = PixelRatio.get() < 2 ? 11 :12;
    static SMALL_SIZE = PixelRatio.get() < 2 ? 10:11;
    static BIG_SIZE = PixelRatio.get() < 2 ? 17 :19;
    static BOTTOM_HEIGHT = PixelRatio.get() < 2? 70:80;

    static DEFAUT_RED_COLOR = '#AD2428';
    static DEFAUT_BLUE_COLOR = '#e51c8b';// '#305E74';

    static GREY_TEXT_COLOR = '#b3b3b3';
    static GREY_BACKGROUND_COLOR = "#e6e6e6";


    static DRAWER_MENU_SIZE = PixelRatio.get() < 2? 36 :38;

    static DRAWER_MENU_ICON_SIZE = PixelRatio.get() < 2 ? 25 :27;

    static CART_ICON_SIZE = PixelRatio.get() < 2 ? 25 :27;

    static LOGO_WIDTH = PixelRatio.get() < 2 ? 118 :120;

    static LOGO_HEIGHT = PixelRatio.get() < 2 ? 30 :31;

    static BACK_ICON_SIZE = PixelRatio.get() < 2? 22 :24;


    static styles = StyleSheet.create({
        container: {
            flex : 1,
            paddingLeft: 15,
            backgroundColor: '#fff',
            paddingTop : 5
        },
        slider: {
            justifyContent: 'center',
            paddingTop: 5,
            padding: 8,
            height: 120,
            borderRadius: 5,
            backgroundColor: "#e6e6e6",
            marginRight : 15
        },
        cardStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            width: width,
            height: width/2,

        },


        programListStyle : {

        },
        carousel: {
            // paddingVertical: 2,
            // maxHeight : width*0.95,
            borderRadius: 5,
            // marginHorizontal : 10,
            justifyContent:'center',

        },

        cardImg: {
            width: width,
            paddingVertical :0,
            height: width * 0.5,
            borderRadius : 5,
        },
        schemeSlideImg: {
            width: width,
            paddingVertical :5,
            height: width ,
            borderRadius : 5,
        },
        schemeCardStyle:{
            justifyContent: 'center',
            alignItems: 'center',
            width: width,
            height: width,
        },



    });

    static text_styles = StyleSheet.create({
        bigText:{
          fontSize : Style.BIG_SIZE
        },
        titleText: {
            marginLeft: 5,
            fontSize : Style.TITLE_SIZE,
            fontWeight: 'bold',
        },
        titleTextNotBold: {
            fontSize : Style.TITLE_SIZE,
        },

        middleText: {
            fontSize : Style.MIDLE_SIZE,
        },
        priceText : {
            fontSize : Style.NORMAL_SIZE,
            color: Style.DEFAUT_RED_COLOR,
            fontWeight: 'bold'
        },

        redTitleText: {
            fontSize : Style.TITLE_SIZE,
            fontWeight: 'bold',
            color: Style.DEFAUT_RED_COLOR,
        },
        whiteTitleText: {
            fontSize : Style.TITLE_SIZE,
            // fontWeight: 'bold',
            color: '#fff',
        },

        infoText: {
            fontSize : Style.SMALL_SIZE,
            color: Style.GREY_TEXT_COLOR,
        },
        normalText: {
            fontSize : Style.NORMAL_SIZE,
        },
        redText:{

        },
    });

}
