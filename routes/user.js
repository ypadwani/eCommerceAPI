const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User"); // Import the User model
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    // Encrypt the password if it's being updated
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }

    try {
        // Find the user by ID and update
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // Update only the provided fields
            { new: true } // Return the updated user
        );

        res.status(200).json(updatedUser); // Send the updated user as a response
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json(err); // Return a 500 error with the error details
    }
});

//Delete

router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted....")
    }catch(err){
        res.status(500).json(err)
    }
})

//Get user

router.get("/find/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc;

        res.status(200).json({...others});
    }catch(err){
        res.status(500).json(err)
    }
})

//Get all user

router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;