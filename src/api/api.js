const fetchPosts = async () => {
  const response = await fetch('http://localhost:3000/posts?_sort=-id'); // _sort=-id means sorting the ids in reverse order

  const postData = await response.json();
  return postData;
};

export { fetchPosts };
