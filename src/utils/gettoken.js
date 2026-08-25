const {RefreshTokenModel} = require("../models/index1");
const {signAccessToken ,signRefreshToken ,refreshCookieOptions, accessCookieOptions} = require("./token");


const getToken= async (user ,res)=>{
    const accessToken = signAccessToken(user);
    const RefreshToken = signRefreshToken(user);
    
    await RefreshTokenModel.create({
        tokenHash:RefreshToken,
        user: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

res.cookie("accessToken",accessToken,accessCookieOptions  );
  res.cookie("refreshToken",RefreshToken ,refreshCookieOptions);

  return {access : accessToken , refresh:RefreshToken}
}

module.exports = getToken;