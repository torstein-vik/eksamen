var fs = require('fs');

var sql = `
-- SQL script for adding content

-- If you get Error Code 1175, Go to Edit -> Preferences -> "SQL Editor" -> "Other" -> uncheck "Safe Updates". Then go to Query -> Reconnect to Server

USE \`eksamen\`;

-- Disable foreign key checks until later
SET FOREIGN_KEY_CHECKS=0;

-- Deleting all previous entries
DELETE FROM \`apartments\`;
DELETE FROM \`apartment_images\`;


-- Reseting auto_increment
ALTER TABLE \`apartments\` AUTO_INCREMENT = 1;
ALTER TABLE \`apartment_images\` AUTO_INCREMENT = 1;


`

fs.readFile('content.json', 'utf8', function (err, json) {
    if (err) throw err;
    var data = JSON.parse(json);

    var apartments = [];
    var images = [];

    var current_img_id = 0;
    var apartmentid = 0;

    data.apartments.forEach((apartment, index) => {
        apartmentid++;

        apartments.push([apartment.number, apartment.description, apartment.price, apartment.featured + current_img_id + 1]);
        apartment.images.forEach((image) => {
            current_img_id++;

            images.push([apartmentid, image.path, image.text]);
        });
    });

    sql += "INSERT INTO apartments (apartmentnumber, description, price, featured_img) VALUES\n";
    apartments.forEach(([number, description, price, featured], index, arr) => {
        sql += `('${number}', '${description}', '${price}', '${featured}')${index == arr.length - 1 ? ';' : ','}\n`;
    });
    sql +="\n\n";

    sql += "INSERT INTO apartment_images (apartmentid, path, imagetext) VALUES\n";
    images.forEach(([apartmentid, path, imagetext], index, arr) => {
        sql += `('${apartmentid}', '${path}', '${imagetext}')${index == arr.length - 1 ? ';' : ','}\n`;
    });
    sql +="\n\n";

    sql +="-- Reenable foreign key checks\n";
    sql +="SET FOREIGN_KEY_CHECKS=1;\n";

    console.log(sql);

    require('fs').writeFile("content.sql", sql, function(err) {
        if (err) throw err;

        console.log("Saved and complete");
    });
});








