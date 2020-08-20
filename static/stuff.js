const punctuation = [".", ",", ":", ";", "?", "!"]
const endsWithPunctuation = word => punctuation.some(e => word.endsWith(e))

window.word_replacements = {}

fetch("/get_replacements").then(r => r.json()).then(data => {
  word_replacements = data;
  updateTable(word_replacements);
})

const wordReplacements = word => {
		if (word_replacements[word.toLowerCase()]) {
    	return word_replacements[word.toLowerCase()]
    }
    return word
}

const do_mastery = input => {
	var words = input.split(" ");
  let real_index = 0;
  words = words.map((word, index) => {
  	if (word.length === 0) {
    	return ""
    }
    real_index++;
    let newWord = wordReplacements(word);
    console.log("replacement is", newWord)
  	let capitalized = (real_index % 2 === 0) ? newWord[0].toUpperCase() : newWord[0]
    newWord = capitalized + newWord.substring(1, 10000)
    if (endsWithPunctuation(newWord)) {
    	newWord = newWord.substring(0, word.length-1) + " " + newWord[word.length-1]
    }
    return newWord
  })
  return words.join(" ")
}

const updateTable = word_replacements => {
  word_replacements = word_replacements || window.word_replacements;
  console.log("replace")
  if (!word_replacements) {
    return;
  }
  const body = document.getElementById("tbody");
  body.innerHTML = "";
  const items = Object.entries(window.word_replacements);
  items.forEach(([key, value]) => {
    const replaced = document.createElement("td");
    replaced.appendChild(document.createTextNode(key))

    const replacer = document.createElement("td");
    replacer.appendChild(document.createTextNode(value))

    const row = document.createElement("tr");
    row.appendChild(replaced);
    row.appendChild(replacer);

    body.appendChild(row);
  })
}

window.onload = () => {
  const item = document.getElementById("area")
  const otherText = document.getElementById("otherText")
  item.oninput = () => otherText.innerText = do_mastery(item.value)

  const copier = document.getElementById("copier")
  copier.onclick = () => {
    // this includes a newline at the end... annoying...
    document.getSelection().setBaseAndExtent(otherText, 0, copier, 0);
    document.execCommand("copy")
    document.getSelection().empty()
  }

  // updateTable();

  const submitter = document.getElementById("submitter")
  const replacer = document.getElementById("replacer")
  const replaced = document.getElementById("replaced")
  submitter.onclick = () => {
    word_replacements[replaced.value] = replacer.value;

    console.log("body:", JSON.stringify(word_replacements))

    fetch("/update_replacements", {
      body: JSON.stringify(word_replacements),
      headers:{
        "Content-Type": "application/json"
      },
      method: "POST"
    })
    updateTable();
  }
}
