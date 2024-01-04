const excelJS = require("exceljs");
const orderCollection  = require('../models/orders_schema');
const moment = require('moment');
const userCollection = require('../models/user_schema');


module.exports.salesExcel = async (req, res)=>{
  try{
    const orders = await orderCollection
    .find()
    .populate({path:'userId', model:'userCollection'})
    .sort({createdAt: -1})
    .exec();
    orders.forEach(order=>{
      console.log(order._id);
      console.log(order.userId.username);
    });
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');
    worksheet.columns = [
      { header: "Order Id", key: "_id", width: 10},
      { header: "Ordered Date", key: "orderDate", width: 10},
      { header: "Username", key: "userId",  width: 10},
      { header: "Payment Status", key: "paymentStatus", width: 10},
      { header: "Order Status", key: "orderStatus", width: 10},
      { header: "Delivered on",  key: "deliveryDate", width: 10},
      { header: "Total Amount", key: "totalAmount", width: 10},
    ]
    // (row) => (row.userId && row.userId.username ? row.userId.username : "User doesn't exist"),
    orders.forEach(order=>{
       // Add row to the worksheet
       const row = worksheet.addRow(order);

       // Edit "Order Id" cell value
       const orderIdCell = row.getCell("_id");
       orderIdCell.value = `orderId_${order._id.toString().slice(0, 6)}`;

         // Edit "Ordered Date" cell value
      const orderDateCell = row.getCell("orderDate");
      orderDateCell.value = moment(order.orderDate).format("MMM Do YY");

      //Edit username cell value
      const userNameCell = row.getCell("userId");
      userNameCell.value = order.userId.username;

      //Edit deliveryDate cell value
      if (order.deliveryDate) {
        const deliveryDateCell = row.getCell("deliveryDate");
        deliveryDateCell.value = moment(order.deliveryDate).format("MMM Do YY");
      }else{
        const deliveryDateCell = row.getCell("deliveryDate");
        deliveryDateCell.value = "Not yet Delivered";
      }
     
    });
 

    worksheet.getRow(1).eachCell(cell=>{
      cell.font = {bold: true};
    });

     // Set the content type and attachment header for the response
     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
     res.setHeader('Content-Disposition', 'attachment; filename=sales_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }catch(error){
    console.error(error);
  }
}
