$(`#import`).on('change', function () {
  let file = $(this).get(0).files[0];
  if (!file) {
    alert(`Please select a file.`);
    return;
  }
  let reader = new FileReader();
  reader.onload = () => {
    try {
      const importData = JSON.parse(reader.result);
      const scores = calcFinalScores(importData);
      outputScores(scores);
    } catch (e) {
      if (e instanceof SyntaxError || e instanceof ReferenceError) alert(e.name + ": " + e.message);
    }
  }
  reader.readAsText(file);
});

function calcFinalScores(data) {
  const games = [];
  for (const song of data) {
    if (song.songNumber === 1) games.push({});
    for (const player of song.players) {
      const lastGame = games[games.length - 1];
      if (lastGame === undefined) continue;
      let delta = 0;
      if (player.correct) {
        if (song.fromList.some((from) => from.name != player.name)) {
          delta = 1;
        } else if (song.fromList.some((from) => from.name == player.name)) {
          delta = -1;
        }
      }
      if (player.name in lastGame) {
        lastGame[player.name] += delta;
      } else {
        lastGame[player.name] = delta;
      }
    }
  }
  return games;
}

function outputScores(results) {
  results.forEach((game, index) => {
    const title = `<h4>Game ${index + 1}:</h4>`;
    let lis = ``;
    for (const player in game) {
      lis += `<li>${player}: ${game[player]}</li>`;
    }
    const row = $(`${title}<ul>${lis}</ul>`);
    console.log(row);
    $(`#output`).append(row);
  });
}