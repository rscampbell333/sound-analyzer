const frequencyA4 = 440;
const notes = ['A', 'B♭', 'B', 'C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭'];
const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
const frequencies = Array.from({ length: 96 }).map((_, i) => frequencyA4 * Math.pow(2, (i - 48) / 12));
const noteMap = {};

let noteNum = 0;
for (let i = 0; i < frequencies.length; i++) {
  const noteName = notes[i % 12];

  if (noteName === 'C') {
    noteNum++;
  }

  noteMap[frequencies[i]] = `${notes[i % 12]}${subscripts[noteNum]}`;
}

module.exports = {
  getClosest: frequency => {
    let found = false;

    let start = 0;
    let end = frequencies.length;

    if (frequency < frequencies[0]) {
      return {
        frequency: frequencies[0],
        name: noteMap[frequencies[0]],
        range: {
          low: 0,
          high: frequencies[0] * Math.pow(2, 1 / 24)
        }
      };
    }

    while (!found) {
      const i = start + Math.floor((end - start) / 2);

      if (frequencies[i] === frequency) {
        found = true;
        start = i;
        end = i;
      } else if (start === end) {
        break;
      } else if (frequencies[i] > frequency) {
        if (frequencies[i - 1] < frequency) {
          found = true;
          start = i - 1;
          end = i;
        } else {
          end = i - 1;
        }
      } else {
        if (frequencies[i + 1] > frequency) {
          found = true;
          start = i;
          end = i + 1;
        } else {
          start = i + 1;
        }
      }
    }

    if (found) {
      const midpoint = frequencies[start] * Math.pow(2, 1 / 24);

      const closest = midpoint > frequency ? frequencies[start] : frequencies[end];

      return {
        frequency: closest,
        name: noteMap[closest],
        range: {
          low: closest * Math.pow(2, -1 / 24),
          high: closest * Math.pow(2, 1 / 24)
        }
      };
    } else {
      return null;
    }
  }
};
