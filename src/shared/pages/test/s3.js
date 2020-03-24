/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React from 'react';
//import S3FileUpload from 'react-s3';

export default () => {

    const handleChange = (e) => {
        const files  = e.target.files[0];
        const { name } = files;
        const reader = new FileReader();
        reader.readAsDataURL(files);
        reader.onloadend = () => {

            // const dataURLtoFile = (dataurl, filename) => {
            //     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            //         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            //     while(n--){
            //         u8arr[n] = bstr.charCodeAt(n);
            //     }
            //     return new File([u8arr], filename, {type:mime});
            // }

            // S3FileUpload.uploadFile( dataURLtoFile(reader.result, name), config ).then(data => {
            //     console.log('data',data)
            // }).catch(err => {
            //     console.error(err)
            // });
        };
    }

    return(
        <>
            <input type="file" name="file" onChange={handleChange.bind(this)} />
        </>
    );
}