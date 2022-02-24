export const generateInputs = (inputs) => {
  const masks = [
    "{companies}",
    "{race singular}",
    "{race plural}",
    "{jobs}",
    "{nationalities}",
  ];

  const dict = {
    "{race plural}": "./race_plural.json",
    "{race singular}": "./race_singular.json",
    "{companies}": "./companies.json",
    "{jobs}": "./jobs.json",
    "{nationalities}": "./nationalities.json",
  };

  const result = inputs.filter((word) => masks.includes(word));

  let files = [];
  result.forEach((mask) => files.push(dict[mask]));

  let json = require(`${files[0]}`);
  const items = json.items;
  let sentences = [];

  for (let i = 0; i < result.length; i++) {
    let index = inputs.indexOf(result[i]);
    for (let j = 0; j < items.length; j++) {
      let begin = inputs.slice(0, index);
      let end = inputs.slice(index + 1);

      begin.push(items[j]);
      const final = begin.concat(end);

      let sentence = final.join(" ");
      sentence = capitalizeFirstLetterAndAppendPeriod(sentence);
      sentences.push(sentence);
    }
  }
  return sentences;
};

const capitalizeFirstLetterAndAppendPeriod = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1) + ".";
};
