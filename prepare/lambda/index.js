const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3();

// make the 'handler' lambda function run
// whenver S3 is used!
exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // wesoodaa
  const Key = decodeURIComponent(event.Records[0].s3.object.key); //let - original/112312321_abc.png
  console.log(Bucket, Key);

  const filename = Key.split("/")[Key.split("/").length - 1]; // ex - 112312321_abc
  const ext = Key.split(".")[Key.split(".").length - 1].toLowerCase();//png
  const requiredFormat = ext === "jpg" ? "jpeg" : ext;
  console.log("filename", filename, "ext", ext);

  try {
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    console.log("original", s3Object.Body.length); //s3Object.Body has binary data of img

    const resizedImage = await sharp(s3Object.Body)
      .resize(400, 400, { fit: "inside" })
      .toFormat(requiredFormat)
      .toBuffer();

    await s3
      .putObject({
        Bucket,
        Key: `thumb/${filename}`,
        Body: resizedImage,
      })
      .promise();
    console.log("put", resizedImage.length);

    return callback(null, `thumb/${filename}`);
  } catch (error) {
    console.error(error);
    return callback(error); //similar to passport 'done' !
  }
};
