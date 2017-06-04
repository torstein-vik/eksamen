var values = {}

var sql = `
-- SQL script for adding postnummer, poststed

-- If you get Error Code 1175, Go to Edit -> Preferences -> "SQL Editor" -> "Other" -> uncheck "Safe Updates". Then go to Query -> Reconnect to Server

USE \`eksamen\`;

-- Deleting all previous entries
SET FOREIGN_KEY_CHECKS=0;
DELETE FROM \`poststed\`;
SET FOREIGN_KEY_CHECKS=1;

INSERT INTO poststed (postnummer, poststed) VALUES
`

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('postnummer.txt')
});


lineReader.on('line', (line) => {
    var data = line.split(';');

    values[data[0]] = data[1];
});

lineReader.on('close', () => {
    var pairs = Object.keys(values).map((k) => [k, values[k]])


    pairs.forEach(([postnummer, poststed], index, arr) => {sql += `('${postnummer}', '${poststed}')${index == arr.length - 1 ? ';' : ','}\n`});

    console.log(values)
    console.log(sql);

    require('fs').writeFile("poststed.sql", sql, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("Saved and complete");
    });

})
