
/**
 * 获取本地存储中的 STC sign
 */
 export const getLocalSTCSign_local = () => {
  const STCSign = JSON.parse(localStorage.getItem('STCSign'))
  const signature = STCSign.signature
  const utcDate = STCSign.utcDate
  const protocol = STCSign.protocol
  const endpoint = STCSign.endpoint
  const bucket = STCSign.bucket
  let ret= {
    signature,
    utcDate,
    protocol,
    endpoint,
    bucket
  }
  return ret;
}


export const getLocalSTCSign = (messageUId) => {
      let ret= {
        signature,
        utcDate,
        protocol,
        endpoint,
        bucket
      }
      return ret;
}


/**
 * 创建分片
 * @param file 文件流对象
 */
 export const createMultipartUpload = async (file, url, messageUId) => {
  const { signature, utcDate } = getLocalSTCSign(messageUId)
  // const url = getUploadURL(object)
  const res = await axiosUploadPost({
    url,
    params: {
      // uploads: 'uploads'
    },
    config: {
      headers: {
        'Content-type': file.type || 'text/plain', // application/octet-stream
        'Authorization': signature,
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-content-sha256': sha256Str,
        'x-amz-expires': '900', // 和服务端统一
        'x-amz-date': utcDate
      }
    }
  }, messageUId)
  const xmlJson = JSON.parse(XMLToJSON(res))
  const result = {
    url,
    Key: xmlJson.elements[0].elements[1].elements[0].text,
    UploadId: xmlJson.elements[0].elements[2].elements[0].text
  }
  return result
}

/**
 * 上传分片
 */
export const uploadPat = async (file, url, messageUId, callback) => {
  console.log('uploadPatuploadPatuploadPatuploadPat: ', { file, url })
  const { signature, utcDate } = getLocalSTCSign(messageUId)

  // url = getUploadURL(object)
  const res = await axiosUploadPut({
    url,
    params: {
      file
    },
    config: {
      headers: {
        'Content-type': file.type || 'text/plain', //  application/octet-stream
        'Authorization': signature,
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-content-sha256': sha256Str,
        'x-amz-expires': '900', // 和服务端统一
        'x-amz-date': utcDate
      }
    }
  }, messageUId, callback)
  const eTag = res.headers.etag
  return { eTag, uploadURL: url }
}

// 组合分片并结束上传
export const completeMultipartUpload = async (part, partNumber = 1, url, messageUId = '') => {
  const { signature, utcDate } = getLocalSTCSign(messageUId)

  const elements = []
  part.map(item => {
    elements.push(
      {
        type: 'element',
        name: 'Part',
        elements: [{
          type: 'element',
          name: 'ETag',
          elements: [
            {
              type: 'text',
              text: JSON.parse(item.eTag)
            }
          ]
        }, {
          type: 'element',
          name: 'PartNumber',
          elements: [
            {
              type: 'text',
              text: item.partNumber
            }
          ]
        }]
      }
    )
  })

  const XMLJson = {
    declaration: {
      attributes: {
        version: '1.0',
        encoding: 'UTF-8'
      }
    },
    elements: [{
      type: 'element',
      name: 'CompleteMultipartUpload',
      attributes: {
        xmlns: 'http://s3.amazonaws.com/doc/2006-03-01/'
      },
      elements
    }]
  }
  const xmlStr = JSONToXMLStr(XMLJson)
  const params = {
    xml: xmlStr
  }

  let res  = await axiosUploadPost({
    url,
    params,
    config: {
      headers: {
        'Content-type': 'text/xml',
        'Authorization': signature,
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-content-sha256': sha256Str,
        'x-amz-expires': '900', // 和服务端统一
        'x-amz-date': utcDate
      }
    }
  }, messageUId)
}

/**
 * 不分片直接上传
 * @param file 文件流对象
 */
 export const uploadFile = async (file, url, messageUId, callback) => {
  const { signature, utcDate } = getLocalSTCSign(messageUId)

  const res = await axiosUploadPut({
    url,
    params: {
      file
    },
    config: {
      headers: {
        // 'Content-Disposition': file.type==="text/html" ? 'inline;' : 'attachment;',
        'Content-type': file.type || 'text/plain',
        'Authorization': signature,
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-content-sha256': sha256Str,
        'x-amz-expires': '900', // 和服务端统一
        'x-amz-date': utcDate,
      }
    }
  }, messageUId, callback)

  return res
}


