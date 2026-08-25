const apiResponse = require("../../utils/apiResponse");
const asyncHandler=require("../../utils/asyncHandler");
const AuthService=require("./auth.service")

const registerController=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;
    const result=await AuthService.registerService({name,email,password});
    res.ststus(201).json(apiResponse(201,result,"user created successfully"));
})


const loginController = async (req, res) => {

}

const logoutController = async (req, res) => {

}