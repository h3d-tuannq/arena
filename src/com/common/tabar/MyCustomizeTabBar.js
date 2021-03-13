import {Modal, TouchableWithoutFeedback} from "react-native";

const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
// import DraggableFlatList from 'react-native-draggable-flatlist'
const {
    View,
    Animated,
    StyleSheet,
    ScrollView,
    Text,
    Platform,
    Dimensions,
    TouchableOpacity

} = ReactNative;
const Button = require('./Button');

import SortMenuIcon from "../../../../assets/icon/icon-sort-cate-menu.svg";

import HideIcon from "../../../../assets/icon/icon-rate.svg";

const WINDOW_WIDTH = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');

import { gestureHandlerRootHOC } from 'react-native-gesture-handler';


class DrawerAbleComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: props.tabs
        };
    }

    render() {
        return (
            <View  style={{left : 0, top:90,width : width, height :height /2, backgroundColor:'#fff', alignItems: "center", borderWidth:1, paddingBottom :10,
                alignSelf:'flex-start'}}>
            {/* <DraggableFlatList
                data={this.state.data}
                renderItem={({ item, index, drag, isActive }) => {
                    return (
                        <TouchableOpacity
                            style={{
                                height: 60,
                                width: width,
                                // backgroundColor:  '#fff000',
                                justifyContent : 'center',
                                // borderColor: '#fff',
                                // borderWidth: 2
                            }}
                            onLongPress={() => {
                                console.log('drag call')
                                drag();
                            }}
                        >
                            <View style={{paddingHorizontal :10, flex:1, justifyContent:'space-between'}}>
                                <View/>
                                <View style={{flexDirection:'row', alignItems:'center' }}>
                                    <View>
                                        <HideIcon width={25} height={25}/>
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: Style.MIDLE_SIZE,
                                            marginLeft: 30
                                        }}
                                    >
                                        {item}
                                    </Text>
                                </View>
                                <View style={{height:2, width: width-20 , backgroundColor: '#b3b3b3', }}>

                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={(item, index) => `draggable-item-${index}`}
                onDragEnd={({ data }) => this.setState({ data })}
            /> */}
            </View>
        )

    }
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Style from "../../../def/Style";

class SortModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: props.tabs
        };
    }
    render() {

        // const ExampleWithHoc = gestureHandlerRootHOC(<DrawerAbleComponent tabs={this.state.data}/>);

        const ExampleWithHoc = gestureHandlerRootHOC(function GestureExample(props) {
            return (
                <View>
                    <DrawerAbleComponent tabs={props.tabs} />
                </View>
            );
        });

        return (
            <Modal  visible={this.props.visible} transparent={true}>
                <TouchableOpacity onRequestClose={()=> {this.props.closeFunction()}} style={styles.modalView} onPress={()=> {this.props.closeFunction()}} activeOpacity={1}>
                    <TouchableWithoutFeedback activeOpacity={1}  style={{width : width, height :height /2 +10, backgroundColor:'#fff', alignItems: "center",
                        justifyContent : 'center', zIndex: 3}} onPress ={ (e) => {
                        // props.closeFun(props.selectedDate)
                        console.log('prevent click');
                        e.preventDefault()
                    }}>

                        {/*<GestureHandlerRootView>*/}

                                {/*<DraggableFlatList*/}
                                    {/*data={this.state.data}*/}
                                    {/*renderItem={({ item, index, drag, isActive }) => {*/}
                                        {/*return (*/}
                                            {/*<TouchableOpacity*/}
                                                {/*style={{*/}
                                                    {/*height: 80,*/}
                                                    {/*width: width,*/}
                                                    {/*backgroundColor:  index %2 ? "blue" : 'red',*/}
                                                    {/*justifyContent : 'center'*/}
                                                {/*}}*/}
                                                {/*onLongPress={() => {*/}
                                                    {/*console.log('drag call')*/}
                                                    {/*drag();*/}
                                                {/*}}*/}
                                            {/*>*/}
                                                {/*<Text*/}
                                                    {/*style={{*/}
                                                        {/*fontWeight: "bold",*/}
                                                        {/*color: "white",*/}
                                                        {/*fontSize: 18*/}
                                                    {/*}}*/}
                                                {/*>*/}
                                                    {/*{item}*/}
                                                {/*</Text>*/}
                                            {/*</TouchableOpacity>*/}
                                        {/*);*/}
                                    {/*}}*/}
                                    {/*keyExtractor={(item, index) => `draggable-item-${index}`}*/}
                                    {/*onDragEnd={({ data }) => this.setState({ data })}*/}
                                {/*/>*/}
                        {/*</GestureHandlerRootView>*/}
                        <ExampleWithHoc tabs={this.state.data}/>

                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )

    }
}