/**
 * 文件流本地存储前的处理，使用getPartFile替换
 * @param fileInfo  *
 * @param startPos
 * @param endPos
 */
 const getPartFile = async (fileInfo, startPos, endPos) => {
  // const crypt = require("crypto");
  // function getMD5HashFromFile(data){
  //     var hash = crypt.createHash("md5")
  //         .update(data)
  //         .digest("base64");
  //     return hash;
  // }
  return new Promise((resolve) => {
    if (!endPos)
      endPos = fileInfo.size;
    if (!endPos) { //0size 文件
      let blob = new Blob([]);
      resolve(blob);
    }
    console.log("getPartFile", { fileInfo, startPos, endPos });
    // const fs = require('fs');
    let path = fileInfo.path; //文件本地路径
    let stats = fs.statSync(path);//读取文件信息
    let chunkSize = CHUNK_SIZE;//每片分块的大小3M
    let size = stats.size;//文件大小
    let pieces = Math.ceil(size / chunkSize);//总共的分片数
    let arr = [];
    //创建一个readStream对象，根据文件起始位置和结束位置读取固定的分片
    let readStream = fs.createReadStream(path, { start: startPos, end: endPos - 1 });
    readStream.on('data', (data) => {
      arr.push(data)
    });
    readStream.on('end', () => {
      let blob = new Blob(arr);
      console.log("blog", blob);
      // blob.arrayBuffer().then(bufer=>{
      //   const view = new Uint8Array(bufer);
      //   var md5Hash = getMD5HashFromFile(view);
      //   console.log("get getMD5HashFromFile ",md5Hash);
      //   resolve(blob);
      // })
      resolve(blob);
    });
    readStream.on('error', () => {
      let blob = new Blob(arr);
      resolve(blob);
    });
  });
}


/**
 * 获取上传 URL
 */
 export const getUploadURL = (object,messageUId) => {
  // const STCSign = JSON.parse(localStorage.getItem('STCSign'))
  const { protocol, endpoint, bucket } = getLocalSTCSign(messageUId)
  return `${protocol}://${endpoint}/${bucket}${object}`
}


/**
 * 获取 STC 签名
 * @param method STC 的请求方法
 * 传了 object 就不需要传 fileName 了
 */
 export const getSTCSign = async (method, fileName,messageUId, objectArgs, obj) => {
  let object = obj || await getObject(fileName)
  objectArgs && (object = `${object}?${objectArgs}`)
  const res = await axiosGet({
    url: publicUrl.getSTCSign,
    params: {
      method,
      object
    },
    config: {
      headers: {
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-content-sha256': sha256Str,
        'x-amz-expires': '900' // 和服务端统一
        // 'x-amz-date': '' // 不传这个，按服务器的走
      }
    }
  });
  //保留localStorage 兼容单个上传场景的逻辑。
  localStorage.setItem('STCSign', JSON.stringify(res.data));
  if(messageUId)
    setUploader(messageUId,{STCSign:res.data});
  console.log("setUploader(messageUId,{STCSign:res.data});",getUploader(messageUId));
  return object
}

/**
 * 根据文件名称返回上传文件需要的 object
 * @param fileName 文件名称
 */
 export const getObject = async (fileName) => {
  const type = fileName.substr(fileName.lastIndexOf('.'))
  const randomName = `${UUId.generate()}${new Date().getTime()}`
  // const object = `${randomName}${type}`
  const object = `/beem/${randomName}${type}`
  return object
}


export const uploadFileGetURL = async (file) => {
  let fileURL

  const fileName = file.name;
  const object = await getObject(fileName);

  // 获取token
  const newObject = await getSTCSign('PUT', fileName, null, '', object);

  // 获取上传URL
  const url = await getUploadURL(newObject, null);

  // 整体上传文件
  try {
    let fileBlob = await getPartFile(file, 0, 0);
    const res = await uploadFile(fileBlob, url, null, () => { });
    if (res.status === 200) {
      fileURL = res.config.url
      return fileURL
    }
    throw new Error(res.statusText)
  } catch (e) {
    throw e
  }
}