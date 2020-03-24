/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                  from 'react';
import ImageEditorRc          from 'react-cropper';
import { FontAwesomeIcon }    from '@fortawesome/react-fontawesome';
import { faRedoAlt, faUndo, faSearchPlus, faSearchMinus , faTimesCircle, faCheckCircle }from '@fortawesome/free-solid-svg-icons';
//import 'cropperjs/dist/cropper.css';
import './style.css';

// images
import { ReactComponent as RotatePositive90 } from './public/images/icon/rotatePositive90.svg';
import { ReactComponent as RotateNegative90 } from './public/images/icon/rotateNegative90.svg';

export default class Index extends React.Component{

    constructor(props){
        super(props);
        this.cropper = React.createRef(null);
        this.state = {
            className          : props.className   || '',
            style              : props.style       || {},
            src                : props.src         || null,
            aspectRatio        : props.aspectRatio || 1,
            inOpen             : false,
            rotate             : 0,
            initZoom           : 0,
            endZoom            : 0,
            zoom               : 0,
            initialAspectRatio : 0,
            zoomPercentage     : 0
        }
    }

    static getDerivedStateFromProps(props,state){

        
        let inOpen = state.inOpen;
        if( props.src!=state.src ){
            inOpen = state.src!=null && props.src!=undefined && props.src!=''? true:false;
        }else{
            inOpen = props.src!=null && props.src!=undefined && props.src!=''? true:false;
        }

        return{
            src          : props.src,
            inOpen       : inOpen
        }
    }

    render(){

        const { className, style, src, aspectRatio, inOpen, rotate, zoomPercentage } = this.state;
    
        return (
          <>
            <div className={`crop-wrap ${className} ${inOpen}`} style={style}>
                <ImageEditorRc
                    className            = "crop-container"
                    ref                  = {this.cropper}
                    src                  = {src}
                    // src                  = {"https://i.kfs.io/playlist/global/66279518v1/cropresize/300x300.jpg"}
                    // src                  = {"https://i.kfs.io/article5/global/19,23372,1v2/original.png"}
                    aspectRatio          = {aspectRatio}
                    autoCropArea         = {1}
                    style                = {{ width: '100%',height:'100%'}}
                    strict               = {false}
                    guides               = {false}
                    highlight            = {false}
                    dragCrop             = {false}
                    zoomOnWheel          = {false}
                    //cropBoxMovable       = {false}
                    cropBoxResizable     = {false}
                    restore              = {false}
                    mouseWheelZoom       = {false}
                    responsive           = {true}
                    movable              = {true}
                    center               = {true}
                    resizable            = {true}
                    hasSameSize          = {true}
                    viewMode             = {2}
                    dragMode             = 'move'
                    ready                = {()=>{
                        const { width, naturalWidth } = this.cropper.current.getImageData();
                        this.setState({
                        initZoom : width/naturalWidth,
                        zoom     : width/naturalWidth
                        })
                    }}
                />
                <ul className="crop-control">
                    <li>
                        <button name="reverseRotation" className="docs-tooltip left" onClick={this.handleButton.bind(this,'reverseRotation')}>
                            <FontAwesomeIcon icon={faUndo}/>
                        </button>
                        <div className="crop-input-box">
                            <input type="text" name="rotate" value={rotate} onChange={this.handleChange.bind(this)} />
                            <span className="crop-unit">deg</span>
                        </div>
                        <button name="forwardRotation" className="docs-tooltip right" onClick={this.handleButton.bind(this,'forwardRotation')}>
                            <FontAwesomeIcon icon={faRedoAlt}/>
                        </button>
                    </li>
                    <li>
                        <button name="zoomout" className="docs-tooltip left" onClick={this.handleButton.bind(this,'zoomout')}>
                            <FontAwesomeIcon icon={faSearchMinus} />
                        </button>
                        <div className="crop-input-box">
                            <input type="text" name="zoomPercentage" value={zoomPercentage} onChange={this.handleChange.bind(this)} />
                            <span className="crop-unit">&#37;</span>
                        </div>
                        <button name="zoomin" className="docs-tooltip right" onClick={this.handleButton.bind(this,'zoomin')}>
                            <FontAwesomeIcon icon={faSearchPlus} />
                        </button>
                    </li>
                    <li>
                        <button className="inline crop-actionButton no" onClick={this.handleAction.bind(this,'cancel')}>
                            <i><FontAwesomeIcon icon ={faTimesCircle}/></i>
                            <span className="prompt">取消</span>
                        </button>
                        <button className="inline crop-actionButton yes" onClick={this.handleAction.bind(this,'cropper')}>
                            <i><FontAwesomeIcon icon ={faCheckCircle}/></i>
                            <span className="prompt">裁切</span>
                        </button>
                    </li>
                </ul>
            </div>
          </>
        );
    }

