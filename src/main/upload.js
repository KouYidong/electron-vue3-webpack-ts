import fs from 'fs'
import { parse, whatwg } from 'url'
import { parseURL } from 'whatwg-url'
import http from 'http'
import https from 'https'
import { sha256 } from 'js-sha256';
import os from 'os'

const sha256Str = sha256('beem')
const random = Math.random()
const appToken = `YksjKVEjeX09DncsCidXRy4HAmotPX01U0s1GRniAStkrxfSGWT3ivEQNk8TvYtFWFZgx7diSzUY`
const uid = '13hLe_EB4hlb_LL7rOvH-1'
const lastOcode = 'RAUC9MVR'
const deviceId = 'com.beem.beemworkuat!2F8C32F6-5422-41B3-B673-547E35D38ACE'
const beemLang = 'en-US'
const version = '1.0.0-100'

const context = `http://120.92.86.2:9000`
const ver = `v1`


const header = {
  "Content-type": 'application/x-www-form-urlencoded',
  "Authorization": `Beem ${appToken}`,
  "app-ver": version,
  uid,
  "ocode": lastOcode,
  "device-id": deviceId,
  "device-type": os.type() === 'Darwin' ? '3' : '4',
  "lang": beemLang,
  "os-ver": '11',
  "ts": Date.now(),
  "ts-sign": '41e3d2a6bc1e2a5015a36edeaa9f6c72',
  "nonce": Math.ceil(Math.random() * Math.pow(10, 10))
}

/**
 * 根据文件名称返回上传文件需要的 object
 * @param fileName 文件名称
 */
export const getObject = (filePath) => {
  // 生成上传文件名
  const splitArr = filePath.split('/')
  const fileName = splitArr[splitArr.length - 1]
  const type = fileName.substr(fileName.lastIndexOf('.'))
  const random = Math.ceil(Math.random() * Math.pow(10, 10))
  const randomName = `${random}${new Date().getTime()}`
  return `/beem/${randomName}${type}`
}

// 获取 STC 签名
const getSTCSign = (object) => {
  return new Promise((resolve, reject) => {
    // 上传接口地址
    const url = `${context}/store/${ver}/s3/sign?method=PUT&object=${object}`
    // 发送请求
    const req = http.request(url, {
      method: 'get',
      headers: {
        // S3 需要的请求头
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-content-sha256': sha256Str,
        'x-amz-expires': '900', // 和服务端统一
        // 接口通用的 header
        ...header
      }
    }, res => {
      res.on('data', chunk => {
        // 这里拿到的是文件流，所以需要先转成 string, 然后将 string 再解析才可以拿到最终的 JSON
        const chunkStr = chunk.toString()
        const result = JSON.parse(chunkStr)
        process.stdout.write(`响应主体: ${chunk}, ${result.code}`)
        resolve(result)
      });
      res.on('end', () => {
        process.stdout.write(`响应结束`)
      })
    })
    req.on('error', (err) => {
      console.log(err, `请求错误`)
      reject(err)
    })
    req.end()
  })
}

// 获取上传 URL
export const getUploadURL = ({ protocol, endpoint, bucket, object }) => {
  return `${protocol}://${endpoint}/${bucket}${object}`
}

// 根据文件路径读取文件
const getFile = (filePath) => {
  const arr = []
  let readStream = fs.createReadStream(filePath);
  return new Promise((resolve, reject) => {
    readStream.on('data', (data) => {
      arr.push(data)
    });
    readStream.on('end', () => {
      let blob = new Blob(arr);
      resolve(blob);
    });
    readStream.on('error', err => {
      reject(err);
    });
  })

}

// export const upload = (filePath) => {
//   console.log('upload 方法中 =>')
//   // 创建一个将文件内容读取为流数据的ReadStream对象
//   let fileReadStream = fs.createReadStream(filePath, { encoding: "utf-8", start: 0, end: 24 });

//   // 打开文件，回调函数参数fd是打开文件时返回的文件描述符（文件句柄）
//   fileReadStream.on("open", function (fd) {
//     console.log("文件被打开，文件句柄为%d", fd);
//   });

//   // // 暂停文件读取
//   // fileReadStream.pause();

//   // // 1秒后取消暂停，继续读取文件流
//   // setTimeout(function () {
//   //   fileReadStream.resume();
//   // }, 2000);

//   // 读取到文件新的数据时触发的事件，回调函数参数dataChunk为存放了已读到的数据的缓存区对象或一个字符串
//   fileReadStream.on("data", function (dataChunk) {
//     const random = Math.random()
//     console.log("读取到数据", random);
//     console.log(dataChunk);
//   });

//   // 读取完所有数据时触发，此时将不会再触发data事件
//   fileReadStream.on("end", function () {
//     const random = Math.random()
//     console.log("文件已经全部读取完毕", random);
//   });

//   // 用于读取数据流的对象被关闭时触发
//   fileReadStream.on("close", function () {
//     const random = Math.random()
//     console.log("文件被关闭", random);
//   });

//   // 当读取数据过程中产生错误时触发
//   fileReadStream.on("error", function (err) {
//     const random = Math.random()
//     console.log("文件读取失败。", random);
//   })
// }



