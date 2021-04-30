export default {
  activity(arg) {
    return {activity: arg};
  },
  puzzle(arg) {
    return {
      image: "/pics/puzzle1.jpg",
      prompt: "What do you think this means?",
      answer: "AEFH"
    }
  },
  picture(arg) {
    return {
      image: `pics/${arg}.jpg`
    }
  },
  action(arg) {
    return { action: arg }
  },
};
