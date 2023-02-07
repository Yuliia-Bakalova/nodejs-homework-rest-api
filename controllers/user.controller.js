const { Users } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const savedUser = await Users.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      user: {
        email,
        subscription: savedUser.subscription,
      },
    });
  } catch (err) {
    if (err.message.includes("E11000 duplicate key error")) {
      return res.status(409).json({ message: "Email in use" });
    }
    throw err;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const existedUser = await Users.findOne({ email });
  if (!existedUser) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const isPasswordValid = await bcrypt.compare(password, existedUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const token = jwt.sign({ id: existedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.status(200).json({
    token: token,
    user: {
      email,
      subscription: existedUser.subscription,
    },
  });
}

async function current(req, res, next) {
  const { user } = req;
  const { email, subscription } = user;
  return res.status(200).json({
    email,
    subscription,
  });
}

async function logout(req, res, next) {
  const { _id } = req.user;
  const userForLogout = await Users.findByIdAndUpdate(_id, { token: null });
    console.log(userForLogout);
    res.status(204).json();
}


  

//   async function subscriptionUpdate(req, res, next) {
//     const { subscription } = req.body;
//     const { _id, email } = req.user;
//     const types = ["starter", "pro", "business"];
//     if (types.includes(subscription) ) {
//       const updatedSubscription = await Users.findByIdAndUpdate(_id,
//         { subscription: subscription },
//         { new: true, });
//     }
      
//       if (!updatedSubscription) {
//         return res.status(404).json({
//           message: "Not found",
//         });
//       }

//       res.status(200).json({
//         user: {
//           email,
//           subscription: updatedSubscription.subscription,
//         },
//       });

   
// }
  

async function subscriptionUpdate(req, res, next) {
  const { subscription } = req.body;
  const { _id, email } = req.user;
  const types = ["starter", "pro", "business"];
    if (types.includes(subscription)) {
        const updatedSubscription = await Users.findByIdAndUpdate(_id,
            { subscription: subscription },
            { new: true, });
        if (!updatedSubscription) {
            return res.status(404).json({
                message: "Not found",
            });
        }

        res.status(200).json({
            user: {
                email,
                subscription: updatedSubscription.subscription,
            },
        });
  }
 
}

  module.exports = {
    register,
    login,
    current,
    logout,
    subscriptionUpdate
  };