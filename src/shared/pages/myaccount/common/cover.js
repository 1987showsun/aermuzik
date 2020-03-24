/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import { faChessQueen }               from '@fortawesome/free-solid-svg-icons';
import { connect }                    from 'react-redux';
import { LazyLoadImage }              from 'react-lazy-load-image-component';
import queryString                    from 'query-string';
import toaster                        from "toasted-notes";
import dayjs                          from 'dayjs';
import S3                             from 'react-aws-s3';

// Modules
import Loading                        from '../../../nodules/loading';

// Actions
import { coverCrop, changeMemberCover } from '../../../actions/member';

// Javascripts
import dataURLtoFile                  from '../../../public/javascripts/dataURLtoFile';

// Jsons
import S3Config                       from '../../../public/json/s3.json';

const Cover = ({ dispatch, coverCropBeforeSrc, coverCropAfterSrc, id, src, level, location }) => {

    const [ stateLoading, setLoading ] = useState(false);
    const [ stateCover  , setCover   ] = useState('');

    const handleChange = (e) => {
        const { files, type } = e.target;
        if( type=="file" ){
            const file     = files[0];
            if( file!=undefined ){
                const { size } = file;
                if( (size/1000)<400 ){
                    const reader   = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        dispatch( coverCrop({ before: reader.result }) );
                    }                
                }else{
                    alert('Exceeded file capacity limit');
                }
            }
        }
    }

    useEffect(()=>{
        setCover(src);
    },[src]);

    useEffect(()=>{
        setCover(coverCropAfterSrc);
        if( coverCropBeforeSrc!=coverCropAfterSrc ){

            const { pathname, search } = location;
            const ReactS3Client        = new S3(S3Config);
            const newName              = `${id}_${dayjs().valueOf()}`;
            const toasterFunction      = ({status='failure' , status_text='Update failure'}) => {
                toaster.notify( <div className={`toaster-status-block toaster-${status}`}>{status_text}</div> , {
                    position    : "bottom-right",
                    duration    : 3000
                });
            }

            setLoading(true); 
            ReactS3Client.uploadFile(dataURLtoFile(coverCropAfterSrc, newName), newName).then(data => {
                dispatch( changeMemberCover(pathname, queryString.parse(search), data) ).then(res => {
                    
                    let status                 = 'failure';
                    let status_text            = 'Delete failure';
                    setLoading(false);
                    if( res['status']==200 ){
                        status      = 'success';
                        status_text = 'Update successful';
                    }
                    toasterFunction({ status, status_text });
                });
            }).catch(err => {
                toasterFunction();
            })
        }
    },[coverCropAfterSrc]);

    return(
        <>
            <div className="img">
                <input type="file" name="cover" onChange={handleChange.bind(this)} />
                {
                    stateLoading &&
                        <Loading 
                            className = "myaccount-cover-loading"
                        />
                }
                <LazyLoadImage 
                    alt    =  {''}
                    src    = {stateCover}
                    effect ="blur"
                />
                <span className={`level-wrap ${level}`} title={level=='general'? '一般會員':'VIP'}>
                    <i>
                        <FontAwesomeIcon icon={faChessQueen} />
                    </i>
                </span>
            </div>
        </>
    );
}

const mapStateToProps = state => {
    return{
        coverCropBeforeSrc : state.member.coverCrop.before,
        coverCropAfterSrc  : state.member.coverCrop.after
    }
}

export default connect( mapStateToProps )( Cover );