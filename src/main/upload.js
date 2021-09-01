import fs from 'fs'
import { parse } from 'url'
import http from 'http'

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



export const upload = (uploadFilePath) => {
  const url = 'https://storage-sau.beemhub.com/bm-avatar-test/beem/8b0e7e5a-14ee-4030-bc83-e4f804691df41630486602187.png'
  var urlinfo = parse(url);
  var options = {
    method: 'POST',
    host: urlinfo.host,
    path: urlinfo.pathname
  };
  if (urlinfo.port) {
    options.port = urlinfo.port;
  }
  if (urlinfo.search) {
    options.path += urlinfo.search;
  }
  return new Promise((resolve, reject) => {
    var req = http.request(options, function (res) {
      var chunks = [], length = 0;
      res.on('data', function (chunk) {
        console.log('request chunk =>', chunk)
        length += chunk.length;
        chunks.push(chunk);
      });
      res.on('end', function () {
        var buffer = new Buffer(length);
        // delay copy
        for (var i = 0, pos = 0, size = chunks.length; i < size; i++) {
          chunks[i].copy(buffer, pos);
          pos += chunks[i].length;
        }
        res.body = buffer;
        resolve({
          state: 1,
          res
        })
      });
    });
    var readstream = fs.createReadStream(uploadFilePath);
    readstream.on('data', function (chunk) {
      console.log('write', chunk);
      req.write(chunk);
    });
    readstream.on('end', function () {
      req.end();
    });
  })
};
