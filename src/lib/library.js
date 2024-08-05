import fs from 'fs';
import path from 'path';


export function getFileIndex(partialPath) {
    if (partialPath === undefined) { partialPath = ""; }
    
    const rootDir = path.join(process.cwd(), '/public/lib/', partialPath);
    const fullPath = path.join(rootDir);

    let files = fs.readdirSync(fullPath);

    let index = [];
    files.forEach(file => {
        const filePath = path.join(rootDir, file);

        const info = fs.statSync(filePath);

        let name;
        if (info.isDirectory()) { 
            name = file.toString() + '/'; 
        } else { 
            name = file; 
        }

        const size = info.size;
        const modified = info.mtime;

        index.push(
            {"name": name,
             "size": humanFileSize(size),
             "modified": formatDateTime(modified)
            }
        );
    })

    //console.log(index);

    return { index };
}


export function getPathsRecursive(directory, rootDir) {
    const directories = [];
  
    function traverseDirectory(currentPath) {
      const files = fs.readdirSync(currentPath);
  
      files.forEach(file => {
        const filePath = path.join(currentPath, file);
        if (fs.statSync(filePath).isDirectory()) {
          // If it's a directory, recursively traverse
          traverseDirectory(filePath);

          // Add the directory path to the result
          const relativePath = path.relative(rootDir, filePath);
          directories.push("/lib/" + relativePath);
        }
      });
    }

    traverseDirectory(directory);
    return directories;
}




function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
    return bytes.toFixed(dp) + ' ' + units[u];
}


function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}.${month}.${day} ${hour}:${minute}:${second} UTC-3`;
}
