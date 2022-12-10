const express = require('express');
const router = express.Router();
const _ = require('lodash');
const db_client_pool = require("./db");
const PDFDocument = require('pdfkit-table');
const Order = require("./helpers/order");
const User = require("./helpers/user");

router.get("/invoice/:order_id", async (req, res, next) => {
    const order_id = req.params.order_id;
    const client = await db_client_pool.connect();
    let order;
    try {
        order = await Order.findById(client, order_id);
        if (!order.paid)
            throw {
                type: "order_not_yet_paid"
            };
        
        let order_data = order;
        order_data.buyer = await User.findById(client, order.user_id);

        let order_content = await Order.getOrderContent(client, order_id);
        order_content = _.groupBy(order_content, "item.owner_id");
        order_data.content = await Promise.all(_.keys(order_content).map(async key => {
            return {
                seller: await User.findById(client, key),
                positions: order_content[key]
            };
        })); 

        (await generateInvoice(order_data)).pipe(res);
    } catch (err) {
        switch (err.type) {
            case "order_invalid_id":
                return res.status(400).send({ message: "Provided value '" + order_id + "' is not valid: " + err.message || "" });
            case "order_does_not_exist":
                return res.status(400).send({ message: "Order with id '" + order_id + "' does not exist" });
            case "order_not_yet_paid":
                return res.status(409).send({ message: "This order is not yet paid" });
            default:
                console.error("invoice | unexpected error: " + err.message || err);
                return next(err);
        }
    } finally {
        client.release();
    }
});

async function generateInvoice(data) {
    // pdfkit-table doesn't support specifying column width as percentage
    // so this is a somewhat arbitrary number based on the width of an A4 page and default paddings
    // it's later used to set the column widths
    const table_width = 450;
    const currency_name = "VPLN";

    const doc = new PDFDocument({ 
        size: 'A4' 
    });    

    data.content.forEach((group, index) => {
        if (index > 0)
            doc.addPage();

        doc.font(__dirname + "/resources/Roboto-Regular.ttf").fontSize(14);

        doc.text("Order ID: " + data.id);
        doc.moveDown();
        doc.text("Buyer: " + data.buyer.name);
        doc.text("Seller: " + group.seller.name);

        let table = { 
            "headers": [
                { "label": "Item", "property": "item", width: Math.floor(table_width * 0.55) },
                { "label": "Price", "property": "price", width: Math.floor(table_width * 0.15) },
                { "label": "Qty", "property": "quantity", width: Math.floor(table_width * 0.1) },
                { "label": "Sum", "property": "sum", width: Math.floor(table_width * 0.2) }
            ].map(header => {
                header.valign = "center";
                header.headerColor = "#b5b5b5";
                header.headerOpacity = 1;
                return header;
            }),
            "datas": group.positions.map((position, index) => {
                return {
                    item: position.item.name,
                    price: position.item.price + " " + currency_name,
                    quantity: position.quantity,
                    sum: position.item.price * position.quantity + " " + currency_name,
                    options: { 
                        backgroundColor: index % 2 == 0 ? "#f5f5f5" : "#e5e5e5",
                        backgroundOpacity: 1
                    }
                }
            }),
            "options": {
                title: "Purchases:",
                divider: {
                    header: { disabled: false, width: 2, opacity: 1 },
                    horizontal: { disabled: false, width: 1, opacity: 1 },
                },
                padding: 5,
                font: __dirname + "/resources/Roboto-Regular.ttf",
                fontSize: 14
            }
        };

        doc.moveDown(2);
        doc.table(table, {
            prepareHeader: () => {
                doc.font(__dirname + "/resources/Roboto-Regular.ttf").fontSize(10.5);
            },
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font(__dirname + "/resources/Roboto-Regular.ttf").fontSize(10.5);
            },
        });

        let group_sum = group.positions
            .map(position => position.item.price * position.quantity)
            .reduce((sum, position_price) => sum + position_price, 0);
        doc.font(__dirname + "/resources/Roboto-Bold.ttf").fontSize(14);
        doc.text("Total: " + group_sum + " " + currency_name, {
            align: 'right'
        });
    });
    
    doc.end();
    return doc;
}

module.exports = router;