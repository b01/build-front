const
    fs = require("fs"),
    glob = require("glob"),
    dirname = require('path').dirname;

/**
 *
 * @param {string} pPath
 * @param {string} pContent
 * @returns {*}
 */
function saveFile(pPath, pContent)
{
    let dir = dirname(pPath);

    // Make directory if not exists.
    if (!fs.existsSync(dir)) {
        console.log(`making the directory "${dir}" directory.`);

        fs.mkdirSync(dir, '0775');
    }

    // Write the file, and overwrite if exists.
    return fs.writeFile(pPath, pContent);
}

exports.saveFile = saveFile;
