export default {
  activity(arg) {
    return {activity: arg};
  },
  puzzle(arg) {
    let result;
    switch (arg) {
      case "General": {
        result = {
          image: "general",
          prompt: "Hint: Think of the themes we had for mental health week!",
          answer: [ "CURIOUS", "MINDFUL", "PURPOSEFUL", "POSITIVE", "KIND", "ACTIVE",
                    "CURIOSITY", "MINDFULNESS", "PURPOSEFULNESS", "POSITIVITY", "KINDNESS" ]
        };
        break;
      }
      case "WordScramble": {
        result = {
          image: "scramble",
          prompt: "Unscramble the word!",
          answer: ["POSITIVE"]
        };
        break;
      }
      case "Hieroglyph": {
        result = {
          image: "hieroglyph.png",
          prompt: "Decode the missing word!",
          answer: ["HAPPY"]
        };
        break;
      }
      case "Riddle": {
        result = {
          image: "riddle",
          prompt: "Solve each riddle to assemble the 3-word phrase!",
          answer: ["MENTAL HEALTH WEEK"]
        };
        break;
      }
    }

    return result;
  },
  picture(arg) {
    return {
      image: `pics/${arg}.png`
    }
  },
  action(arg) {
    return { action: arg }
  },
};
