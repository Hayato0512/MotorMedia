const orderQuestionList = (questionList, order) => {
  let newQuestionList = [...questionList];
  console.log(
    "before sort, the questionList looks like this ",
    newQuestionList
  );
  if (order == "newest") {
    newQuestionList.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (order == "oldest") {
    newQuestionList.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else if (order == "popular") {
    newQuestionList.sort((a, b) => b.upvotes.length - a.upvotes.length);
  }

  console.log("after sort, the questionList looks like this ", newQuestionList);
  return newQuestionList;
};

export default orderQuestionList;