// export const upload = (uploadFilePath) => {
//   const url = 'https://storage-sau.beemhub.com/bm-avatar-test/beem/8b0e7e5a-14ee-4030-bc83-e4f804691df41630486602187.png'
//   var urlinfo = parse(url);
//   var options = {
//     method: 'POST',
//     host: urlinfo.host,
//     path: urlinfo.pathname
//   };
//   if (urlinfo.port) {
//     options.port = urlinfo.port;
//   }
//   if (urlinfo.search) {
//     options.path += urlinfo.search;
//   }
//   return new Promise((resolve, reject) => {
//     var req = http.request(options, function (res) {
//       var chunks = [], length = 0;
//       res.on('data', function (chunk) {
//         console.log('request chunk =>', chunk)
//         length += chunk.length;
//         chunks.push(chunk);
//       });
//       res.on('end', function () {
//         var buffer = new Buffer(length);
//         // delay copy
//         for (var i = 0, pos = 0, size = chunks.length; i < size; i++) {
//           chunks[i].copy(buffer, pos);
//           pos += chunks[i].length;
//         }
//         res.body = buffer;
//         resolve({
//           state: 1,
//           res
//         })
//       });
//     });
//     var readstream = fs.createReadStream(uploadFilePath);
//     readstream.on('data', function (chunk) {
//       console.log('write', chunk);
//       req.write(chunk);
//     });
//     readstream.on('end', function () {
//       req.end();
//     });
//   })
// };



// 这个版本写文件有问题
export const upload = async (filePath) => {
  // 获取 object，也就是文件对应在 服务器上的路径
  const object = getObject(filePath)
  // 获取 STC 签名
  const { data } = await getSTCSign(object)
  console.log(`STC 签名获取成功 =>`, data)


  // 获取上传 URL
  const uploadURL = getUploadURL({ ...data, object })
  process.stdout.write(uploadURL)

  // 读取文件
  const fileBuffer = fs.readFileSync(filePath)

  const URLInfo = parseURL(uploadURL)
  console.log('URL 信息 =>', URLInfo)

  const fileBufferStr = fileBuffer
  console.log('fileBuffer =>', fileBuffer.byteLength)

  // const options = {
  //   hostname: URLInfo.host,
  //   port: URLInfo.port,
  //   path: URLInfo.path.join('/'),
  //   method: 'PUT',
  //   headers: {
  //     'Content-Length': fileBufferStr.length,
  //      // S3 需要的请求头
  //     'x-amz-algorithm': 'AWS4-HMAC-SHA256',
  //     'x-amz-content-sha256': sha256Str,
  //     'x-amz-expires': '900', // 和服务端统一
  //     'x-amz-date': data.utcDate,
  //     'Authorization': data.signature,
  //     'Content-type': 'text/plain',
  //   }
  // }

  // const req = https.request(options, res => {
  //   console.log(`状态码: ${res.statusCode}`)

  //   res.on('data', d => {
  //     process.stdout.write(d)
  //   })
  // })

  // req.on('error', error => {
  //   console.error(error)
  // })

  // req.write(fileBufferStr)
  // req.end()

  // 上传
  // 发送请求
  const req = https.request(uploadURL, {
    method: 'PUT',
    headers: {
      // S3 需要的请求头
      'x-amz-algorithm': 'AWS4-HMAC-SHA256',
      'x-amz-content-sha256': sha256Str,
      'x-amz-expires': '900', // 和服务端统一
      'x-amz-date': data.utcDate,
      'Authorization': data.signature,
      'Content-type': 'text/plain',
      'Content-Length': fileBuffer.byteLength,
    }
  }, res => {
    console.log(`状态码: ${res.statusCode}`) // 这里打印了
    console.log('res =>', res.headers)
    res.on('data', chunk => {
      console.log('data =>', chunk)
      // process.stdout.write(chunk) // 这里没有打印
    });
    res.on('end', () => {
      process.stdout.write('上传结束') // 这里没有打印
    })
  })

  req.on('error', (err) => {
    console.log(err, `请求错误`)
    reject(err)
  })
  req.write(fileBuffer, err => {
    console.log(`写流失败 =>`, err)
  })
  req.end()

  // var readstream = fs.createReadStream(fileBuffer);
  // readstream.on('data', function (chunk) {
  //   console.log('write', chunk.length);
  //   req.write(chunk);
  // });
  // readstream.on('end', function () {
  //   req.end();
  // });
  // req.on('error', (err) => {
  //   console.log(err, `请求错误`)
  //   reject(err)
  // })
  // req.end();




  // var urlinfo = parse(uploadURL);
  // var options = {
  //   method: 'PUT',
  //   host: urlinfo.host,
  //   path: urlinfo.pathname
  // };
  //   var req = http.request(options, (res) => {
  //     var chunks = [], length = 0;
  //     res.on('data', function (chunk) {
  //       // length += chunk.length;
  //       // chunks.push(chunk);
  //     });
  //     res.on('end', function () {
  //       // var buffer = new Buffer(length);
  //       // // delay copy
  //       // for (var i = 0, pos = 0, size = chunks.length; i < size; i++) {
  //       //   chunks[i].copy(buffer, pos);
  //       //   pos += chunks[i].length;
  //       // }
  //       // res.body = buffer;
  //     });
  //   });
  //   var readstream = fs.createReadStream(fileBuffer);
  //   readstream.on('data', function (chunk) {
  //     // console.log('write', chunk.length);
  //     // req.write(chunk);
  //   });
  //   readstream.on('end', function () {
  //     // req.end();
  //   });
}
