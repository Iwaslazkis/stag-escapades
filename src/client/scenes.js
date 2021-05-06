export default {
  activity(arg) {
    return {activity: arg};
  },
  puzzle(arg) {
    return {
      image: "/pics/puzzle1.png",
      prompt: "What do you think this means?",
      answer: "AEFH"
    }
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
