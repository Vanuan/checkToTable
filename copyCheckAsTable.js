(function() {
  let checkContent;
  
  function selectElementContents(el) {
  	var body = document.body, range, sel;
  	if (document.createRange && window.getSelection) {
  		range = document.createRange();
  		sel = window.getSelection();
  		sel.removeAllRanges();
  		try {
  			range.selectNodeContents(el);
  			sel.addRange(range);
  		} catch (e) {
  			range.selectNode(el);
  			sel.addRange(range);
  		}
  	} else if (body.createTextRange) {
  		range = body.createTextRange();
  		range.moveToElementText(el);
  		range.select();
  	}
  }
  
  function createTable(objectArray, fields, fieldTitles) {
    let body = document.getElementsByTagName('body')[0];
    let tbl = document.createElement('table');
    let thead = document.createElement('thead');
    let thr = document.createElement('tr');
    fieldTitles.forEach((fieldTitle) => {
      let th = document.createElement('th');
      th.appendChild(document.createTextNode(fieldTitle));
      thr.appendChild(th);
    });
    thead.appendChild(thr);
    tbl.appendChild(thead);
  
    let tbdy = document.createElement('tbody');
    let tr = document.createElement('tr');
    objectArray.forEach((object) => {
      let tr = document.createElement('tr');
      fields.forEach((field) => {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(object[field]));
        tr.appendChild(td);
      });
      tbdy.appendChild(tr);    
    });
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
    return tbl;
  }
  
  function toPairs(array) {
    var pairs = [];
    for(let i = 0; i < array.length; i += 2) {
      pairs.push(array.slice(i, i + 2));
    }
    return pairs;
  }
  
  function parseGroceriesItem(groceriesItem) {
    let [calculation, total] = groceriesItem[1].split('=');
    let [count, price] = calculation.split('*');
    return {
      title: groceriesItem[0],
      price: parseFloat(price.trim()),
      count: parseFloat(count.trim()),
      total: parseFloat(total.trim()),
    };
  }
  
  function parseGroceriesList(groceriesLines) {
    let pairs = toPairs(groceriesLines);
    return pairs.map(parseGroceriesItem);
  }
  
  
  Array.prototype.forEach.call(document.getElementsByTagName('pre'), function(el) {
    //if (el.innerText.search(date) !== -1) {
      checkContent = el.innerText
    //} 
  });
  if (!checkContent) {
    console.log('not found');
  } else {
    let checkParts = checkContent.split('----------------------------------------');
    checkParts = checkParts.map(function(part) {
      return part.split('\n').filter((line) => line !== "").map((line) => line.trim());
    });
    let checkInfo = {
        fiscalNumberText: checkParts[0],
        groceriesLines: checkParts[1],
        totalText: checkParts[2],
        dateNumberText: checkParts[3],
    };
    let groceries = parseGroceriesList(checkInfo.groceriesLines);
    table = createTable(groceries, ['title', 'price', 'count', 'total'], ['Найменування','Ціна','Кількість','Сума']);
    selectElementContents(table)
    document.execCommand("copy");
    table.parentNode.removeChild(table);
  }
  
})();
