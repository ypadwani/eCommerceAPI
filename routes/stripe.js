const router = require("express"). Pouter();
const stripe = require("stripe")(process.env.STRIPE_KEY)

router.post("/payment", (req, res)=>{
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    }, (stripeErr, stripeRes)=>{
        if(stripeErr){
            res.status(500).json(stripeErr);
        }else{
            res.stsus(200).json(stripeRes);
        }
    });
});


module.exports = router;