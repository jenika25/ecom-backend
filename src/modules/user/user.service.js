const UserModel = require("../../models/user.model");
const apiError = require("../../utils/apiError");
const { NOT_FOUND, FORBIDDEN } = require("../../utils/httpStatus");
const { uploadToCloudinary, destroyFromCloudinary } = require("../../utils/uploadToCloudinary");

const setOthersDefaultFalse = (currentAddressId, addresses) => {
  addresses.forEach((address) => {
    if (String(address._id) !== String(currentAddressId)) {
      address.isDefault = false;
    }
  });
};

const getOwnProfileService = async (userId) => {
  const result = await UserModel.findById(userId);
  if (!result) {
    throw apiError(NOT_FOUND, "User not found");
  }
  return result;
};

const updateProfileService = async (id, data, file) => {
  const updatedData = { ...data };
  const user = await UserModel.findById(id);
  if (!user) {
    throw apiError(NOT_FOUND, "User not found");
  }
  if (file) {
    const image = await uploadToCloudinary(file.buffer, "ecom/users");
    if (user.profilePhoto?.publicId) {
      await destroyFromCloudinary(user.profilePhoto.publicId);
    }
    updatedData.profilePhoto = image;
  }
  const result = await UserModel.findByIdAndUpdate(id, updatedData, {
    returnDocument: "after",
    runValidators: true,
  });

  return result;
};

const getAllAddressService = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw apiError(NOT_FOUND, "User not found");
  }
  return user.address || [];
};

const createAddressService = async (id, data) => {
  const user = await getOwnProfileService(id);

  if (user.address.length >= 5) {
    throw apiError(FORBIDDEN, "Max addresses limit reached, cannot create more");
  }

  if (data.isDefault || user.address.length === 0) {
    user.address.forEach((addr) => (addr.isDefault = false));
    data.isDefault = true;
  }

  user.address.push(data);
  await user.save();

  return user.address;
};

const updateAddressService = async (userId, addressId, patch) => {
  const userData = await getOwnProfileService(userId);
  const address = userData.address.id(addressId);
  if (!address) {
    throw apiError(NOT_FOUND, "Address not found");
  }

  Object.assign(address, patch);

  if (patch.isDefault) {
    setOthersDefaultFalse(addressId, userData.address);
  }

  await userData.save();
  return userData.address;
};

const deleteAddressService = async (userId, addressId) => {
  const userData = await getOwnProfileService(userId);
  const address = userData.address.id(addressId);

  if (!address) {
    throw apiError(NOT_FOUND, "Address not found");
  }

  const wasDefault = address.isDefault;
  userData.address.pull(addressId);

  if (userData.address.length > 0 && wasDefault) {
    userData.address[0].isDefault = true;
  }

  await userData.save();
  return userData.address;
};

const getAllUsersService = async () => {
  const users = await UserModel.find().sort("-createdAt");
  return users;
};

const updateUserStatusService = async (userId, isActive) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw apiError(NOT_FOUND, "User not found");
  }
  if (isActive !== undefined) {
    user.isActive = isActive;
  } else {
    user.isActive = !user.isActive;
  }
  await user.save();
  return user;
};

const deleteUserService = async (userId) => {
  const user = await UserModel.findByIdAndDelete(userId);
  if (!user) {
    throw apiError(NOT_FOUND, "User not found");
  }
  return user;
};

module.exports = {
  getOwnProfileService,
  updateProfileService,
  getAllAddressService,
  createAddressService,
  deleteAddressService,
  updateAddressService,
  getAllUsersService,
  updateUserStatusService,
  deleteUserService,
};