    handleAction = ( actionType ) => {
        switch( actionType ){
          case 'cropper':
            this.setState({
                src     : null,
                inOpen  : false
            },()=>{
                if( this.props.returnCrop!=undefined ){
                    this.props.returnCrop({
                        src  : null,
                        crop : this.cropper.current.getCroppedCanvas().toDataURL()
                    });
                }
            })
            break;
    
          default:
            this.setState({
                src     : null,
                inOpen  : false
            },()=>{
                if( this.props.returnCrop!=undefined ){
                    this.props.returnCrop({
                        src  : null,
                        crop : null
                    });
                }
            })
            break;
        }
    }

    handleChange = (e) => {
        let { name, value }    = e.target;
        let { initZoom, zoom } = this.state;
        switch( name ){
            case 'rotate':
                value = isNaN(Number(value))? 0:value;
                const cropperRotate              = this.cropper.current.getData().rotate;
                const rotate                     = value%360;
                this.setState({
                    [name]: rotate
                },()=>{
                    this.cropper.current.rotate(rotate-cropperRotate);
                })
                break;

            case 'zoomPercentage':
                
                if( isNaN(Number(value)) ){
                    value = 0
                }else if( value<=0  ){
                    value = 0
                }else if( value>100 ){
                    value = 100;
                }
                zoom  = (value*((2-initZoom)/100))+initZoom;

                this.setState({
                    zoom,
                    zoomPercentage: parseInt(value)
                },()=>{
                    this.cropper.current.zoomTo( zoom );
                })
                break;

            default:
                break;
        }
    }

    handleButton = ( actionType ) => {
        let   { initZoom, zoom, rotate } = this.state;
        const { width, naturalWidth }    = this.cropper.current.getImageData();
        const cropperRotate              = this.cropper.current.getData().rotate;
    
        switch( actionType ){
            case 'forwardRotation':
                // 正
                rotate = cropperRotate+1;
                this.setState({
                    rotate: rotate
                },()=>{
                    this.cropper.current.rotate(rotate-cropperRotate);
                });
                break;

            case 'reverseRotation':
                // 負
                rotate = cropperRotate-1;
                this.setState({
                    rotate: rotate
                },()=>{
                    this.cropper.current.rotate(rotate-cropperRotate);
                });
                break;
        
            case 'zoomin':
                zoom = ((width/naturalWidth)+0.1);
                if( zoom>=2 ){
                    zoom = 2;
                }
                this.setState({
                    zoom,
                    zoomPercentage: Math.floor((zoom-initZoom)/((2-initZoom)/100))
                },()=>{
                    this.cropper.current.zoomTo( zoom );
                })
                break;
    
            case 'zoomout':
                zoom = zoom-0.1;
                if( zoom<=initZoom ){
                    zoom = initZoom;
                }
                this.setState({
                    zoom,
                    zoomPercentage: Math.floor((zoom-initZoom)/((2-initZoom)/100))
                },()=>{
                    this.cropper.current.zoomTo( zoom );
                })
                break;
    
            default:
                break;
        }
    }
}