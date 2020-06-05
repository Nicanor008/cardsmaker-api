const IpAddress = require("./ipAddressModel");
const dns = require("dns");
const os = require("os");

exports.createIpAddress = (req, res) => {
  let ipCount = 0;
  //   get users ip address
  dns.lookup(os.hostname(), function (err, ip, fam) {
    //   check if ip already exists
    IpAddress.findOne({ ip }).then((ipIfExists) => {
      if (!ipIfExists || ipIfExists === null) {
        // ip doesn't exists, create new ip
        const ipaddress = new IpAddress({ ip });
        ipaddress.save().then((insertedIp) => {
          ipCount = 1;
          return ipCount;
        });
      } else {
        ipCount += ipIfExists.cardCount;

        //   ip ipIfExists, update
        IpAddress.findOneAndUpdate({ ip }, { cardCount: ipCount + 1 }).then(
          (updatedIp) => {
            ipCount = updatedIp + 1;
            return ipCount;
          }
        );
      }
    });
  });
};
