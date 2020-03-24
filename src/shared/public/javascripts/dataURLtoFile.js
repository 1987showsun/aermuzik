/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import dayjs from 'dayjs';

export default (dataurl, filename) => {
    let arr  = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}_${dayjs().valueOf()}`, {type:mime});
}