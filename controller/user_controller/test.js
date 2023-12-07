// Place order COD ( Cash on Delivery )
const getPlaceOrderCOD = async (req, res) => {
  try {
    const { grantTotal, couponCode } = req.query;
    let totalAmount = 0;
    const coupon = await couponModel.findOne({ couponCode: couponCode });
    const user = await customerModel.findOne({ email: req.user });
    let discountAmount = 0;
    if (coupon) {
      discountAmount = coupon.amount;
    }
    const cart = await cartModel.findOne({ userId: user._id }).populate({
      path: "products.productId",
      model: "Product",
    });
    const address = await addressModel.findOne(
      { "address._id": req.query.addressId },
      { "address.$": 1 }
    );
    const productArray = [];
    cart.products.forEach((product) => {
      productArray.push({
        productId: product.productId._id,
        quantity: product.quantity,
        price: product.productId.salePrice,
      });
    });
    cart.products.forEach((product) => {
      totalAmount += product.quantity * product.productId.salePrice;
    });
    await orderModel
      .create({
        customerId: user._id,
        products: productArray,
        address: {
          addressType: address.address[0].addressType,
          name: address.address[0].name,
          city: address.address[0].city,
          landMark: address.address[0].landMark,
          state: address.address[0].state,
          pincode: address.address[0].pincode,
          phone: address.address[0].phone,
          altPhone: address.address[0].altPhone,
        },
        paymentMethod: "COD",
        referenceId: uuidv4(),
        shippingCharge: 0,
        discount: discountAmount,
        totalAmount: grantTotal,
        createdOn:  Date.now(),
        orderStatus: "Order Placed",
        paymentStatus: "Pending",
        deliveredOn: new Date(),
        couponCode: couponCode,
      })
      .then(async () => {
        for (const product of cart.products) {
          await productModel.updateOne(
            { _id: product.productId._id },
            { $inc: { units: -product.quantity } }
          );
        }
        await cartModel.deleteOne({ userId: user._id });
      });
    res.render("order-placed");
  } catch (error) {
    //
    console.error(error);
  }
};