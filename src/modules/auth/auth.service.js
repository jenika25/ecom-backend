const express = require("express");
const {UserModel , RefreshTokenModel} = require("../../models/index1");
const apiError = require("../../utils/apiError");
const { hashPassword, comparePassword } = require("../../utils/password");
const { signAccessToken ,signRefreshToken } = require("../../utils/token");

const registerService = async(data) =>{
 const    {name,email,password , role} = data;

const isExist = await  UserModel.findOne({email});
if(isExist){
    throw apiError(409 , "user already exist");
}
const hashedPassword =  await hashPassword(password);
const userData = {
    name,
    email,
    password:hashedPassword,
    role:role,
}

const user=  await UserModel.create(userData);


const response = await UserModel.findById(user._id).select("-password");
return {user:response}

}

const loginService = async(data) =>{
    const    {email,password} = data;
    const isUser = await UserModel.findOne({email});
    if(!isUser){
    throw apiError(409 , "user already exist");
    }
    const compare = await comparePassword(password,isUser.password);
    if(!compare){
        throw apiError(401 , "user already exist");
    }
    


    const response= await UserModel.findById(isUser._id).select("-password");
    return {user:response}

}



module.exports = { registerService , loginService};