const ScrollableTabBar = createReactClass({
    propTypes: {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        tabs: PropTypes.array,
        backgroundColor: PropTypes.string,
        activeTextColor: PropTypes.string,
        inactiveTextColor: PropTypes.string,
        scrollOffset: PropTypes.number,
        style: ViewPropTypes.style,
        tabStyle: ViewPropTypes.style,
        tabsContainerStyle: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        renderTab: PropTypes.func,
        underlineStyle: ViewPropTypes.style,
        onScroll: PropTypes.func,
    },

    getDefaultProps() {
        return {
            scrollOffset: 52,
            activeTextColor: 'navy',
            inactiveTextColor: 'black',
            backgroundColor: null,
            style: {},
            tabStyle: {},
            tabsContainerStyle: {},
            underlineStyle: {},
        };
    },

    getInitialState() {
        this._tabsMeasurements = [];
        return {
            _leftTabUnderline: new Animated.Value(0),
            _widthTabUnderline: new Animated.Value(0),
            _containerWidth: null,
            modalVisible: false,
        };
    },

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    },

    closeFunction(){
        this.setState({modalVisible : false});
    },


componentDidMount() {
        this.props.scrollValue.addListener(this.updateView);
    },

    updateView(offset) {
        const position = Math.floor(offset.value);
        const pageOffset = offset.value % 1;
        const tabCount = this.props.tabs.length;
        const lastTabPosition = tabCount - 1;

        if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
            return;
        }

        if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
            this.updateTabPanel(position, pageOffset);
            this.updateTabUnderline(position, pageOffset, tabCount);
        }
    },

    necessarilyMeasurementsCompleted(position, isLastTab) {
        return this._tabsMeasurements[position] &&
            (isLastTab || this._tabsMeasurements[position + 1]) &&
            this._tabContainerMeasurements &&
            this._containerMeasurements;
    },

    updateTabPanel(position, pageOffset) {
        const containerWidth = this._containerMeasurements.width;
        const tabWidth = this._tabsMeasurements[position].width;
        const nextTabMeasurements = this._tabsMeasurements[position + 1];
        const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
        const tabOffset = this._tabsMeasurements[position].left;
        const absolutePageOffset = pageOffset * tabWidth;
        let newScrollX = tabOffset + absolutePageOffset;

        // center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
        newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
        newScrollX = newScrollX >= 0 ? newScrollX : 0;

        if (Platform.OS === 'android') {
            this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false, });
        } else {
            const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width);
            newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
            this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false, });
        }

    },

    updateTabUnderline(position, pageOffset, tabCount) {
        const lineLeft = this._tabsMeasurements[position].left;
        const lineRight = this._tabsMeasurements[position].right;

        if (position < tabCount - 1) {
            const nextTabLeft = this._tabsMeasurements[position + 1].left;
            const nextTabRight = this._tabsMeasurements[position + 1].right;

            const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
            const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

            this.state._leftTabUnderline.setValue(newLineLeft);
            this.state._widthTabUnderline.setValue(newLineRight - newLineLeft);
        } else {
            this.state._leftTabUnderline.setValue(lineLeft);
            this.state._widthTabUnderline.setValue(lineRight - lineLeft);
        }
    },

    renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
        const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';

        return <Button
            key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View style={[styles.tab, this.props.tabStyle, ]}>
                <Text style={[{color: textColor, fontWeight, }, textStyle, ]}>
                    {name}
                </Text>
            </View>
        </Button>;
    },

    measureTab(page, event) {
        const { x, width, height, } = event.nativeEvent.layout;
        this._tabsMeasurements[page] = {left: x, right: x + width, width, height, };
        this.updateView({value: this.props.scrollValue.__getValue(), });
    },

    render() {
        const tabUnderlineStyle = {
            position: 'absolute',
            height: 4,
            backgroundColor: 'navy',
            bottom: 0,
        };

        const dynamicTabUnderline = {
            left: this.state._leftTabUnderline,
            width: this.state._widthTabUnderline,
        };

        return <View
            style={[styles.container, {backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center'}, this.props.style, ]}
            onLayout={this.onContainerLayout}
        >
            {/*<TouchableOpacity style={{marginLeft : 5, paddingLeft: 10, width : 50 , paddingRight: 15 }} onPress={()=> {*/}
                {/*// this.setModalVisible(true);*/}
                {/*console.log("Tabs :"+ JSON.stringify(this.props.tabs));*/}
                {/*this.props.navigation.navigate('CustomMenu', {data:this.props.tabs});*/}
            {/*}}*/}
            {/*>*/}
                {/*<SortMenuIcon width={25} height={25}/>*/}
            {/*</TouchableOpacity>*/}
            <ScrollView
                ref={(scrollView) => { this._scrollView = scrollView; }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                directionalLockEnabled={true}
                bounces={false}
                scrollsToTop={false}
            >
                <View
                    style={[styles.tabs, {width: this.state._containerWidth, }, this.props.tabsContainerStyle, ]}
                    ref={'tabContainer'}
                    onLayout={this.onTabContainerLayout}
                >
                    {this.props.tabs.map((name, page) => {
                        const isTabActive = this.props.activeTab === page;
                        const renderTab = this.props.renderTab || this.renderTab;
                        return renderTab(name, page, isTabActive, this.props.goToPage, this.measureTab.bind(this, page));
                    })}
                    <Animated.View style={[tabUnderlineStyle, dynamicTabUnderline, this.props.underlineStyle, ]} />
                </View>
            </ScrollView>
            <SortModal visible={this.state.modalVisible} animationType="slide"  tabs={this.props.tabs} closeFunction={this.closeFunction}
                       transparent={true} />
        </View>;
    },

    componentDidUpdate(prevProps) {
        // If the tabs change, force the width of the tabs container to be recalculated
        if (JSON.stringify(prevProps.tabs) !== JSON.stringify(this.props.tabs) && this.state._containerWidth) {
            this.setState({ _containerWidth: null, });
        }
    },

    onTabContainerLayout(e) {
        this._tabContainerMeasurements = e.nativeEvent.layout;
        let width = this._tabContainerMeasurements.width;
        if (width < WINDOW_WIDTH) {
            width = WINDOW_WIDTH;
        }
        this.setState({ _containerWidth: width, });
        this.updateView({value: this.props.scrollValue.__getValue(), });
    },

    onContainerLayout(e) {
        this._containerMeasurements = e.nativeEvent.layout;
        this.updateView({value: this.props.scrollValue.__getValue(), });
    },
});

module.exports = ScrollableTabBar;

const styles = StyleSheet.create({
    tab: {
        height: 49,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    container: {
        height: 50,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#ccc',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalView : {
        // padding: 5,
        paddingVertical : 10,
        height :height,
        width : width,

        shadowOpacity:1,
        shadowRadius: 3.84,
        flex: 1,
         // backgroundColor : 'red'
    },
});
